"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_1 = require("../../entity/bookkeeping/room");
const roomUser_entity_1 = require("../../entity/bookkeeping/roomUser.entity");
const expenseRecord_entity_1 = require("../../entity/bookkeeping/expenseRecord.entity");
const events_1 = require("events");
class SSEManager extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "clients", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    addClient(roomId, response) {
        var _a;
        if (!this.clients.has(roomId)) {
            this.clients.set(roomId, []);
        }
        (_a = this.clients.get(roomId)) === null || _a === void 0 ? void 0 : _a.push(response);
    }
    removeClient(roomId, response) {
        const clients = this.clients.get(roomId);
        if (clients) {
            const index = clients.indexOf(response);
            if (index > -1) {
                clients.splice(index, 1);
            }
            if (clients.length === 0) {
                this.clients.delete(roomId);
            }
        }
    }
    broadcast(roomId, data) {
        const clients = this.clients.get(roomId);
        if (clients) {
            clients.forEach(client => {
                try {
                    client.write(`data: ${JSON.stringify(data)}\n\n`);
                }
                catch (error) {
                    console.error('SSE广播失败:', error);
                }
            });
        }
    }
}
const sseManager = new SSEManager();
let RoomService = class RoomService {
    constructor(roomRepository, roomUserRepository, expenseRecordRepository) {
        Object.defineProperty(this, "roomRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: roomRepository
        });
        Object.defineProperty(this, "roomUserRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: roomUserRepository
        });
        Object.defineProperty(this, "expenseRecordRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: expenseRecordRepository
        });
    }
    async generateRoomCode() {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            try {
                const lastRoom = await this.roomRepository
                    .createQueryBuilder('room')
                    .where('room.roomCode REGEXP \'^[0-9]+$\'')
                    .orderBy('CAST(room.roomCode AS UNSIGNED)', 'DESC')
                    .getOne();
                let nextRoomCode = '1';
                if (lastRoom && lastRoom.roomCode) {
                    const lastCode = parseInt(lastRoom.roomCode);
                    if (!isNaN(lastCode)) {
                        nextRoomCode = (lastCode + 1).toString();
                    }
                }
                const existingRoom = await this.roomRepository.findOne({
                    where: { roomCode: nextRoomCode }
                });
                if (!existingRoom) {
                    return nextRoomCode;
                }
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            catch (error) {
                console.error('生成房间号失败:', error);
                attempts++;
                if (attempts >= maxAttempts) {
                    return Date.now().toString().slice(-8);
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        return Date.now().toString().slice(-8);
    }
    async createRoom(data) {
        const roomCode = await this.generateRoomCode();
        const room = this.roomRepository.create({
            roomCode,
            name: data.name || `${data.ownerName}的房间`,
            ownerId: data.ownerId,
            ownerName: data.ownerName,
            currentUsers: 1
        });
        const savedRoom = await this.roomRepository.save(room);
        await this.joinRoom(savedRoom.id, {
            userId: data.ownerId,
            nickname: data.ownerName,
            isOwner: true
        });
        return savedRoom;
    }
    async getRoomInfo(roomCode) {
        const room = await this.roomRepository.findOne({
            where: { roomCode, status: 1 },
            relations: ['roomUsers', 'expenseRecords']
        });
        if (!room) {
            throw new Error('房间不存在或已关闭');
        }
        return room;
    }
    async joinRoom(roomId, userData) {
        const duplicateNickname = await this.roomUserRepository
            .createQueryBuilder('roomUser')
            .where('roomUser.roomId = :roomId', { roomId })
            .andWhere('roomUser.nickname = :nickname', { nickname: userData.nickname })
            .andWhere('roomUser.status = :status', { status: 1 })
            .andWhere('roomUser.userId != :userId', { userId: userData.userId })
            .getOne();
        if (duplicateNickname) {
            throw new Error('昵称已被使用，请换一个昵称');
        }
        const existingUser = await this.roomUserRepository.findOne({
            where: { roomId, userId: userData.userId, status: 1 }
        });
        if (existingUser) {
            return existingUser;
        }
        const roomUser = this.roomUserRepository.create({
            roomId,
            userId: userData.userId,
            nickname: userData.nickname,
            isOwner: userData.isOwner ? 1 : 0
        });
        const savedUser = await this.roomUserRepository.save(roomUser);
        await this.roomRepository.increment({ id: roomId }, 'currentUsers', 1);
        return savedUser;
    }
    async getRoomUsers(roomId) {
        return this.roomUserRepository.find({
            where: { roomId, status: 1 },
            order: { isOwner: 'DESC', createdAt: 'ASC' }
        });
    }
    async updateUserNickname(roomId, userId, nickname) {
        const duplicateNickname = await this.roomUserRepository
            .createQueryBuilder('roomUser')
            .where('roomUser.roomId = :roomId', { roomId })
            .andWhere('roomUser.nickname = :nickname', { nickname })
            .andWhere('roomUser.status = :status', { status: 1 })
            .andWhere('roomUser.userId != :userId', { userId })
            .getOne();
        if (duplicateNickname) {
            throw new Error('昵称已被使用，请换一个昵称');
        }
        const roomUser = await this.roomUserRepository.findOne({
            where: { roomId, userId, status: 1 }
        });
        if (!roomUser) {
            throw new Error('用户不在房间中');
        }
        const oldNickname = roomUser.nickname;
        roomUser.nickname = nickname;
        const updatedUser = await this.roomUserRepository.save(roomUser);
        await this.updateExpenseRecordNicknames(roomId, userId, oldNickname, nickname);
        if (roomUser.isOwner === 1) {
            await this.roomRepository.update({ id: roomId }, { ownerName: nickname });
        }
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if (room) {
            sseManager.broadcast(room.roomCode, {
                type: 'nickname_updated',
                data: {
                    userId,
                    oldNickname,
                    newNickname: nickname,
                    isOwner: roomUser.isOwner === 1,
                    updatedAt: new Date().toISOString()
                }
            });
        }
        return updatedUser;
    }
    async updateExpenseRecordNicknames(roomId, userId, oldNickname, newNickname) {
        await this.expenseRecordRepository
            .createQueryBuilder()
            .update(expenseRecord_entity_1.ExpenseRecord)
            .set({ fromUserName: newNickname })
            .where('roomId = :roomId AND fromUserId = :userId', { roomId, userId })
            .execute();
        await this.expenseRecordRepository
            .createQueryBuilder()
            .update(expenseRecord_entity_1.ExpenseRecord)
            .set({ toUserName: newNickname })
            .where('roomId = :roomId AND toUserId = :userId', { roomId, userId })
            .execute();
        await this.expenseRecordRepository
            .createQueryBuilder()
            .update(expenseRecord_entity_1.ExpenseRecord)
            .set({ operatorName: newNickname })
            .where('roomId = :roomId AND operatorName = :oldNickname', { roomId, oldNickname })
            .execute();
    }
    handleSSEConnection(roomCode, response) {
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });
        response.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);
        sseManager.addClient(roomCode, response);
        response.on('close', () => {
            sseManager.removeClient(roomCode, response);
        });
        const heartbeat = setInterval(() => {
            try {
                response.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
            }
            catch (error) {
                clearInterval(heartbeat);
                sseManager.removeClient(roomCode, response);
            }
        }, 30000);
        response.on('close', () => {
            clearInterval(heartbeat);
        });
    }
    broadcastRoomEvent(roomCode, eventType, data) {
        sseManager.broadcast(roomCode, {
            type: eventType,
            data,
            timestamp: new Date().toISOString()
        });
    }
    async addExpenseRecord(roomId, data) {
        const record = this.expenseRecordRepository.create(Object.assign({ roomId }, data));
        const savedRecord = await this.expenseRecordRepository.save(record);
        if (data.type === 'pay') {
            await this.roomUserRepository.decrement({ roomId, userId: data.fromUserId }, 'balance', data.amount);
            await this.roomUserRepository.increment({ roomId, userId: data.toUserId }, 'balance', data.amount);
        }
        return savedRecord;
    }
    async getRoomRecords(roomId) {
        return this.expenseRecordRepository.find({
            where: { roomId },
            order: { createdAt: 'DESC' }
        });
    }
    async getRoomActivities(roomId) {
        const expenseRecords = await this.expenseRecordRepository.find({
            where: { roomId },
            order: { createdAt: 'DESC' }
        });
        const userJoinRecords = await this.roomUserRepository.find({
            where: { roomId, status: 1 },
            order: { createdAt: 'ASC' }
        });
        const activities = [];
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
        return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async addUserToRoom(roomCode, userData) {
        const room = await this.getRoomInfo(roomCode);
        if (room.currentUsers >= room.maxUsers) {
            throw new Error('房间人数已满');
        }
        return this.joinRoom(room.id, {
            userId: userData.userId,
            nickname: userData.nickname
        });
    }
    async leaveRoom(roomId, userId) {
        const roomUser = await this.roomUserRepository.findOne({
            where: { roomId, userId, status: 1 }
        });
        if (roomUser) {
            roomUser.status = 0;
            await this.roomUserRepository.save(roomUser);
            await this.roomRepository.decrement({ id: roomId }, 'currentUsers', 1);
        }
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(roomUser_entity_1.RoomUser)),
    __param(2, (0, typeorm_1.InjectRepository)(expenseRecord_entity_1.ExpenseRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.js.map