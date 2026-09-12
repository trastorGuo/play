"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDeletionRequestV2 = exports.FeedbackFileV2 = exports.FeedbackV2 = exports.InviteTokenV2 = exports.OutboxEventV2 = exports.IdempotencyKeyV2 = exports.LedgerRecordV2 = exports.RoomMemberV2 = exports.RoomV2 = exports.RefreshTokenV2 = exports.ProfileAvatarV2 = exports.UserV2 = void 0;
const typeorm_1 = require("typeorm");
let UserV2 = class UserV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "wechatOpenidHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "unionidHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "displayName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "avatarFileId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updatedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], UserV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'wechat_openid_hash', length: 64 }),
    __metadata("design:type", String)
], UserV2.prototype, "wechatOpenidHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unionid_hash', length: 64, nullable: true }),
    __metadata("design:type", String)
], UserV2.prototype, "unionidHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', length: 40, nullable: true }),
    __metadata("design:type", String)
], UserV2.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_file_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", String)
], UserV2.prototype, "avatarFileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], UserV2.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], UserV2.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', precision: 3 }),
    __metadata("design:type", Date)
], UserV2.prototype, "updatedAt", void 0);
UserV2 = __decorate([
    (0, typeorm_1.Entity)('users_v2')
], UserV2);
exports.UserV2 = UserV2;
let ProfileAvatarV2 = class ProfileAvatarV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "storageKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mimeType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sizeBytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sha256", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProfileAvatarV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], ProfileAvatarV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_key', length: 255 }),
    __metadata("design:type", String)
], ProfileAvatarV2.prototype, "storageKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 64 }),
    __metadata("design:type", String)
], ProfileAvatarV2.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_bytes', type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], ProfileAvatarV2.prototype, "sizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sha256', type: 'char', length: 64 }),
    __metadata("design:type", String)
], ProfileAvatarV2.prototype, "sha256", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], ProfileAvatarV2.prototype, "createdAt", void 0);
ProfileAvatarV2 = __decorate([
    (0, typeorm_1.Entity)('profile_avatars_v2')
], ProfileAvatarV2);
exports.ProfileAvatarV2 = ProfileAvatarV2;
let RefreshTokenV2 = class RefreshTokenV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tokenHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "expiresAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "revokedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "replacedById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RefreshTokenV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RefreshTokenV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'token_hash', length: 64 }),
    __metadata("design:type", String)
], RefreshTokenV2.prototype, "tokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', precision: 3 }),
    __metadata("design:type", Date)
], RefreshTokenV2.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revoked_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], RefreshTokenV2.prototype, "revokedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'replaced_by_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", String)
], RefreshTokenV2.prototype, "replacedById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], RefreshTokenV2.prototype, "createdAt", void 0);
RefreshTokenV2 = __decorate([
    (0, typeorm_1.Entity)('refresh_tokens_v2')
], RefreshTokenV2);
exports.RefreshTokenV2 = RefreshTokenV2;
let RoomV2 = class RoomV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "joinCodeHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "joinCodeCiphertext", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "joinCodeIv", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "joinCodeTag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ownerUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxMembers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "closedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updatedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RoomV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'room_code', type: 'char', length: 6 }),
    __metadata("design:type", String)
], RoomV2.prototype, "roomCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'join_code_hash', type: 'char', length: 64 }),
    __metadata("design:type", String)
], RoomV2.prototype, "joinCodeHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'join_code_ciphertext', type: 'varbinary', length: 32, nullable: true }),
    __metadata("design:type", Buffer)
], RoomV2.prototype, "joinCodeCiphertext", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'join_code_iv', type: 'binary', length: 12, nullable: true }),
    __metadata("design:type", Buffer)
], RoomV2.prototype, "joinCodeIv", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'join_code_tag', type: 'binary', length: 16, nullable: true }),
    __metadata("design:type", Buffer)
], RoomV2.prototype, "joinCodeTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], RoomV2.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'owner_user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RoomV2.prototype, "ownerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'active' }),
    __metadata("design:type", String)
], RoomV2.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_members', type: 'tinyint', unsigned: true, default: 20 }),
    __metadata("design:type", Number)
], RoomV2.prototype, "maxMembers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true, default: 1 }),
    __metadata("design:type", String)
], RoomV2.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], RoomV2.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], RoomV2.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', precision: 3 }),
    __metadata("design:type", Date)
], RoomV2.prototype, "updatedAt", void 0);
RoomV2 = __decorate([
    (0, typeorm_1.Entity)('rooms_v2')
], RoomV2);
exports.RoomV2 = RoomV2;
let RoomMemberV2 = class RoomMemberV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "legacyRoomUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nickname", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nicknameNormalized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "balancePoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "joinedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "leftAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updatedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'room_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'legacy_room_user_id', type: 'bigint', nullable: true }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "legacyRoomUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nickname_normalized', length: 32 }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "nicknameNormalized", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_points', type: 'bigint', default: 0 }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "balancePoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'member' }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'active' }),
    __metadata("design:type", String)
], RoomMemberV2.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'joined_at', precision: 3 }),
    __metadata("design:type", Date)
], RoomMemberV2.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'left_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], RoomMemberV2.prototype, "leftAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', precision: 3 }),
    __metadata("design:type", Date)
], RoomMemberV2.prototype, "updatedAt", void 0);
RoomMemberV2 = __decorate([
    (0, typeorm_1.Entity)('room_members_v2'),
    (0, typeorm_1.Index)(['roomId', 'userId'], { unique: true })
], RoomMemberV2);
exports.RoomMemberV2 = RoomMemberV2;
let LedgerRecordV2 = class LedgerRecordV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fromMemberId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toMemberId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "points", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "originalRecordId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fromNicknameSnapshot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toNicknameSnapshot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "note", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "operatorUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "idempotencyKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "reversedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'room_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_member_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "fromMemberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_member_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "toMemberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'transfer' }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_record_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "originalRecordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_nickname_snapshot', length: 10 }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "fromNicknameSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_nickname_snapshot', length: 10 }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "toNicknameSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "operatorUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idempotency_key', length: 64 }),
    __metadata("design:type", String)
], LedgerRecordV2.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reversed_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], LedgerRecordV2.prototype, "reversedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], LedgerRecordV2.prototype, "createdAt", void 0);
LedgerRecordV2 = __decorate([
    (0, typeorm_1.Entity)('ledger_records_v2'),
    (0, typeorm_1.Index)(['operatorUserId', 'idempotencyKey'], { unique: true })
], LedgerRecordV2);
exports.LedgerRecordV2 = LedgerRecordV2;
let IdempotencyKeyV2 = class IdempotencyKeyV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "idempotencyKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "operation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "responseStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "responseJson", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "resourceType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "resourceId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "expiresAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updatedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idempotency_key', type: 'char', length: 36 }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "operation", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'processing' }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_hash', type: 'char', length: 64 }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "requestHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_status', type: 'smallint', unsigned: true, nullable: true }),
    __metadata("design:type", Number)
], IdempotencyKeyV2.prototype, "responseStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'response_json', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], IdempotencyKeyV2.prototype, "responseJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resource_type', length: 40, nullable: true }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "resourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resource_id', length: 64, nullable: true }),
    __metadata("design:type", String)
], IdempotencyKeyV2.prototype, "resourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', precision: 3 }),
    __metadata("design:type", Date)
], IdempotencyKeyV2.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], IdempotencyKeyV2.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', precision: 3 }),
    __metadata("design:type", Date)
], IdempotencyKeyV2.prototype, "updatedAt", void 0);
IdempotencyKeyV2 = __decorate([
    (0, typeorm_1.Entity)('idempotency_keys_v2'),
    (0, typeorm_1.Index)(['userId', 'idempotencyKey'], { unique: true })
], IdempotencyKeyV2);
exports.IdempotencyKeyV2 = IdempotencyKeyV2;
let OutboxEventV2 = class OutboxEventV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "aggregateType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "aggregateId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "payloadJson", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "attempts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "availableAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "publishedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], OutboxEventV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aggregate_type', length: 32 }),
    __metadata("design:type", String)
], OutboxEventV2.prototype, "aggregateType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aggregate_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], OutboxEventV2.prototype, "aggregateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_type', length: 40 }),
    __metadata("design:type", String)
], OutboxEventV2.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payload_json', type: 'json' }),
    __metadata("design:type", Object)
], OutboxEventV2.prototype, "payloadJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], OutboxEventV2.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'available_at', precision: 3 }),
    __metadata("design:type", Date)
], OutboxEventV2.prototype, "availableAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], OutboxEventV2.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], OutboxEventV2.prototype, "createdAt", void 0);
OutboxEventV2 = __decorate([
    (0, typeorm_1.Entity)('outbox_events_v2')
], OutboxEventV2);
exports.OutboxEventV2 = OutboxEventV2;
let InviteTokenV2 = class InviteTokenV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tokenHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "expiresAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "revokedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdBy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], InviteTokenV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'room_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], InviteTokenV2.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'token_hash', type: 'char', length: 64 }),
    __metadata("design:type", String)
], InviteTokenV2.prototype, "tokenHash", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], InviteTokenV2.prototype, "scene", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], InviteTokenV2.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revoked_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], InviteTokenV2.prototype, "revokedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], InviteTokenV2.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], InviteTokenV2.prototype, "createdAt", void 0);
InviteTokenV2 = __decorate([
    (0, typeorm_1.Entity)('invite_tokens_v2')
], InviteTokenV2);
exports.InviteTokenV2 = InviteTokenV2;
let FeedbackV2 = class FeedbackV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "category", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "content", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "imageFileId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contact", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_file_id', length: 128, nullable: true }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "imageFileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'submitted' }),
    __metadata("design:type", String)
], FeedbackV2.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], FeedbackV2.prototype, "createdAt", void 0);
FeedbackV2 = __decorate([
    (0, typeorm_1.Entity)('feedback_v2')
], FeedbackV2);
exports.FeedbackV2 = FeedbackV2;
let FeedbackFileV2 = class FeedbackFileV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "storageKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "originalName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mimeType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sizeBytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sha256", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 36 }),
    __metadata("design:type", String)
], FeedbackFileV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], FeedbackFileV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'storage_key', length: 255 }),
    __metadata("design:type", String)
], FeedbackFileV2.prototype, "storageKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_name', length: 255 }),
    __metadata("design:type", String)
], FeedbackFileV2.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 64 }),
    __metadata("design:type", String)
], FeedbackFileV2.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_bytes', type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], FeedbackFileV2.prototype, "sizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sha256', type: 'char', length: 64 }),
    __metadata("design:type", String)
], FeedbackFileV2.prototype, "sha256", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', precision: 3 }),
    __metadata("design:type", Date)
], FeedbackFileV2.prototype, "createdAt", void 0);
FeedbackFileV2 = __decorate([
    (0, typeorm_1.Entity)('feedback_files_v2')
], FeedbackFileV2);
exports.FeedbackFileV2 = FeedbackFileV2;
let AccountDeletionRequestV2 = class AccountDeletionRequestV2 {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "completedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], AccountDeletionRequestV2.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], AccountDeletionRequestV2.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, default: 'pending' }),
    __metadata("design:type", String)
], AccountDeletionRequestV2.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'requested_at', precision: 3 }),
    __metadata("design:type", Date)
], AccountDeletionRequestV2.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], AccountDeletionRequestV2.prototype, "completedAt", void 0);
AccountDeletionRequestV2 = __decorate([
    (0, typeorm_1.Entity)('account_deletion_requests_v2')
], AccountDeletionRequestV2);
exports.AccountDeletionRequestV2 = AccountDeletionRequestV2;
//# sourceMappingURL=entities.js.map