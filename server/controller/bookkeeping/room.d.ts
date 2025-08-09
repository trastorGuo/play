import { Response } from 'express';
import { RoomService } from '../../service/bookkeeping/room';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    createRoom(body: {
        name?: string;
        ownerId: number;
        ownerName: string;
    }): Promise<{
        result: number;
        data: import("../../entity/bookkeeping/room").Room;
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
        message?: undefined;
    }>;
    getRoomInfo(roomCode: string): Promise<{
        result: number;
        data: any;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
    }>;
    getRoomRecords(roomCode: string): Promise<{
        result: number;
        data: import("../../entity/bookkeeping/expenseRecord.entity").ExpenseRecord[];
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
    }>;
    joinRoom(body: {
        roomCode: string;
        userId: number;
        nickname: string;
    }): Promise<{
        result: number;
        data: import("../../entity/bookkeeping/roomUser.entity").RoomUser;
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
        message?: undefined;
    }>;
    updateUserNickname(body: {
        roomCode: string;
        userId: number;
        nickname: string;
    }): Promise<{
        result: number;
        data: import("../../entity/bookkeeping/roomUser.entity").RoomUser;
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
        message?: undefined;
    }>;
    addExpenseRecord(body: {
        roomCode: string;
        fromUserId: number;
        toUserId: number;
        amount: number;
        operatorId: number;
    }): Promise<{
        result: number;
        data: import("../../entity/bookkeeping/expenseRecord.entity").ExpenseRecord;
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
        message?: undefined;
    }>;
    leaveRoom(body: {
        roomCode: string;
        userId: number;
    }): Promise<{
        result: number;
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        message?: undefined;
    }>;
    subscribeToRoomEvents(roomCode: string, response: Response): Promise<void>;
    adminTest(): Promise<{
        result: number;
        message: string;
        timestamp: string;
    }>;
    getAdminRoomsHistory(query: {
        page?: number;
        limit?: number;
        status?: number;
        ownerId?: number;
        keyword?: string;
    }): Promise<{
        result: number;
        data: {
            rooms: any[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
        message?: undefined;
    }>;
    getAdminRoomStats(roomCode: string): Promise<{
        result: number;
        data: any;
        message: string;
        error_msg?: undefined;
    } | {
        result: number;
        error_msg: any;
        data?: undefined;
        message?: undefined;
    }>;
}
