import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users_v2')
export class UserV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index({ unique: true }) @Column({ name: 'wechat_openid_hash', length: 64 }) wechatOpenidHash: string;
  @Column({ name: 'unionid_hash', length: 64, nullable: true }) unionidHash: string | null;
  @Column({ name: 'display_name', length: 40, nullable: true }) displayName: string | null;
  @Column({ name: 'avatar_file_id', type: 'char', length: 36, nullable: true }) avatarFileId: string | null;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', precision: 3 }) updatedAt: Date;
}

@Entity('profile_avatars_v2')
export class ProfileAvatarV2 {
  @PrimaryColumn({ type: 'char', length: 36 }) id: string;
  @Index() @Column({ name: 'user_id', type: 'bigint', unsigned: true }) userId: string;
  @Column({ name: 'storage_key', length: 255 }) storageKey: string;
  @Column({ name: 'mime_type', length: 64 }) mimeType: string;
  @Column({ name: 'size_bytes', type: 'int', unsigned: true }) sizeBytes: number;
  @Column({ name: 'sha256', type: 'char', length: 64 }) sha256: string;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('refresh_tokens_v2')
export class RefreshTokenV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index() @Column({ name: 'user_id', type: 'bigint', unsigned: true }) userId: string;
  @Index({ unique: true }) @Column({ name: 'token_hash', length: 64 }) tokenHash: string;
  @Column({ name: 'expires_at', precision: 3 }) expiresAt: Date;
  @Column({ name: 'revoked_at', precision: 3, nullable: true }) revokedAt: Date | null;
  @Column({ name: 'replaced_by_id', type: 'bigint', unsigned: true, nullable: true }) replacedById: string | null;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('rooms_v2')
export class RoomV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index({ unique: true }) @Column({ name: 'room_code', type: 'char', length: 6 }) roomCode: string;
  @Column({ name: 'join_code_hash', type: 'char', length: 64 }) joinCodeHash: string;
  @Column({ name: 'join_code_ciphertext', type: 'varbinary', length: 32, nullable: true }) joinCodeCiphertext: Buffer | null;
  @Column({ name: 'join_code_iv', type: 'binary', length: 12, nullable: true }) joinCodeIv: Buffer | null;
  @Column({ name: 'join_code_tag', type: 'binary', length: 16, nullable: true }) joinCodeTag: Buffer | null;
  @Column({ length: 20 }) name: string;
  @Index() @Column({ name: 'owner_user_id', type: 'bigint', unsigned: true }) ownerUserId: string;
  @Column({ length: 16, default: 'active' }) status: 'active' | 'closed' | 'archived';
  @Column({ name: 'max_members', type: 'tinyint', unsigned: true, default: 10 }) maxMembers: number;
  @Column({ type: 'bigint', unsigned: true, default: 1 }) version: string;
  @Column({ name: 'closed_at', precision: 3, nullable: true }) closedAt: Date | null;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', precision: 3 }) updatedAt: Date;
}

@Entity('room_members_v2')
@Index(['roomId', 'userId'], { unique: true })
export class RoomMemberV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index() @Column({ name: 'room_id', type: 'bigint', unsigned: true }) roomId: string;
  @Column({ name: 'user_id', type: 'bigint', unsigned: true, nullable: true }) userId: string | null;
  @Column({ name: 'legacy_room_user_id', type: 'bigint', nullable: true }) legacyRoomUserId: string | null;
  @Column({ length: 10 }) nickname: string;
  @Column({ name: 'nickname_normalized', length: 32 }) nicknameNormalized: string;
  @Column({ name: 'balance_points', type: 'bigint', default: 0 }) balancePoints: string;
  @Column({ length: 16, default: 'member' }) role: 'owner' | 'member';
  @Column({ length: 16, default: 'active' }) status: 'active' | 'left' | 'removed';
  @CreateDateColumn({ name: 'joined_at', precision: 3 }) joinedAt: Date;
  @Column({ name: 'left_at', precision: 3, nullable: true }) leftAt: Date | null;
  @UpdateDateColumn({ name: 'updated_at', precision: 3 }) updatedAt: Date;
}

@Entity('ledger_records_v2')
@Index(['operatorUserId', 'idempotencyKey'], { unique: true })
export class LedgerRecordV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index() @Column({ name: 'room_id', type: 'bigint', unsigned: true }) roomId: string;
  @Column({ name: 'from_member_id', type: 'bigint', unsigned: true }) fromMemberId: string;
  @Column({ name: 'to_member_id', type: 'bigint', unsigned: true }) toMemberId: string;
  @Column({ type: 'bigint', unsigned: true }) points: string;
  @Column({ length: 16, default: 'transfer' }) type: 'transfer' | 'reversal';
  @Column({ name: 'original_record_id', type: 'bigint', unsigned: true, nullable: true }) originalRecordId: string | null;
  @Column({ name: 'from_nickname_snapshot', length: 10 }) fromNicknameSnapshot: string;
  @Column({ name: 'to_nickname_snapshot', length: 10 }) toNicknameSnapshot: string;
  @Column({ length: 100, nullable: true }) note: string | null;
  @Column({ name: 'operator_user_id', type: 'bigint', unsigned: true }) operatorUserId: string;
  @Column({ name: 'idempotency_key', length: 64 }) idempotencyKey: string;
  @Column({ name: 'reversed_at', precision: 3, nullable: true }) reversedAt: Date | null;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('idempotency_keys_v2')
@Index(['userId', 'idempotencyKey'], { unique: true })
export class IdempotencyKeyV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Column({ name: 'user_id', type: 'bigint', unsigned: true }) userId: string;
  @Column({ name: 'idempotency_key', type: 'char', length: 36 }) idempotencyKey: string;
  @Column({ length: 40 }) operation: string;
  @Column({ length: 16, default: 'processing' }) status: 'processing' | 'succeeded' | 'failed';
  @Column({ name: 'request_hash', type: 'char', length: 64 }) requestHash: string;
  @Column({ name: 'response_status', type: 'smallint', unsigned: true, nullable: true }) responseStatus: number | null;
  @Column({ name: 'response_json', type: 'json', nullable: true }) responseJson: unknown;
  @Column({ name: 'resource_type', length: 40, nullable: true }) resourceType: string | null;
  @Column({ name: 'resource_id', length: 64, nullable: true }) resourceId: string | null;
  @Column({ name: 'expires_at', precision: 3 }) expiresAt: Date;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', precision: 3 }) updatedAt: Date;
}

@Entity('outbox_events_v2')
export class OutboxEventV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Column({ name: 'aggregate_type', length: 32 }) aggregateType: string;
  @Column({ name: 'aggregate_id', type: 'bigint', unsigned: true }) aggregateId: string;
  @Column({ name: 'event_type', length: 40 }) eventType: string;
  @Column({ name: 'payload_json', type: 'json' }) payloadJson: unknown;
  @Column({ type: 'int', unsigned: true, default: 0 }) attempts: number;
  @Column({ name: 'available_at', precision: 3 }) availableAt: Date;
  @Column({ name: 'published_at', precision: 3, nullable: true }) publishedAt: Date | null;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('invite_tokens_v2')
export class InviteTokenV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index() @Column({ name: 'room_id', type: 'bigint', unsigned: true }) roomId: string;
  @Index({ unique: true }) @Column({ name: 'token_hash', type: 'char', length: 64 }) tokenHash: string;
  @Index({ unique: true }) @Column({ length: 32 }) scene: string;
  @Column({ name: 'expires_at', precision: 3, nullable: true }) expiresAt: Date | null;
  @Column({ name: 'revoked_at', precision: 3, nullable: true }) revokedAt: Date | null;
  @Column({ name: 'created_by', type: 'bigint', unsigned: true }) createdBy: string;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('feedback_v2')
export class FeedbackV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index() @Column({ name: 'user_id', type: 'bigint', unsigned: true }) userId: string;
  @Column({ name: 'room_id', type: 'bigint', unsigned: true, nullable: true }) roomId: string | null;
  @Column({ length: 16 }) category: 'bug' | 'suggestion' | 'other';
  @Column({ length: 500 }) content: string;
  @Column({ name: 'image_file_id', length: 128, nullable: true }) imageFileId: string | null;
  @Column({ length: 100, nullable: true }) contact: string | null;
  @Column({ length: 16, default: 'submitted' }) status: string;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('feedback_files_v2')
export class FeedbackFileV2 {
  @PrimaryColumn({ type: 'char', length: 36 }) id: string;
  @Index() @Column({ name: 'user_id', type: 'bigint', unsigned: true }) userId: string;
  @Column({ name: 'storage_key', length: 255 }) storageKey: string;
  @Column({ name: 'original_name', length: 255 }) originalName: string;
  @Column({ name: 'mime_type', length: 64 }) mimeType: string;
  @Column({ name: 'size_bytes', type: 'int', unsigned: true }) sizeBytes: number;
  @Column({ name: 'sha256', type: 'char', length: 64 }) sha256: string;
  @CreateDateColumn({ name: 'created_at', precision: 3 }) createdAt: Date;
}

@Entity('account_deletion_requests_v2')
export class AccountDeletionRequestV2 {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: string;
  @Index({ unique: true }) @Column({ name: 'user_id', type: 'bigint', unsigned: true }) userId: string;
  @Column({ length: 16, default: 'pending' }) status: 'pending' | 'completed' | 'cancelled';
  @CreateDateColumn({ name: 'requested_at', precision: 3 }) requestedAt: Date;
  @Column({ name: 'completed_at', precision: 3, nullable: true }) completedAt: Date | null;
}
