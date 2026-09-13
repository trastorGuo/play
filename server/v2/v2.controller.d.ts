import { LedgerV2Service } from './ledger.service';
import { CreateRecordDto, CreateRoomDto, JoinRoomDto, RenameMemberDto, ReverseRecordDto } from './dto';
export declare class RoomsV2Controller {
    private readonly ledger;
    constructor(ledger: LedgerV2Service);
    create(userId: string, body: CreateRoomDto, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            roomCode: string;
            name: string;
            status: "active" | "closed" | "archived";
            version: number;
            currentMemberId: string;
            members: {
                id: string;
                nickname: string;
                avatarUrl: string;
                balancePoints: number;
                role: "member" | "owner";
                status: "active" | "left" | "removed";
                joinedAt: Date;
            }[];
            recentRecords: {
                id: string;
                type: "transfer" | "reversal";
                fromMemberId: string;
                fromNicknameSnapshot: string;
                toMemberId: string;
                toNicknameSnapshot: string;
                points: number;
                note: string;
                originalRecordId: string;
                reversedAt: Date;
                canReverse: boolean;
                createdAt: Date;
            }[];
            permissions: {
                canWrite: boolean;
                canClose: boolean;
                canReverseAny: boolean;
            };
        };
    }>;
    recent(userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            items: {
                roomCode: string;
                name: string;
                ownerNickname: string;
                status: "active" | "closed" | "archived";
                activeMembers: number;
                maxMembers: number;
                updatedAt: Date;
                myBalancePoints: number;
            }[];
            nextCursor: any;
        };
    }>;
    snapshot(roomCode: string, userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            roomCode: string;
            name: string;
            status: "active" | "closed" | "archived";
            version: number;
            currentMemberId: string;
            members: {
                id: string;
                nickname: string;
                avatarUrl: string;
                balancePoints: number;
                role: "member" | "owner";
                status: "active" | "left" | "removed";
                joinedAt: Date;
            }[];
            recentRecords: {
                id: string;
                type: "transfer" | "reversal";
                fromMemberId: string;
                fromNicknameSnapshot: string;
                toMemberId: string;
                toNicknameSnapshot: string;
                points: number;
                note: string;
                originalRecordId: string;
                reversedAt: Date;
                canReverse: boolean;
                createdAt: Date;
            }[];
            permissions: {
                canWrite: boolean;
                canClose: boolean;
                canReverseAny: boolean;
            };
        };
    }>;
    join(roomCode: string, userId: string, body: JoinRoomDto, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            roomCode: string;
            name: string;
            status: "active" | "closed" | "archived";
            version: number;
            currentMemberId: string;
            members: {
                id: string;
                nickname: string;
                avatarUrl: string;
                balancePoints: number;
                role: "member" | "owner";
                status: "active" | "left" | "removed";
                joinedAt: Date;
            }[];
            recentRecords: {
                id: string;
                type: "transfer" | "reversal";
                fromMemberId: string;
                fromNicknameSnapshot: string;
                toMemberId: string;
                toNicknameSnapshot: string;
                points: number;
                note: string;
                originalRecordId: string;
                reversedAt: Date;
                canReverse: boolean;
                createdAt: Date;
            }[];
            permissions: {
                canWrite: boolean;
                canClose: boolean;
                canReverseAny: boolean;
            };
        };
    }>;
    records(roomCode: string, userId: string, related: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            items: {
                id: string;
                type: "transfer" | "reversal";
                fromMemberId: string;
                fromNicknameSnapshot: string;
                toMemberId: string;
                toNicknameSnapshot: string;
                points: number;
                note: string;
                originalRecordId: string;
                reversedAt: Date;
                canReverse: boolean;
                createdAt: Date;
            }[];
            nextCursor: any;
        };
    }>;
    transfer(roomCode: string, userId: string, body: CreateRecordDto, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            record: {
                id: string;
                type: "transfer" | "reversal";
                fromMemberId: string;
                fromNicknameSnapshot: string;
                toMemberId: string;
                toNicknameSnapshot: string;
                points: number;
                note: string;
                originalRecordId: string;
                reversedAt: Date;
                canReverse: boolean;
                createdAt: Date;
            };
            roomVersion: number;
            balances: {
                memberId: string;
                balancePoints: number;
            }[];
        };
    }>;
    reverse(roomCode: string, recordId: string, userId: string, body: ReverseRecordDto, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            type: "transfer" | "reversal";
            fromMemberId: string;
            fromNicknameSnapshot: string;
            toMemberId: string;
            toNicknameSnapshot: string;
            points: number;
            note: string;
            originalRecordId: string;
            reversedAt: Date;
            canReverse: boolean;
            createdAt: Date;
        };
    }>;
    close(roomCode: string, userId: string, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            roomCode: string;
            status: "active" | "closed" | "archived";
            totalRecords: number;
            totalAmountMinor: number;
            startedAt: Date;
            closedAt: Date;
            balances: {
                memberId: string;
                nickname: string;
                balancePoints: number;
            }[];
        };
    }>;
    leave(roomCode: string, userId: string, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: any;
    }>;
    rename(roomCode: string, userId: string, body: RenameMemberDto, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            roomCode: string;
            name: string;
            status: "active" | "closed" | "archived";
            version: number;
            currentMemberId: string;
            members: {
                id: string;
                nickname: string;
                avatarUrl: string;
                balancePoints: number;
                role: "member" | "owner";
                status: "active" | "left" | "removed";
                joinedAt: Date;
            }[];
            recentRecords: {
                id: string;
                type: "transfer" | "reversal";
                fromMemberId: string;
                fromNicknameSnapshot: string;
                toMemberId: string;
                toNicknameSnapshot: string;
                points: number;
                note: string;
                originalRecordId: string;
                reversedAt: Date;
                canReverse: boolean;
                createdAt: Date;
            }[];
            permissions: {
                canWrite: boolean;
                canClose: boolean;
                canReverseAny: boolean;
            };
        };
    }>;
    settlement(roomCode: string, userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            roomCode: string;
            status: "active" | "closed" | "archived";
            totalRecords: number;
            totalAmountMinor: number;
            startedAt: Date;
            closedAt: Date;
            balances: {
                memberId: string;
                nickname: string;
                balancePoints: number;
            }[];
        };
    }>;
}
export declare class RoomPreviewV2Controller {
    private readonly ledger;
    constructor(ledger: LedgerV2Service);
    preview(roomCode: string, invite: string, scene: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            roomCode: string;
            name: string;
            ownerNickname: string;
            status: "active" | "closed" | "archived";
            activeMembers: number;
            maxMembers: number;
            updatedAt: Date;
        };
    }>;
}
export declare class OperationsV2Controller {
    private readonly ledger;
    constructor(ledger: LedgerV2Service);
    get(key: string, userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            status: "processing" | "succeeded" | "failed";
            resourceType: string;
            resourceId: string;
            errorCode: any;
        } | {
            status: string;
            resourceType: any;
            resourceId: any;
            errorCode: any;
        };
    }>;
}
