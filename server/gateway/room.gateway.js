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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomGateway = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../service/redis.service");
let RoomGateway = class RoomGateway {
    constructor(redisService) {
        Object.defineProperty(this, "redisService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: redisService
        });
        Object.defineProperty(this, "connections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "userSocketMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "socketUserMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "roomUserMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    handleConnection(socket) {
        this.connections.set(socket.id, socket);
        socket.on('joinRoom', async (data) => {
            await this.handleJoinRoom(data, socket);
        });
        socket.on('leaveRoom', async (data) => {
            await this.handleLeaveRoom(data, socket);
        });
        socket.on('room:message', async (data) => {
            socket.emit('message', { received: true, data });
        });
        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });
    }
    async handleDisconnect(socket) {
        const userId = this.socketUserMap.get(socket.id);
        if (userId) {
            for (const [roomCode, users] of this.roomUserMap.entries()) {
                if (users.has(userId)) {
                    users.delete(userId);
                    await this.redisService.removeUserFromRoomOnline(roomCode, userId);
                    this.broadcastToRoom(roomCode, 'userLeft', {
                        userId,
                        timestamp: new Date().toISOString()
                    });
                    if (users.size === 0) {
                        this.roomUserMap.delete(roomCode);
                    }
                }
            }
            this.userSocketMap.delete(userId);
            this.socketUserMap.delete(socket.id);
        }
        this.connections.delete(socket.id);
    }
    async handleJoinRoom(data, socket) {
        try {
            const { roomCode, userId, nickname } = data;
            if (!roomCode || !userId || !nickname) {
                socket.emit('error', { message: '参数不完整' });
                return;
            }
            const currentUserId = this.socketUserMap.get(socket.id);
            if (currentUserId) {
                for (const [oldRoomCode, users] of this.roomUserMap.entries()) {
                    if (users.has(currentUserId)) {
                        await this.handleLeaveRoom({ roomCode: oldRoomCode }, socket);
                    }
                }
            }
            socket.join(roomCode);
            this.userSocketMap.set(userId, socket.id);
            this.socketUserMap.set(socket.id, userId);
            if (!this.roomUserMap.has(roomCode)) {
                this.roomUserMap.set(roomCode, new Set());
            }
            this.roomUserMap.get(roomCode).add(userId);
            await this.redisService.addUserToRoomOnline(roomCode, userId);
            const onlineCount = await this.redisService.getRoomOnlineCount(roomCode);
            socket.emit('roomJoined', {
                roomCode,
                userId,
                nickname,
                onlineCount,
                timestamp: new Date().toISOString()
            });
            socket.to(roomCode).emit('userJoined', {
                userId,
                nickname,
                onlineCount,
                timestamp: new Date().toISOString()
            });
            await this.redisService.subscribeToRoom(roomCode, (event, eventData) => {
                this.localBroadcastToRoom(roomCode, event, eventData);
            });
        }
        catch (error) {
            console.error('加入房间失败:', error);
            socket.emit('error', { message: '加入房间失败' });
        }
    }
    async handleLeaveRoom(data, socket) {
        try {
            const { roomCode } = data;
            const userId = this.socketUserMap.get(socket.id);
            if (!userId) {
                return;
            }
            socket.leave(roomCode);
            const roomUsers = this.roomUserMap.get(roomCode);
            if (roomUsers) {
                roomUsers.delete(userId);
                if (roomUsers.size === 0) {
                    this.roomUserMap.delete(roomCode);
                    await this.redisService.unsubscribeFromRoom(roomCode);
                }
            }
            await this.redisService.removeUserFromRoomOnline(roomCode, userId);
            const onlineCount = await this.redisService.getRoomOnlineCount(roomCode);
            socket.to(roomCode).emit('userLeft', {
                userId,
                onlineCount,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('离开房间失败:', error);
        }
    }
    async broadcastToRoom(roomCode, event, data) {
        this.localBroadcastToRoom(roomCode, event, data);
        await this.redisService.publishToRoom(roomCode, event, data);
    }
    localBroadcastToRoom(roomCode, event, data) {
        const roomSockets = this.getRoomSockets(roomCode);
        roomSockets.forEach(socket => {
            socket.emit(event, Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() }));
        });
    }
    getRoomSockets(roomCode) {
        const roomUsers = this.roomUserMap.get(roomCode);
        if (!roomUsers)
            return [];
        const sockets = [];
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
    async getRoomOnlineCount(roomCode) {
        return await this.redisService.getRoomOnlineCount(roomCode);
    }
    isUserOnline(userId) {
        return this.userSocketMap.has(userId);
    }
    async sendToUser(userId, event, data) {
        const socketId = this.userSocketMap.get(userId);
        if (socketId) {
            const socket = this.connections.get(socketId);
            if (socket) {
                socket.emit(event, Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() }));
            }
        }
    }
};
RoomGateway = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RoomGateway);
exports.RoomGateway = RoomGateway;
//# sourceMappingURL=room.gateway.js.map