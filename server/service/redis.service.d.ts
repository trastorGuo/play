import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private eventEmitter;
    private roomOnlineUsers;
    private roomDataCache;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    publishToRoom(roomCode: string, event: string, data: any): Promise<void>;
    subscribeToRoom(roomCode: string, callback: (event: string, data: any) => void): Promise<void>;
    unsubscribeFromRoom(roomCode: string): Promise<void>;
    getRoomOnlineCount(roomCode: string): Promise<number>;
    addUserToRoomOnline(roomCode: string, userId: string): Promise<void>;
    removeUserFromRoomOnline(roomCode: string, userId: string): Promise<void>;
    getRoomOnlineUsers(roomCode: string): Promise<string[]>;
    cacheRoomData(roomCode: string, data: any, ttl?: number): Promise<void>;
    getCachedRoomData(roomCode: string): Promise<any | null>;
    clearRoomCache(roomCode: string): Promise<void>;
}
