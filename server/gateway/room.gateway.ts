import { Injectable } from '@nestjs/common';
import { RedisService } from '../service/redis.service';

@Injectable()
export class RoomGateway {
    private connections: Map<string, any> = new Map(); // socketId -> socket
    private userSocketMap = new Map<string, string>(); // userId -> socketId
    private socketUserMap = new Map<string, string>(); // socketId -> userId
    private roomUserMap = new Map<string, Set<string>>(); // roomCode -> Set<userId>

    constructor(private readonly redisService: RedisService) {}

    // 处理客户端连接
    handleConnection(socket: any) {
        console.log(`客户端连接: ${socket.id}`);
        this.connections.set(socket.id, socket);

        // 监听加入房间事件
        socket.on('joinRoom', async (data: { roomCode: string, userId: string, nickname: string }) => {
            await this.handleJoinRoom(data, socket);
        });

        // 监听离开房间事件
        socket.on('leaveRoom', async (data: { roomCode: string }) => {
            await this.handleLeaveRoom(data, socket);
        });

        // 监听房间消息事件
        socket.on('room:message', async (data: any) => {
            console.log('收到房间消息:', data);
            socket.emit('message', { received: true, data });
        });

        // 监听断开连接
        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });
    }

    // 处理客户端断开连接
    async handleDisconnect(socket: any) {
        const userId = this.socketUserMap.get(socket.id);
        if (userId) {
            // 从所有房间中移除用户
            for (const [roomCode, users] of this.roomUserMap.entries()) {
                if (users.has(userId)) {
                    users.delete(userId);
                    await this.redisService.removeUserFromRoomOnline(roomCode, userId);
                    
                    // 通知房间其他用户
                    this.broadcastToRoom(roomCode, 'userLeft', {
                        userId,
                        timestamp: new Date().toISOString()
                    });

                    // 如果房间没有用户了，清理房间
                    if (users.size === 0) {
                        this.roomUserMap.delete(roomCode);
                    }
                }
            }

            this.userSocketMap.delete(userId);
            this.socketUserMap.delete(socket.id);
        }
        
        this.connections.delete(socket.id);
        console.log(`客户端断开: ${socket.id}`);
    }

    // 处理加入房间
    async handleJoinRoom(
        data: { roomCode: string, userId: string, nickname: string },
        socket: any
    ) {
        try {
            const { roomCode, userId, nickname } = data;

            // 验证数据
            if (!roomCode || !userId || !nickname) {
                socket.emit('error', { message: '参数不完整' });
                return;
            }

            // 离开之前的房间
            const currentUserId = this.socketUserMap.get(socket.id);
            if (currentUserId) {
                // 清理之前的房间关系
                for (const [oldRoomCode, users] of this.roomUserMap.entries()) {
                    if (users.has(currentUserId)) {
                        await this.handleLeaveRoom({ roomCode: oldRoomCode }, socket);
                    }
                }
            }

            // 加入新房间
            socket.join(roomCode);
            
            // 更新映射关系
            this.userSocketMap.set(userId, socket.id);
            this.socketUserMap.set(socket.id, userId);
            
            if (!this.roomUserMap.has(roomCode)) {
                this.roomUserMap.set(roomCode, new Set());
            }
            this.roomUserMap.get(roomCode)!.add(userId);

            // 更新Redis中的在线用户
            await this.redisService.addUserToRoomOnline(roomCode, userId);

            // 获取房间在线用户数
            const onlineCount = await this.redisService.getRoomOnlineCount(roomCode);

            // 通知客户端加入成功
            socket.emit('roomJoined', {
                roomCode,
                userId,
                nickname,
                onlineCount,
                timestamp: new Date().toISOString()
            });

            // 通知房间其他用户
            socket.to(roomCode).emit('userJoined', {
                userId,
                nickname,
                onlineCount,
                timestamp: new Date().toISOString()
            });

            // 订阅Redis频道（用于跨服务器通信）
            await this.redisService.subscribeToRoom(roomCode, (event, eventData) => {
                // 只做本地广播，避免无限递归
                this.localBroadcastToRoom(roomCode, event, eventData);
            });

            console.log(`用户 ${nickname}(${userId}) 加入房间 ${roomCode}`);
        } catch (error) {
            console.error('加入房间失败:', error);
            socket.emit('error', { message: '加入房间失败' });
        }
    }

    // 处理离开房间
    async handleLeaveRoom(
        data: { roomCode: string },
        socket: any
    ) {
        try {
            const { roomCode } = data;
            const userId = this.socketUserMap.get(socket.id);

            if (!userId) {
                return;
            }

            // 离开Socket.IO房间
            socket.leave(roomCode);

            // 更新映射关系
            const roomUsers = this.roomUserMap.get(roomCode);
            if (roomUsers) {
                roomUsers.delete(userId);
                if (roomUsers.size === 0) {
                    this.roomUserMap.delete(roomCode);
                    await this.redisService.unsubscribeFromRoom(roomCode);
                }
            }

            // 更新Redis中的在线用户
            await this.redisService.removeUserFromRoomOnline(roomCode, userId);

            // 获取房间在线用户数
            const onlineCount = await this.redisService.getRoomOnlineCount(roomCode);

            // 通知房间其他用户
            socket.to(roomCode).emit('userLeft', {
                userId,
                onlineCount,
                timestamp: new Date().toISOString()
            });

            console.log(`用户 ${userId} 离开房间 ${roomCode}`);
        } catch (error) {
            console.error('离开房间失败:', error);
        }
    }

    // 发送房间消息（用于业务逻辑触发）
    async broadcastToRoom(roomCode: string, event: string, data: any) {
        // 本地广播
        this.localBroadcastToRoom(roomCode, event, data);

        // Redis广播（用于多服务器实例）
        await this.redisService.publishToRoom(roomCode, event, data);
    }

    // 只做本地广播，不触发Redis发布
    private localBroadcastToRoom(roomCode: string, event: string, data: any) {
        const roomSockets = this.getRoomSockets(roomCode);
        roomSockets.forEach(socket => {
            socket.emit(event, {
                ...data,
                timestamp: new Date().toISOString()
            });
        });
    }

    // 获取房间中的所有socket连接
    private getRoomSockets(roomCode: string): any[] {
        const roomUsers = this.roomUserMap.get(roomCode);
        if (!roomUsers) return [];

        const sockets: any[] = [];
        roomUsers.forEach(userId => {
            const socketId = this.userSocketMap.get(userId);
            if (socketId) {
                const socket = this.connections.get(socketId);
                if (socket) {
                    sockets.push(socket);
                }
            }
        });

        return sockets;
    }

    // 获取房间在线用户数
    async getRoomOnlineCount(roomCode: string): Promise<number> {
        return await this.redisService.getRoomOnlineCount(roomCode);
    }

    // 检查用户是否在线
    isUserOnline(userId: string): boolean {
        return this.userSocketMap.has(userId);
    }

    // 向特定用户发送消息
    async sendToUser(userId: string, event: string, data: any) {
        const socketId = this.userSocketMap.get(userId);
        if (socketId) {
            const socket = this.connections.get(socketId);
            if (socket) {
                socket.emit(event, {
                    ...data,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
} 