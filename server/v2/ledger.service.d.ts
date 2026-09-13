import { DataSource } from 'typeorm';
export declare class LedgerV2Service {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    recent(userId: string): Promise<{
        roomCode: string;
        name: string;
        ownerNickname: string;
        ownerAvatarUrl: string;
        status: "active" | "closed" | "archived";
        activeMembers: number;
        maxMembers: number;
        updatedAt: Date;
        myBalancePoints: number;
        memberPreviews: {
            id: string;
            nickname: string;
            avatarUrl: string;
        }[];
    }[]>;
    preview(roomCode: string, invite?: string, scene?: string): Promise<{
        roomCode: string;
        name: string;
        ownerNickname: string;
        status: "active" | "closed" | "archived";
        activeMembers: number;
        maxMembers: number;
        updatedAt: Date;
    }>;
    create(userId: string, input: {
        name: string;
        nickname: string;
    }, key: string): Promise<{
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
            role: "owner" | "member";
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
    }>;
    join(userId: string, roomCode: string, input: {
        nickname: string;
        inviteToken?: string;
        scene?: string;
    }, key: string): Promise<{
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
            role: "owner" | "member";
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
    }>;
    snapshot(roomCode: string, userId: string): Promise<{
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
            role: "owner" | "member";
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
    }>;
    records(roomCode: string, userId: string, related?: boolean): Promise<{
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
    }>;
    transfer(roomCode: string, userId: string, input: {
        toMemberId: string;
        points: number;
        note?: string;
    }, key: string): Promise<{
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
    }>;
    reverse(roomCode: string, recordId: string, userId: string, reason: string | undefined, key: string): Promise<{
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
    }>;
    close(roomCode: string, userId: string, key: string): Promise<{
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
    }>;
    settlement(roomCode: string, userId: string): Promise<{
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
    }>;
    rename(roomCode: string, userId: string, nickname: string): Promise<{
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
            role: "owner" | "member";
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
    }>;
    leave(roomCode: string, userId: string, key: string): Promise<any>;
    operation(userId: string, key: string): Promise<{
        status: "processing" | "succeeded" | "failed";
        resourceType: string;
        resourceId: string;
        errorCode: any;
    } | {
        status: string;
        resourceType: any;
        resourceId: any;
        errorCode: any;
    }>;
    private snapshotWith;
    private settlementWith;
    private recordDto;
    private roomByCode;
    private lockRoom;
    private member;
    private assertWritable;
    private validateNickname;
    private validateRoomName;
    private validInvite;
    private bump;
    private outbox;
    private assertBalanced;
    private avatarUrl;
    private idempotent;
}
