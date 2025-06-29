import { Room } from './room';
export declare class RoomUser {
    id: number;
    roomId: number;
    userId: number;
    nickname: string;
    balance: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    room: Room;
}
