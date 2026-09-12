/// <reference types="node" />
/// <reference types="node" />
import { DataSource } from 'typeorm';
export declare class CompanionV2Service {
    private readonly db;
    constructor(db: DataSource);
    share(roomCode: string, userId: string): Promise<{
        inviteToken: string;
        scene: string;
        joinCode: string;
        qrCodeUrl: string;
    }>;
    reset(roomCode: string, userId: string, key: string): Promise<any>;
    uploadFeedbackImage(userId: string, file: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
    }): Promise<{
        fileId: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    uploadProfileAvatar(userId: string, file: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
    }, key: string): Promise<any>;
    updateProfile(userId: string, input: {
        displayName: string;
        avatarFileId?: string;
    }, key: string): Promise<any>;
    profileAvatar(id: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
    feedback(userId: string, input: {
        category: string;
        content: string;
        roomCode?: string;
        imageFileId?: string;
        contact?: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
    }>;
    feedbackList(userId: string): Promise<{
        items: {
            id: string;
            category: "bug" | "suggestion" | "other";
            content: string;
            status: string;
            createdAt: Date;
        }[];
        nextCursor: any;
    }>;
    me(userId: string): Promise<{
        id: string;
        displayName: string;
        avatarUrl: string;
        roomStats: {
            total: number;
            active: number;
            closed: number;
        };
    }>;
    deletionCheck(userId: string): Promise<{
        canApply: boolean;
        activeOwnedRoomCount: number;
    }>;
    requestDeletion(userId: string, key: string): Promise<any>;
    resolveScene(scene: string): Promise<{
        roomCode: string;
        name: string;
        ownerNickname: string;
        status: "active" | "closed" | "archived";
        activeMembers: number;
        maxMembers: number;
        updatedAt: Date;
    }>;
    private member;
    private pepper;
    private key;
    private encrypt;
    private decrypt;
    private publicBase;
    private profileDirectory;
    private avatarUrl;
    private validateImage;
}
