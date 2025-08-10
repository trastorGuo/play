import { RedisService } from '../service/redis.service';
export declare class RoomGateway {
    private readonly redisService;
    private connections;
    private userSocketMap;
    private socketUserMap;
    private roomUserMap;
    constructor(redisService: RedisService);
    handleConnection(socket: any): void;
    handleDisconnect(socket: any): Promise<void>;
    handleJoinRoom(data: {
        roomCode: string;
        userId: string;
        nickname: string;
    }, socket: any): Promise<void>;
    handleLeaveRoom(data: {
        roomCode: string;
    }, socket: any): Promise<void>;
    broadcastToRoom(roomCode: string, event: string, data: any): Promise<void>;
    private localBroadcastToRoom;
    private getRoomSockets;
    getRoomOnlineCount(roomCode: string): Promise<number>;
    isUserOnline(userId: string): boolean;
    sendToUser(userId: string, event: string, data: any): Promise<void>;
}
