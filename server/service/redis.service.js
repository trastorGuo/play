"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
let RedisService = class RedisService {
    constructor() {
        Object.defineProperty(this, "eventEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomOnlineUsers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "roomDataCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    async onModuleInit() {
        const { EventEmitter } = require('events');
        this.eventEmitter = new EventEmitter();
    }
    async onModuleDestroy() {
        if (this.eventEmitter) {
            this.eventEmitter.removeAllListeners();
        }
        this.roomOnlineUsers.clear();
        this.roomDataCache.clear();
    }
    async publishToRoom(roomCode, event, data) {
        const channel = `room:${roomCode}`;
        const message = {
            event,
            data,
            timestamp: new Date().toISOString()
        };
        this.eventEmitter.emit(channel, message);
    }
    async subscribeToRoom(roomCode, callback) {
        const channel = `room:${roomCode}`;
        this.eventEmitter.on(channel, (message) => {
            try {
                callback(message.event, message.data);
            }
            catch (error) {
                console.error('处理Redis消息失败:', error);
            }
        });
    }
    async unsubscribeFromRoom(roomCode) {
        const channel = `room:${roomCode}`;
        this.eventEmitter.removeAllListeners(channel);
    }
    async getRoomOnlineCount(roomCode) {
        const users = this.roomOnlineUsers.get(roomCode);
        return users ? users.size : 0;
    }
    async addUserToRoomOnline(roomCode, userId) {
        if (!this.roomOnlineUsers.has(roomCode)) {
            this.roomOnlineUsers.set(roomCode, new Set());
        }
        this.roomOnlineUsers.get(roomCode).add(userId);
    }
    async removeUserFromRoomOnline(roomCode, userId) {
        const users = this.roomOnlineUsers.get(roomCode);
        if (users) {
            users.delete(userId);
            if (users.size === 0) {
                this.roomOnlineUsers.delete(roomCode);
            }
        }
    }
    async getRoomOnlineUsers(roomCode) {
        const users = this.roomOnlineUsers.get(roomCode);
        return users ? Array.from(users) : [];
    }
    async cacheRoomData(roomCode, data, ttl = 3600) {
        this.roomDataCache.set(roomCode, {
            data,
            expireAt: Date.now() + (ttl * 1000)
        });
    }
    async getCachedRoomData(roomCode) {
        const cached = this.roomDataCache.get(roomCode);
        if (!cached)
            return null;
        if (Date.now() > cached.expireAt) {
            this.roomDataCache.delete(roomCode);
            return null;
        }
        return cached.data;
    }
    async clearRoomCache(roomCode) {
        this.roomDataCache.delete(roomCode);
        this.roomOnlineUsers.delete(roomCode);
    }
};
RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map