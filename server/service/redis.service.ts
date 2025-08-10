import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private eventEmitter: any;
    private roomOnlineUsers: Map<string, Set<string>> = new Map();
    private roomDataCache: Map<string, any> = new Map();

    async onModuleInit() {
        // 使用Node.js EventEmitter作为简单的内存发布订阅
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

    // 发布消息到房间频道
    async publishToRoom(roomCode: string, event: string, data: any): Promise<void> {
        const channel = `room:${roomCode}`;
        const message = {
            event,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.eventEmitter.emit(channel, message);
    }

    // 订阅房间频道
    async subscribeToRoom(roomCode: string, callback: (event: string, data: any) => void): Promise<void> {
        const channel = `room:${roomCode}`;
        
        this.eventEmitter.on(channel, (message) => {
            try {
                callback(message.event, message.data);
            } catch (error) {
                console.error('处理Redis消息失败:', error);
            }
        });
    }

    // 取消订阅房间频道
    async unsubscribeFromRoom(roomCode: string): Promise<void> {
        const channel = `room:${roomCode}`;
        this.eventEmitter.removeAllListeners(channel);
    }

    // 获取房间在线用户数
    async getRoomOnlineCount(roomCode: string): Promise<number> {
        const users = this.roomOnlineUsers.get(roomCode);
        return users ? users.size : 0;
    }

    // 添加用户到房间在线列表
    async addUserToRoomOnline(roomCode: string, userId: string): Promise<void> {
        if (!this.roomOnlineUsers.has(roomCode)) {
            this.roomOnlineUsers.set(roomCode, new Set());
        }
        this.roomOnlineUsers.get(roomCode)!.add(userId);
    }

    // 从房间在线列表移除用户
    async removeUserFromRoomOnline(roomCode: string, userId: string): Promise<void> {
        const users = this.roomOnlineUsers.get(roomCode);
        if (users) {
            users.delete(userId);
            if (users.size === 0) {
                this.roomOnlineUsers.delete(roomCode);
            }
        }
    }

    // 获取房间在线用户列表
    async getRoomOnlineUsers(roomCode: string): Promise<string[]> {
        const users = this.roomOnlineUsers.get(roomCode);
        return users ? Array.from(users) : [];
    }

    // 缓存房间数据
    async cacheRoomData(roomCode: string, data: any, ttl: number = 3600): Promise<void> {
        this.roomDataCache.set(roomCode, {
            data,
            expireAt: Date.now() + (ttl * 1000)
        });
    }

    // 获取缓存的房间数据
    async getCachedRoomData(roomCode: string): Promise<any | null> {
        const cached = this.roomDataCache.get(roomCode);
        if (!cached) return null;
        
        if (Date.now() > cached.expireAt) {
            this.roomDataCache.delete(roomCode);
            return null;
        }
        
        return cached.data;
    }

    // 清除房间缓存
    async clearRoomCache(roomCode: string): Promise<void> {
        this.roomDataCache.delete(roomCode);
        this.roomOnlineUsers.delete(roomCode);
    }
} 