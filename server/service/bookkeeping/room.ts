/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 23:08:26
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entity/bookkeeping/room';
import { RoomUser } from '../../entity/bookkeeping/roomUser.entity';
import { ExpenseRecord } from '../../entity/bookkeeping/expenseRecord.entity';
import { EventEmitter } from 'events';
import { RedisService } from '../redis.service';
import { RoomGateway } from '../../gateway/room.gateway';

// SSE事件管理器
class SSEManager extends EventEmitter {
    private clients: Map<string, any[]> = new Map();

    addClient(roomId: string, response: any) {
        if(!this.clients.has(roomId)) {
            this.clients.set(roomId, []);
        }
        this.clients.get(roomId)?.push(response);
    }

    removeClient(roomId: string, response: any) {
        const clients = this.clients.get(roomId);
        if(clients) {
            const index = clients.indexOf(response);
            if(index > -1) {
                clients.splice(index, 1);
            }
            if(clients.length === 0) {
                this.clients.delete(roomId);
            }
        }
    }

    broadcast(roomId: string, data: any) {
        const clients = this.clients.get(roomId);
        if(clients) {
            clients.forEach(client => {
                try {
                    client.write(`data: ${JSON.stringify(data)}\n\n`);
                } catch(error) {
                    console.error('SSE广播失败:', error);
                }
            });
        }
    }
}

const sseManager = new SSEManager();

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(RoomUser)
        private roomUserRepository: Repository<RoomUser>,
        @InjectRepository(ExpenseRecord)
        private expenseRecordRepository: Repository<ExpenseRecord>,
        private redisService: RedisService,
        private roomGateway: RoomGateway
    ) {}

    // 生成房间号 - 从1开始递增，避免高并发重复
    private async generateRoomCode(): Promise<string> {
        let attempts = 0;
        const maxAttempts = 10;
        
        while(attempts < maxAttempts) {
            try {
                // 获取当前最大的房间号
                const lastRoom = await this.roomRepository
                    .createQueryBuilder('room')
                    .where('room.roomCode REGEXP \'^[0-9]+$\'') // 只匹配纯数字房间号
                    .orderBy('CAST(room.roomCode AS UNSIGNED)', 'DESC')
                    .getOne();
                
                let nextRoomCode = '1';
                if(lastRoom && lastRoom.roomCode) {
                    const lastCode = parseInt(lastRoom.roomCode);
                    if(!isNaN(lastCode)) {
                        nextRoomCode = (lastCode + 1).toString();
                    }
                }
                
                // 检查房间号是否已存在（处理并发情况）
                const existingRoom = await this.roomRepository.findOne({
                    where: { roomCode: nextRoomCode }
                });
                
                if(!existingRoom) {
                    return nextRoomCode;
                }
                
                attempts++;
                // 如果冲突，稍等一下再试
                await new Promise(resolve => setTimeout(resolve, 50));
                
            } catch(error) {
                console.error('生成房间号失败:', error);
                attempts++;
                
                if(attempts >= maxAttempts) {
                    // 如果多次失败，使用时间戳作为备选方案
                    return Date.now().toString().slice(-8);
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // 备选方案：使用时间戳
        return Date.now().toString().slice(-8);
    }

    // 创建房间
    async createRoom(data: {
        name: string;
        ownerId: number;
        ownerName: string;
    }): Promise<Room> {
        const roomCode = await this.generateRoomCode();

        const room = this.roomRepository.create({
            roomCode,
            name: data.name || `${data.ownerName}的房间`,
            ownerId: data.ownerId,
            ownerName: data.ownerName,
            currentUsers: 1
        });

        const savedRoom = await this.roomRepository.save(room);

        // 房主自动加入房间
        await this.joinRoom(savedRoom.id, {
            userId: data.ownerId,
            nickname: data.ownerName
        });

        // 广播房间创建事件
        await this.roomGateway.broadcastToRoom(savedRoom.roomCode, 'roomCreated', {
            type: 'roomCreated',
            message: '房间已创建'
        });

        return savedRoom;
    }

    // 查询房间信息（包含活动时间线）
    async getRoomInfo(roomCode: string): Promise<any> {
        const room = await this.roomRepository.findOne({
            where: { roomCode, status: 1 },
            relations: ['roomUsers']
        });

        if(!room) {
            throw new Error('房间不存在或已关闭');
        }

        // 生成活动时间线
        const activities = await this.generateActivities(room.id);

        // 移除expenseRecords字段，避免与activities重复
        const roomData = {
            id: room.id,
            roomCode: room.roomCode,
            name: room.name,
            ownerId: room.ownerId,
            ownerName: room.ownerName,
            status: room.status,
            currentUsers: room.currentUsers,
            maxUsers: room.maxUsers,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            roomUsers: room.roomUsers,
            activities
        };

        return roomData;
    }

    // 生成活动时间线
    private async generateActivities(roomId: number): Promise<any[]> {
        // 获取交易记录
        const expenseRecords = await this.expenseRecordRepository.find({
            where: { roomId },
            order: { createdAt: 'DESC' }
        });

        // 获取用户加入记录
        const userJoinRecords = await this.roomUserRepository.find({
            where: { roomId, status: 1 },
            order: { createdAt: 'ASC' }
        });

        // 整合活动数据
        const activities = [];

        // 添加交易记录
        expenseRecords.forEach(record => {
            activities.push({
                id: `transaction_${record.id}`,
                type: 'transaction',
                fromUserName: record.fromUserName,
                toUserName: record.toUserName,
                amount: record.amount,
                transactionType: record.type,
                createdAt: record.createdAt,
                data: record
            });
        });

        // 添加用户加入记录
        userJoinRecords.forEach(user => {
            activities.push({
                id: `user_joined_${user.id}`,
                type: 'user_joined',
                userName: user.nickname,
                message: '加入了房间',
                createdAt: user.createdAt,
                data: user
            });
        });

        // 按时间排序（最新的在前面）
        return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // 加入房间
    async joinRoom(roomId: number, userData: {
        userId: number;
        nickname: string;
    }): Promise<RoomUser> {
        // 检查昵称是否重复（排除当前用户）
        const duplicateNickname = await this.roomUserRepository
            .createQueryBuilder('roomUser')
            .where('roomUser.roomId = :roomId', { roomId })
            .andWhere('roomUser.nickname = :nickname', { nickname: userData.nickname })
            .andWhere('roomUser.status = :status', { status: 1 })
            .andWhere('roomUser.userId != :userId', { userId: userData.userId })
            .getOne();

        if(duplicateNickname) {
            throw new Error('昵称已被使用，请换一个昵称');
        }

        // 检查用户是否已在房间中
        const existingUser = await this.roomUserRepository.findOne({
            where: { roomId, userId: userData.userId, status: 1 }
        });

        if(existingUser) {
            return existingUser;
        }

        const roomUser = this.roomUserRepository.create({
            roomId,
            userId: userData.userId,
            nickname: userData.nickname
        });

        const savedUser = await this.roomUserRepository.save(roomUser);

        // 更新房间人数
        await this.roomRepository.increment({ id: roomId }, 'currentUsers', 1);

        return savedUser;
    }

    // 获取房间用户列表
    async getRoomUsers(roomId: number): Promise<RoomUser[]> {
        return this.roomUserRepository.find({
            where: { roomId, status: 1 },
            order: { createdAt: 'ASC' }
        });
    }

    // 更新用户昵称
    async updateUserNickname(roomId: number, userId: number, nickname: string): Promise<RoomUser> {
        // 检查昵称是否重复（排除当前用户）
        const duplicateNickname = await this.roomUserRepository
            .createQueryBuilder('roomUser')
            .where('roomUser.roomId = :roomId', { roomId })
            .andWhere('roomUser.nickname = :nickname', { nickname })
            .andWhere('roomUser.status = :status', { status: 1 })
            .andWhere('roomUser.userId != :userId', { userId })
            .getOne();

        if(duplicateNickname) {
            throw new Error('昵称已被使用，请换一个昵称');
        }

        const roomUser = await this.roomUserRepository.findOne({
            where: { roomId, userId, status: 1 }
        });

        if(!roomUser) {
            throw new Error('用户不在房间中');
        }

        const oldNickname = roomUser.nickname;
        roomUser.nickname = nickname;
        const updatedUser = await this.roomUserRepository.save(roomUser);

        // 更新所有相关的交易记录中的昵称
        await this.updateExpenseRecordNicknames(roomId, userId, oldNickname, nickname);

        // 获取房间信息用于判断是否是房主和广播
        const roomInfo = await this.roomRepository.findOne({ where: { id: roomId } });
        
        // 如果更新的是房主昵称，也要更新房间表中的ownerName
        if(roomInfo && roomInfo.ownerId === userId) {
            await this.roomRepository.update(
                { id: roomId },
                { ownerName: nickname }
            );
        }

        // 广播昵称更新事件
        if(roomInfo) {
            await this.roomGateway.broadcastToRoom(roomInfo.roomCode, 'nicknameUpdated', {
                type: 'nicknameUpdated',
                message: '有用户更新了昵称'
            });
        }

        return updatedUser;
    }

    // 更新交易记录中的昵称
    private async updateExpenseRecordNicknames(roomId: number, userId: number, oldNickname: string, newNickname: string): Promise<void> {
        // 更新作为发起人的记录
        await this.expenseRecordRepository
            .createQueryBuilder()
            .update(ExpenseRecord)
            .set({ fromUserName: newNickname })
            .where('roomId = :roomId AND fromUserId = :userId', { roomId, userId })
            .execute();

        // 更新作为接收人的记录
        await this.expenseRecordRepository
            .createQueryBuilder()
            .update(ExpenseRecord)
            .set({ toUserName: newNickname })
            .where('roomId = :roomId AND toUserId = :userId', { roomId, userId })
            .execute();

        // 更新作为操作者的记录
        await this.expenseRecordRepository
            .createQueryBuilder()
            .update(ExpenseRecord)
            .set({ operatorName: newNickname })
            .where('roomId = :roomId AND operatorName = :oldNickname', { roomId, oldNickname })
            .execute();
    }

    // SSE连接处理
    handleSSEConnection(roomCode: string, response: any): void {
        // 设置SSE响应头
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        // 发送连接确认
        response.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

        // 添加客户端到管理器
        sseManager.addClient(roomCode, response);

        // 监听连接关闭
        response.on('close', () => {
            sseManager.removeClient(roomCode, response);
        });

        // 保持连接活跃
        const heartbeat = setInterval(() => {
            try {
                response.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
            } catch(error) {
                clearInterval(heartbeat);
                sseManager.removeClient(roomCode, response);
            }
        }, 30000); // 每30秒发送心跳

        response.on('close', () => {
            clearInterval(heartbeat);
        });
    }

    // 广播房间事件
    broadcastRoomEvent(roomCode: string, eventType: string, data: any): void {
        sseManager.broadcast(roomCode, {
            type: eventType,
            data,
            timestamp: new Date().toISOString()
        });
    }

    // 添加支出记录
    async addExpenseRecord(roomId: number, data: {
        fromUserId: number;
        fromUserName: string;
        toUserId: number;
        toUserName: string;
        amount: number;
        type: string;
        note?: string;
        operatorName: string;
    }): Promise<ExpenseRecord> {
        const record = this.expenseRecordRepository.create({
            roomId,
            ...data
        });

        const savedRecord = await this.expenseRecordRepository.save(record);

        // 更新用户余额
        if(data.type === 'pay') {
            // 付款方减少余额
            await this.roomUserRepository.decrement(
                { roomId, userId: data.fromUserId },
                'balance',
                data.amount
            );
            // 收款方增加余额
            await this.roomUserRepository.increment(
                { roomId, userId: data.toUserId },
                'balance',
                data.amount
            );
        }

        // 获取房间信息并广播支出记录添加事件
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if(room) {
            await this.roomGateway.broadcastToRoom(room.roomCode, 'expenseAdded', {
                type: 'expenseAdded',
                message: '有新的支出记录'
            });
        }

        return savedRecord;
    }

    // 获取房间记录
    async getRoomRecords(roomId: number): Promise<ExpenseRecord[]> {
        return this.expenseRecordRepository.find({
            where: { roomId },
            order: { createdAt: 'DESC' }
        });
    }



    // 添加用户到房间
    async addUserToRoom(roomCode: string, userData: {
        userId: number;
        nickname: string;
    }): Promise<RoomUser> {
        const room = await this.getRoomInfo(roomCode);
        
        if(room.currentUsers >= room.maxUsers) {
            throw new Error('房间人数已满');
        }

        const roomUser = await this.joinRoom(room.id, {
            userId: userData.userId,
            nickname: userData.nickname
        });

        // 广播用户加入房间事件
        await this.roomGateway.broadcastToRoom(roomCode, 'userJoined', {
            type: 'userJoined',
            message: '有新用户加入房间'
        });

        return roomUser;
    }

    // 离开房间
    async leaveRoom(roomId: number, userId: number): Promise<void> {
        const roomUser = await this.roomUserRepository.findOne({
            where: { roomId, userId, status: 1 }
        });

        if(roomUser) {
            roomUser.status = 0;
            await this.roomUserRepository.save(roomUser);
            
            // 更新房间人数
            await this.roomRepository.decrement({ id: roomId }, 'currentUsers', 1);
        }
    }

    // 管理员 - 获取历史房间列表
    async getAdminRoomsHistory(query: {
        page?: number;
        limit?: number;
        status?: number;
        ownerId?: number;
        keyword?: string;
    }): Promise<{
        rooms: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;

        let queryBuilder = this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.roomUsers', 'roomUsers')
            .leftJoinAndSelect('room.expenseRecords', 'expenseRecords');

        // 状态筛选
        if (query.status !== undefined) {
            queryBuilder = queryBuilder.andWhere('room.status = :status', { status: query.status });
        }

        // 房主筛选
        if (query.ownerId) {
            queryBuilder = queryBuilder.andWhere('room.ownerId = :ownerId', { ownerId: query.ownerId });
        }

        // 关键词搜索（房间名称或房主名称）
        if (query.keyword) {
            queryBuilder = queryBuilder.andWhere(
                '(room.name LIKE :keyword OR room.ownerName LIKE :keyword OR room.roomCode LIKE :keyword)',
                { keyword: `%${query.keyword}%` }
            );
        }

        // 获取总数
        const total = await queryBuilder.getCount();

        // 获取分页数据
        const rooms = await queryBuilder
            .orderBy('room.createdAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getMany();

        // 处理房间数据，添加统计信息
        const processedRooms = rooms.map(room => {
            const activeUsers = room.roomUsers ? room.roomUsers.filter(user => user.status === 1).length : 0;
            const totalTransactions = room.expenseRecords ? room.expenseRecords.length : 0;
            const totalAmount = room.expenseRecords ? 
                room.expenseRecords.reduce((sum, record) => sum + Number(record.amount), 0) : 0;

            // 计算最后活动时间
            let lastActivityTime = room.createdAt;
            if (room.expenseRecords && room.expenseRecords.length > 0) {
                const lastTransaction = room.expenseRecords.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                lastActivityTime = lastTransaction.createdAt;
            }

            return {
                id: room.id,
                roomCode: room.roomCode,
                name: room.name,
                ownerId: room.ownerId,
                ownerName: room.ownerName,
                status: room.status,
                maxUsers: room.maxUsers,
                createdAt: room.createdAt,
                updatedAt: room.updatedAt,
                // 统计信息
                activeUsers,
                totalUsers: room.roomUsers ? room.roomUsers.length : 0,
                totalTransactions,
                totalAmount: Number(totalAmount.toFixed(2)),
                lastActivityTime
            };
        });

        return {
            rooms: processedRooms,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    // 管理员 - 获取房间详细统计
    async getAdminRoomStats(roomCode: string): Promise<any> {
        const room = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.roomUsers', 'roomUsers')
            .leftJoinAndSelect('room.expenseRecords', 'expenseRecords')
            .where('room.roomCode = :roomCode', { roomCode })
            .getOne();

        if (!room) {
            throw new Error('房间不存在');
        }

        // 基本信息
        const basicInfo = {
            id: room.id,
            roomCode: room.roomCode,
            name: room.name,
            ownerId: room.ownerId,
            ownerName: room.ownerName,
            status: room.status,
            maxUsers: room.maxUsers,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        };

        // 用户统计
        const activeUsers = room.roomUsers ? room.roomUsers.filter(user => user.status === 1) : [];
        const inactiveUsers = room.roomUsers ? room.roomUsers.filter(user => user.status === 0) : [];
        
        const userStats = {
            totalUsers: room.roomUsers ? room.roomUsers.length : 0,
            activeUsers: activeUsers.length,
            inactiveUsers: inactiveUsers.length,
            userList: activeUsers.map(user => ({
                id: user.id,
                userId: user.userId,
                nickname: user.nickname,
                balance: Number(user.balance),
                joinedAt: user.createdAt,
                isOwner: user.userId === room.ownerId
            }))
        };

        // 交易统计
        const expenseRecords = room.expenseRecords || [];
        const totalTransactions = expenseRecords.length;
        const totalAmount = expenseRecords.reduce((sum, record) => sum + Number(record.amount), 0);
        
        // 按用户统计输赢
        const userTransactionStats: { [key: string]: any } = {};
        expenseRecords.forEach(record => {
            // 付款方
            if (!userTransactionStats[record.fromUserName]) {
                userTransactionStats[record.fromUserName] = {
                    nickname: record.fromUserName,
                    totalPaid: 0,
                    totalReceived: 0,
                    transactionCount: 0
                };
            }
            userTransactionStats[record.fromUserName].totalPaid += Number(record.amount);
            userTransactionStats[record.fromUserName].transactionCount++;

            // 收款方
            if (!userTransactionStats[record.toUserName]) {
                userTransactionStats[record.toUserName] = {
                    nickname: record.toUserName,
                    totalPaid: 0,
                    totalReceived: 0,
                    transactionCount: 0
                };
            }
            userTransactionStats[record.toUserName].totalReceived += Number(record.amount);
            if (userTransactionStats[record.toUserName].transactionCount === undefined) {
                userTransactionStats[record.toUserName].transactionCount = 0;
            }
        });

        // 计算净输赢
        Object.keys(userTransactionStats).forEach(nickname => {
            const stats = userTransactionStats[nickname];
            stats.netAmount = stats.totalReceived - stats.totalPaid;
            stats.totalPaid = Number(stats.totalPaid.toFixed(2));
            stats.totalReceived = Number(stats.totalReceived.toFixed(2));
            stats.netAmount = Number(stats.netAmount.toFixed(2));
        });

        const transactionStats = {
            totalTransactions,
            totalAmount: Number(totalAmount.toFixed(2)),
            averageTransactionAmount: totalTransactions > 0 ? Number((totalAmount / totalTransactions).toFixed(2)) : 0,
            userStats: Object.values(userTransactionStats),
            recentTransactions: expenseRecords
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map(record => ({
                    id: record.id,
                    fromUserName: record.fromUserName,
                    toUserName: record.toUserName,
                    amount: Number(record.amount),
                    type: record.type,
                    note: record.note,
                    operatorName: record.operatorName,
                    createdAt: record.createdAt
                }))
        };

        // 时间统计
        const firstTransaction = expenseRecords.length > 0 ? 
            expenseRecords.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0] : null;
        const lastTransaction = expenseRecords.length > 0 ? 
            expenseRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;

        const timeStats = {
            roomDuration: room.createdAt ? Math.floor((new Date().getTime() - new Date(room.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0, // 天数
            firstTransactionTime: firstTransaction ? firstTransaction.createdAt : null,
            lastTransactionTime: lastTransaction ? lastTransaction.createdAt : null,
            lastActivityTime: lastTransaction ? lastTransaction.createdAt : room.updatedAt
        };

        return {
            basicInfo,
            userStats,
            transactionStats,
            timeStats
        };
    }
}