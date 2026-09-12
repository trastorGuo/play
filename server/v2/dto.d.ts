export declare class WechatLoginDto {
    code: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class CreateRoomDto {
    name: string;
    nickname: string;
}
export declare class JoinRoomDto {
    nickname: string;
    joinCode?: string;
    inviteToken?: string;
    scene?: string;
}
export declare class CreateRecordDto {
    toMemberId: string;
    points: number;
    note?: string;
}
export declare class ReverseRecordDto {
    reason?: string;
}
export declare class RenameMemberDto {
    nickname: string;
}
export declare class FeedbackDto {
    category: 'bug' | 'suggestion' | 'other';
    content: string;
    roomCode?: string;
    imageFileId?: string;
    contact?: string;
}
export declare class UpdateProfileDto {
    displayName: string;
    avatarFileId?: string;
}
