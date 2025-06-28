import { RoomUser } from './roomUser.entity';
import { ExpenseRecord } from './expenseRecord.entity';
export declare class Room {
    id: number;
    roomCode: string;
    name: string;
    ownerId: number;
    ownerName: string;
    status: number;
    currentUsers: number;
    maxUsers: number;
    createdAt: Date;
    updatedAt: Date;
    roomUsers: RoomUser[];
    expenseRecords: ExpenseRecord[];
}
