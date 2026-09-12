import { IsIn, IsInt, IsOptional, IsString, IsUUID, Length, Matches, Max, MaxLength, Min } from 'class-validator';

export class WechatLoginDto { @IsString() @Length(1, 128) code: string; }
export class RefreshTokenDto { @IsString() @Length(16, 512) refreshToken: string; }
export class CreateRoomDto { @IsString() @Length(1, 20) name: string; @IsString() @Length(1, 10) nickname: string; }
export class JoinRoomDto {
  @IsString() @Length(1, 10) nickname: string;
  @IsOptional() @Matches(/^[0-9]{4}$/) joinCode?: string;
  @IsOptional() @IsString() @MaxLength(256) inviteToken?: string;
  @IsOptional() @IsString() @MaxLength(32) scene?: string;
}
export class CreateRecordDto {
  @IsString() @Length(1, 64) toMemberId: string;
  @IsInt() @Min(1) @Max(99999) points: number;
  @IsOptional() @IsString() @MaxLength(100) note?: string;
}
export class ReverseRecordDto { @IsOptional() @IsString() @MaxLength(100) reason?: string; }
export class RenameMemberDto { @IsString() @Length(1, 10) nickname: string; }
export class FeedbackDto {
  @IsIn(['bug', 'suggestion', 'other']) category: 'bug' | 'suggestion' | 'other';
  @IsString() @Length(1, 500) content: string;
  @IsOptional() @Matches(/^[0-9]{6}$/) roomCode?: string;
  @IsOptional() @IsString() @MaxLength(128) imageFileId?: string;
  @IsOptional() @IsString() @MaxLength(100) contact?: string;
}
export class UpdateProfileDto {
  @IsString() @Length(1, 20) displayName: string;
  @IsOptional() @IsUUID() avatarFileId?: string;
}
