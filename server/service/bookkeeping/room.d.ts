import { Repository } from 'typeorm';
import { Room } from '../../entity/bookkeeping/room';
import { RoomUser } from '../../entity/bookkeeping/roomUser.entity';
import { ExpenseRecord } from '../../entity/bookkeeping/expenseRecord.entity';
export declare class RoomService {
    private roomRepository;
    private roomUserRepository;
    private expenseRecordRepository;
    constructor(roomRepository: Repository<Room>, roomUserRepository: Repository<RoomUser>, expenseRecordRepository: Repository<ExpenseRecord>);
    private generateRoomCode;
    createRoom(data: {
        name: string;
        ownerId: number;
        ownerName: string;
    }): Promise<Room>;
    getRoomInfo(roomCode: string): Promise<Room>;
    joinRoom(roomId: number, userData: {
        userId: number;
        nickname: string;
        isOwner?: boolean;
    }): Promise<RoomUser>;
    getRoomUsers(roomId: number): Promise<RoomUser[]>;
    updateUserNickname(roomId: number, userId: number, nickname: string): Promise<RoomUser>;
    private updateExpenseRecordNicknames;
    handleSSEConnection(roomCode: string, response: any): void;
    broadcastRoomEvent(roomCode: string, eventType: string, data: any): void;
    addExpenseRecord(roomId: number, data: {
        fromUserId: number;
        fromUserName: string;
        toUserId: number;
        toUserName: string;
        amount: number;
        type: string;
        note?: string;
        operatorName: string;
    }): Promise<ExpenseRecord>;
    getRoomRecords(roomId: number): Promise<ExpenseRecord[]>;
    getRoomActivities(roomId: number): Promise<any[]>;
    addUserToRoom(roomCode: string, userData: {
        userId: number;
        nickname: string;
    }): Promise<RoomUser>;
    leaveRoom(roomId: number, userId: number): Promise<void>;
}
