import { CompanionV2Service } from './companion.service';
import { FeedbackDto, UpdateProfileDto } from './dto';
export declare class CompanionV2Controller {
    private readonly service;
    constructor(service: CompanionV2Service);
    share(roomCode: string, userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            inviteToken: string;
            scene: string;
            joinCode: string;
            qrCodeUrl: string;
        };
    }>;
    reset(roomCode: string, userId: string, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: any;
    }>;
    feedbackList(userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            items: {
                id: string;
                category: "bug" | "suggestion" | "other";
                content: string;
                status: string;
                createdAt: Date;
            }[];
            nextCursor: any;
        };
    }>;
    feedback(userId: string, body: FeedbackDto, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
        };
    }>;
    upload(userId: string, file: any, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            fileId: `${string}-${string}-${string}-${string}-${string}`;
        };
    }>;
    uploadAvatar(userId: string, file: any, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: any;
    }>;
    me(userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            id: string;
            displayName: string;
            avatarUrl: string;
            roomStats: {
                total: number;
                active: number;
                closed: number;
            };
        };
    }>;
    updateMe(userId: string, body: UpdateProfileDto, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: any;
    }>;
    deletionCheck(userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            canApply: boolean;
            activeOwnedRoomCount: number;
        };
    }>;
    deletion(userId: string, key: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: any;
    }>;
}
export declare class ProfileAvatarV2Controller {
    private readonly service;
    constructor(service: CompanionV2Service);
    image(id: string, response: any): Promise<void>;
}
export declare class InviteResolveV2Controller {
    private readonly service;
    constructor(service: CompanionV2Service);
    resolve(scene: string, requestId?: string): Promise<{
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
