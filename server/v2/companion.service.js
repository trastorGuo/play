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
exports.CompanionV2Service = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const sha = (value) => (0, crypto_1.createHash)('sha256').update(value).digest('hex');
let CompanionV2Service = class CompanionV2Service {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
    }
    async share(roomCode, userId) { return this.db.transaction(async (manager) => { const room = await manager.findOne(entities_1.RoomV2, { where: { roomCode } }); if (!room)
        throw new common_1.NotFoundException({ code: 'ROOM_NOT_FOUND', message: '房间不存在' }); await this.member(manager, room.id, userId, true); if (room.status !== 'active')
        throw new common_1.ConflictException({ code: 'ROOM_CLOSED', message: '本房间已结束，只能查看记录' }); let joinCode = this.decrypt(room); if (!joinCode) {
        joinCode = String((0, crypto_1.randomInt)(1000, 10000));
        Object.assign(room, this.encrypt(joinCode));
        room.joinCodeHash = sha(`${this.pepper()}:${room.roomCode}:${joinCode}`);
        await manager.save(room);
    } const inviteToken = (0, crypto_1.randomBytes)(32).toString('base64url'); const scene = (0, crypto_1.randomBytes)(18).toString('base64url'); await manager.save(entities_1.InviteTokenV2, manager.create(entities_1.InviteTokenV2, { roomId: room.id, tokenHash: sha(inviteToken), scene, expiresAt: new Date(Date.now() + 7 * 86400000), revokedAt: null, createdBy: userId })); return { inviteToken, scene, joinCode, qrCodeUrl: `${this.publicBase()}/share-codes/${scene}.png` }; }); }
    async reset(roomCode, userId, key) { return this.db.transaction(async (manager) => { const existing = await manager.findOne(entities_1.IdempotencyKeyV2, { where: { userId, idempotencyKey: key } }); if ((existing === null || existing === void 0 ? void 0 : existing.status) === 'succeeded')
        return existing.responseJson; if (existing)
        throw new common_1.ConflictException({ code: 'OPERATION_PROCESSING', message: '请求正在处理中' }); const op = await manager.save(entities_1.IdempotencyKeyV2, manager.create(entities_1.IdempotencyKeyV2, { userId, idempotencyKey: key, operation: 'invite.reset', status: 'processing', requestHash: sha(roomCode), expiresAt: new Date(Date.now() + 86400000) })); const room = await manager.getRepository(entities_1.RoomV2).createQueryBuilder('room').setLock('pessimistic_write').where('room.room_code=:roomCode', { roomCode }).getOne(); if (!room)
        throw new common_1.NotFoundException({ code: 'ROOM_NOT_FOUND', message: '房间不存在' }); if (room.ownerUserId !== userId)
        throw new common_1.ForbiddenException({ code: 'OWNER_REQUIRED', message: '仅房主可以重置邀请' }); if (room.status !== 'active')
        throw new common_1.ConflictException({ code: 'ROOM_CLOSED', message: '本房间已结束，只能查看记录' }); await manager.getRepository(entities_1.InviteTokenV2).createQueryBuilder().update().set({ revokedAt: new Date() }).where('room_id=:roomId AND revoked_at IS NULL', { roomId: room.id }).execute(); const joinCode = String((0, crypto_1.randomInt)(1000, 10000)); Object.assign(room, this.encrypt(joinCode)); room.joinCodeHash = sha(`${this.pepper()}:${room.roomCode}:${joinCode}`); room.version = String(Number(room.version) + 1); await manager.save(room); const inviteToken = (0, crypto_1.randomBytes)(32).toString('base64url'); const scene = (0, crypto_1.randomBytes)(18).toString('base64url'); await manager.save(entities_1.InviteTokenV2, manager.create(entities_1.InviteTokenV2, { roomId: room.id, tokenHash: sha(inviteToken), scene, expiresAt: new Date(Date.now() + 7 * 86400000), revokedAt: null, createdBy: userId })); await manager.save(entities_1.OutboxEventV2, manager.create(entities_1.OutboxEventV2, { aggregateType: 'room', aggregateId: room.id, eventType: 'invite.reset', payloadJson: { type: 'room.version.changed', roomCode: room.roomCode, version: Number(room.version) }, attempts: 0, availableAt: new Date(), publishedAt: null })); const result = { inviteToken, scene, joinCode, qrCodeUrl: `${this.publicBase()}/share-codes/${scene}.png` }; op.status = 'succeeded'; op.responseStatus = 200; op.responseJson = result; await manager.save(op); return result; }); }
    async uploadFeedbackImage(userId, file) { if (!(file === null || file === void 0 ? void 0 : file.buffer))
        throw new common_1.BadRequestException({ code: 'FILE_REQUIRED', message: '请选择图片' }); if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype) || file.size > 5 * 1024 * 1024)
        throw new common_1.BadRequestException({ code: 'FILE_INVALID', message: '仅支持 5MB 内的 JPG、PNG 或 WebP 图片' }); const signatures = { "image/jpeg": Buffer.from([0xff, 0xd8, 0xff]), "image/png": Buffer.from([0x89, 0x50, 0x4e, 0x47]), "image/webp": Buffer.from('RIFF') }; const signature = signatures[file.mimetype]; if (!file.buffer.subarray(0, signature.length).equals(signature))
        throw new common_1.BadRequestException({ code: 'FILE_INVALID', message: '图片格式无效' }); const id = (0, crypto_1.randomUUID)(); const ext = file.mimetype === 'image/jpeg' ? 'jpg' : file.mimetype.split('/')[1]; const storageKey = `${id}.${ext}`; const directory = process.env.V2_FEEDBACK_UPLOAD_DIR || (0, path_1.join)(process.cwd(), 'storage', 'feedback-images'); await (0, promises_1.mkdir)(directory, { recursive: true }); await (0, promises_1.writeFile)((0, path_1.join)(directory, storageKey), file.buffer, { flag: 'wx' }); await this.db.getRepository(entities_1.FeedbackFileV2).save({ id, userId, storageKey, originalName: file.originalname.slice(0, 255), mimeType: file.mimetype, sizeBytes: file.size, sha256: sha(file.buffer) }); return { fileId: id }; }
    async uploadProfileAvatar(userId, file, key) { this.validateImage(file, 2); return this.db.transaction(async (manager) => { const requestHash = sha(file.buffer); const existing = await manager.findOne(entities_1.IdempotencyKeyV2, { where: { userId, idempotencyKey: key } }); if (existing) {
        if (existing.requestHash !== requestHash)
            throw new common_1.ConflictException({ code: 'IDEMPOTENCY_CONFLICT', message: '同一幂等键不能用于不同请求' });
        if (existing.status === 'succeeded')
            return existing.responseJson;
        throw new common_1.ConflictException({ code: 'OPERATION_PROCESSING', message: '请求正在处理中' });
    } const op = await manager.save(entities_1.IdempotencyKeyV2, manager.create(entities_1.IdempotencyKeyV2, { userId, idempotencyKey: key, operation: 'profile.avatar', status: 'processing', requestHash, responseStatus: null, responseJson: null, expiresAt: new Date(Date.now() + 86400000) })); const id = (0, crypto_1.randomUUID)(); const ext = file.mimetype === 'image/jpeg' ? 'jpg' : file.mimetype.split('/')[1]; const storageKey = `${id}.${ext}`; const directory = this.profileDirectory(); await (0, promises_1.mkdir)(directory, { recursive: true }); await (0, promises_1.writeFile)((0, path_1.join)(directory, storageKey), file.buffer, { flag: 'wx' }); await manager.save(entities_1.ProfileAvatarV2, manager.create(entities_1.ProfileAvatarV2, { id, userId, storageKey, mimeType: file.mimetype, sizeBytes: file.size, sha256: requestHash })); const result = { fileId: id, avatarUrl: this.avatarUrl(id) }; op.status = 'succeeded'; op.responseStatus = 200; op.responseJson = result; op.resourceType = 'profile_avatar'; op.resourceId = id; await manager.save(op); return result; }); }
    async updateProfile(userId, input, key) { var _a; const displayName = (_a = input.displayName) === null || _a === void 0 ? void 0 : _a.trim(); const length = [...(displayName || '')].length; if (length < 1 || length > 20)
        throw new common_1.BadRequestException({ code: 'PROFILE_NAME_INVALID', message: '昵称须为 1～20 个字' }); return this.db.transaction(async (manager) => { const requestHash = sha(JSON.stringify({ displayName, avatarFileId: input.avatarFileId || null })); const existing = await manager.findOne(entities_1.IdempotencyKeyV2, { where: { userId, idempotencyKey: key } }); if (existing) {
        if (existing.requestHash !== requestHash)
            throw new common_1.ConflictException({ code: 'IDEMPOTENCY_CONFLICT', message: '同一幂等键不能用于不同请求' });
        if (existing.status === 'succeeded')
            return existing.responseJson;
        throw new common_1.ConflictException({ code: 'OPERATION_PROCESSING', message: '请求正在处理中' });
    } const op = await manager.save(entities_1.IdempotencyKeyV2, manager.create(entities_1.IdempotencyKeyV2, { userId, idempotencyKey: key, operation: 'profile.update', status: 'processing', requestHash, responseStatus: null, responseJson: null, expiresAt: new Date(Date.now() + 86400000) })); const user = await manager.findOneByOrFail(entities_1.UserV2, { id: userId }); if (input.avatarFileId) {
        const avatar = await manager.findOne(entities_1.ProfileAvatarV2, { where: { id: input.avatarFileId, userId } });
        if (!avatar)
            throw new common_1.BadRequestException({ code: 'PROFILE_AVATAR_INVALID', message: '头像不存在' });
        user.avatarFileId = avatar.id;
    } user.displayName = displayName; await manager.save(user); const result = { id: String(user.id), displayName: user.displayName, avatarUrl: user.avatarFileId ? this.avatarUrl(user.avatarFileId) : null }; op.status = 'succeeded'; op.responseStatus = 200; op.responseJson = result; op.resourceType = 'user'; op.resourceId = String(user.id); await manager.save(op); return result; }); }
    async profileAvatar(id) { if (!/^[0-9a-f-]{36}$/i.test(id))
        throw new common_1.NotFoundException(); const avatar = await this.db.getRepository(entities_1.ProfileAvatarV2).findOne({ where: { id } }); if (!avatar)
        throw new common_1.NotFoundException(); return { buffer: await (0, promises_1.readFile)((0, path_1.join)(this.profileDirectory(), avatar.storageKey)), mimeType: avatar.mimeType }; }
    async feedback(userId, input) { var _a, _b; if (!['bug', 'suggestion', 'other'].includes(input.category) || !((_a = input.content) === null || _a === void 0 ? void 0 : _a.trim()) || input.content.length > 500)
        throw new common_1.BadRequestException({ code: 'FEEDBACK_INVALID', message: '请填写 1～500 字反馈' }); let roomId = null; if (input.roomCode) {
        const room = await this.db.getRepository(entities_1.RoomV2).findOne({ where: { roomCode: input.roomCode } });
        roomId = (room === null || room === void 0 ? void 0 : room.id) || null;
    } if (input.imageFileId) {
        const file = await this.db.getRepository(entities_1.FeedbackFileV2).findOne({ where: { id: input.imageFileId, userId } });
        if (!file)
            throw new common_1.BadRequestException({ code: 'FEEDBACK_IMAGE_INVALID', message: '反馈截图不存在' });
    } const row = await this.db.getRepository(entities_1.FeedbackV2).save({ userId, roomId, category: input.category, content: input.content.trim(), imageFileId: input.imageFileId || null, contact: ((_b = input.contact) === null || _b === void 0 ? void 0 : _b.trim()) || null, status: 'submitted' }); return { id: String(row.id), status: row.status, createdAt: row.createdAt }; }
    async feedbackList(userId) { const items = await this.db.getRepository(entities_1.FeedbackV2).find({ where: { userId }, order: { createdAt: 'DESC' }, take: 30 }); return { items: items.map(x => ({ id: String(x.id), category: x.category, content: x.content, status: x.status, createdAt: x.createdAt })), nextCursor: null }; }
    async me(userId) { const user = await this.db.getRepository(entities_1.UserV2).findOneByOrFail({ id: userId }); const members = await this.db.getRepository(entities_1.RoomMemberV2).find({ where: { userId } }); const ids = members.map(x => x.roomId); const rooms = ids.length ? await this.db.getRepository(entities_1.RoomV2).createQueryBuilder('r').where('r.id IN (:...ids)', { ids }).getMany() : []; return { id: String(user.id), displayName: user.displayName, avatarUrl: user.avatarFileId ? this.avatarUrl(user.avatarFileId) : null, roomStats: { total: rooms.length, active: rooms.filter(x => x.status === 'active').length, closed: rooms.filter(x => x.status === 'closed').length } }; }
    async deletionCheck(userId) { const activeOwnedRoomCount = await this.db.getRepository(entities_1.RoomV2).count({ where: { ownerUserId: userId, status: 'active' } }); return { canApply: activeOwnedRoomCount === 0, activeOwnedRoomCount }; }
    async requestDeletion(userId, key) { const check = await this.deletionCheck(userId); if (!check.canApply)
        throw new common_1.ConflictException({ code: 'ACTIVE_OWNED_ROOMS', message: '请先结束进行中的房主房间' }); return this.db.transaction(async (manager) => { const prior = await manager.findOne(entities_1.IdempotencyKeyV2, { where: { userId, idempotencyKey: key } }); if ((prior === null || prior === void 0 ? void 0 : prior.status) === 'succeeded')
        return prior.responseJson; const current = await manager.findOne(entities_1.AccountDeletionRequestV2, { where: { userId } }); const request = current || manager.create(entities_1.AccountDeletionRequestV2, { userId, status: 'pending', completedAt: null }); request.status = 'pending'; await manager.save(request); if (!prior)
        await manager.save(entities_1.IdempotencyKeyV2, manager.create(entities_1.IdempotencyKeyV2, { userId, idempotencyKey: key, operation: 'account.delete', status: 'succeeded', requestHash: sha(userId), responseStatus: 202, responseJson: { status: 'pending' }, resourceType: 'account_deletion', resourceId: String(request.id), expiresAt: new Date(Date.now() + 86400000) })); return { status: 'pending' }; }); }
    async resolveScene(scene) { var _a; const invite = await this.db.getRepository(entities_1.InviteTokenV2).findOne({ where: { scene, revokedAt: (0, typeorm_1.IsNull)() } }); if (!invite || invite.expiresAt && invite.expiresAt <= new Date())
        throw new common_1.NotFoundException({ code: 'INVITE_INVALID', message: '邀请已失效' }); const room = await this.db.getRepository(entities_1.RoomV2).findOne({ where: { id: invite.roomId } }); if (!room)
        throw new common_1.NotFoundException({ code: 'ROOM_NOT_FOUND', message: '房间不存在' }); const members = await this.db.getRepository(entities_1.RoomMemberV2).find({ where: { roomId: room.id, status: 'active' } }); return { roomCode: room.roomCode, name: room.name, ownerNickname: ((_a = members.find(x => x.role === 'owner')) === null || _a === void 0 ? void 0 : _a.nickname) || '', status: room.status, activeMembers: members.length, maxMembers: room.maxMembers, updatedAt: room.updatedAt }; }
    async member(manager, roomId, userId, activeOnly = false) { const m = await manager.findOne(entities_1.RoomMemberV2, { where: Object.assign({ roomId, userId }, (activeOnly ? { status: 'active' } : {})) }); if (!m)
        throw new common_1.ForbiddenException({ code: 'ROOM_FORBIDDEN', message: '你不是该房间成员' }); return m; }
    pepper() { const value = process.env.V2_JOIN_CODE_PEPPER; if (!value)
        throw new Error('V2_JOIN_CODE_PEPPER is required'); return value; }
    key() { const value = process.env.V2_JOIN_CODE_ENCRYPTION_KEY; if (!value)
        throw new Error('V2_JOIN_CODE_ENCRYPTION_KEY is required'); const key = Buffer.from(value, 'base64'); if (key.length !== 32)
        throw new Error('V2_JOIN_CODE_ENCRYPTION_KEY must be 32 bytes base64'); return key; }
    encrypt(value) { const joinCodeIv = (0, crypto_1.randomBytes)(12); const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', this.key(), joinCodeIv); const joinCodeCiphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]); return { joinCodeCiphertext, joinCodeIv, joinCodeTag: cipher.getAuthTag() }; }
    decrypt(room) { if (!room.joinCodeCiphertext || !room.joinCodeIv || !room.joinCodeTag)
        return ''; const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', this.key(), room.joinCodeIv); decipher.setAuthTag(room.joinCodeTag); return Buffer.concat([decipher.update(room.joinCodeCiphertext), decipher.final()]).toString('utf8'); }
    publicBase() { return (process.env.PUBLIC_API_BASE_URL || 'http://127.0.0.1:6015/api/v2').replace(/\/$/, ''); }
    profileDirectory() { return process.env.V2_PROFILE_AVATAR_DIR || (0, path_1.join)(process.cwd(), 'storage', 'profile-avatars'); }
    avatarUrl(id) { return `${this.publicBase()}/profile-avatars/${id}`; }
    validateImage(file, limitMb) { if (!(file === null || file === void 0 ? void 0 : file.buffer))
        throw new common_1.BadRequestException({ code: 'FILE_REQUIRED', message: '请选择图片' }); if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype) || file.size > limitMb * 1024 * 1024)
        throw new common_1.BadRequestException({ code: 'FILE_INVALID', message: `仅支持 ${limitMb}MB 内的 JPG、PNG 或 WebP 图片` }); const signatures = { "image/jpeg": Buffer.from([0xff, 0xd8, 0xff]), "image/png": Buffer.from([0x89, 0x50, 0x4e, 0x47]), "image/webp": Buffer.from('RIFF') }; const signature = signatures[file.mimetype]; if (!file.buffer.subarray(0, signature.length).equals(signature))
        throw new common_1.BadRequestException({ code: 'FILE_INVALID', message: '图片格式无效' }); }
};
CompanionV2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CompanionV2Service);
exports.CompanionV2Service = CompanionV2Service;
//# sourceMappingURL=companion.service.js.map