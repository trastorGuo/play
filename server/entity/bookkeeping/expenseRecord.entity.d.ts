import { Room } from './room';
export declare class ExpenseRecord {
    id: number;
    roomId: number;
    fromUserId: number;
    fromUserName: string;
    toUserId: number;
    toUserName: string;
    amount: number;
    type: string;
    note: string;
    operatorName: string;
    createdAt: Date;
    room: Room;
}
