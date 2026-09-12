/// <reference types="node" />
/// <reference types="node" />
export declare class UserV2 {
    id: string;
    wechatOpenidHash: string;
    unionidHash: string | null;
    displayName: string | null;
    avatarFileId: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProfileAvatarV2 {
    id: string;
    userId: string;
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
    sha256: string;
    createdAt: Date;
}
export declare class RefreshTokenV2 {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    replacedById: string | null;
    createdAt: Date;
}
export declare class RoomV2 {
    id: string;
    roomCode: string;
    joinCodeHash: string;
    joinCodeCiphertext: Buffer | null;
    joinCodeIv: Buffer | null;
    joinCodeTag: Buffer | null;
    name: string;
    ownerUserId: string;
    status: 'active' | 'closed' | 'archived';
    maxMembers: number;
    version: string;
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RoomMemberV2 {
    id: string;
    roomId: string;
    userId: string | null;
    legacyRoomUserId: string | null;
    nickname: string;
    nicknameNormalized: string;
    balancePoints: string;
    role: 'owner' | 'member';
    status: 'active' | 'left' | 'removed';
    joinedAt: Date;
    leftAt: Date | null;
    updatedAt: Date;
}
export declare class LedgerRecordV2 {
    id: string;
    roomId: string;
    fromMemberId: string;
    toMemberId: string;
    points: string;
    type: 'transfer' | 'reversal';
    originalRecordId: string | null;
    fromNicknameSnapshot: string;
    toNicknameSnapshot: string;
    note: string | null;
    operatorUserId: string;
    idempotencyKey: string;
    reversedAt: Date | null;
    createdAt: Date;
}
export declare class IdempotencyKeyV2 {
    id: string;
    userId: string;
    idempotencyKey: string;
    operation: string;
    status: 'processing' | 'succeeded' | 'failed';
    requestHash: string;
    responseStatus: number | null;
    responseJson: unknown;
    resourceType: string | null;
    resourceId: string | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class OutboxEventV2 {
    id: string;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payloadJson: unknown;
    attempts: number;
    availableAt: Date;
    publishedAt: Date | null;
    createdAt: Date;
}
export declare class InviteTokenV2 {
    id: string;
    roomId: string;
    tokenHash: string;
    scene: string;
    expiresAt: Date | null;
    revokedAt: Date | null;
    createdBy: string;
    createdAt: Date;
}
export declare class FeedbackV2 {
    id: string;
    userId: string;
    roomId: string | null;
    category: 'bug' | 'suggestion' | 'other';
    content: string;
    imageFileId: string | null;
    contact: string | null;
    status: string;
    createdAt: Date;
}
export declare class FeedbackFileV2 {
    id: string;
    userId: string;
    storageKey: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    sha256: string;
    createdAt: Date;
}
export declare class AccountDeletionRequestV2 {
    id: string;
    userId: string;
    status: 'pending' | 'completed' | 'cancelled';
    requestedAt: Date;
    completedAt: Date | null;
}
