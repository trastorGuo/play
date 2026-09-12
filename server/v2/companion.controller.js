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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteResolveV2Controller = exports.ProfileAvatarV2Controller = exports.CompanionV2Controller = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_1 = require("./auth");
const companion_service_1 = require("./companion.service");
const http_1 = require("./http");
const dto_1 = require("./dto");
let CompanionV2Controller = class CompanionV2Controller {
    constructor(service) {
        Object.defineProperty(this, "service", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: service
        });
    }
    async share(roomCode, userId, requestId = '') { return (0, http_1.ok)(requestId, await this.service.share(roomCode, userId)); }
    async reset(roomCode, userId, key, requestId = '') { return (0, http_1.ok)(requestId, await this.service.reset(roomCode, userId, (0, http_1.assertIdempotencyKey)(key))); }
    async feedbackList(userId, requestId = '') { return (0, http_1.ok)(requestId, await this.service.feedbackList(userId)); }
    async feedback(userId, body, requestId = '') { return (0, http_1.ok)(requestId, await this.service.feedback(userId, body)); }
    async upload(userId, file, requestId = '') { return (0, http_1.ok)(requestId, await this.service.uploadFeedbackImage(userId, file)); }
    async uploadAvatar(userId, file, key, requestId = '') { return (0, http_1.ok)(requestId, await this.service.uploadProfileAvatar(userId, file, (0, http_1.assertIdempotencyKey)(key))); }
    async me(userId, requestId = '') { return (0, http_1.ok)(requestId, await this.service.me(userId)); }
    async updateMe(userId, body, key, requestId = '') { return (0, http_1.ok)(requestId, await this.service.updateProfile(userId, body, (0, http_1.assertIdempotencyKey)(key))); }
    async deletionCheck(userId, requestId = '') { return (0, http_1.ok)(requestId, await this.service.deletionCheck(userId)); }
    async deletion(userId, key, requestId = '') { return (0, http_1.ok)(requestId, await this.service.requestDeletion(userId, (0, http_1.assertIdempotencyKey)(key))); }
};
__decorate([
    (0, common_1.Post)('rooms/:roomCode/share-code'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "share", null);
__decorate([
    (0, common_1.Post)('rooms/:roomCode/invite/reset'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "reset", null);
__decorate([
    (0, common_1.Get)('feedback'),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "feedbackList", null);
__decorate([
    (0, common_1.Post)('feedback'),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.FeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "feedback", null);
__decorate([
    (0, common_1.Post)('files/feedback-images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 } })),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('files/profile-avatars'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 2 * 1024 * 1024 } })),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProfileDto, String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('me/account-deletion/check'),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "deletionCheck", null);
__decorate([
    (0, common_1.Post)('me/account-deletion'),
    (0, common_1.HttpCode)(202),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Headers)('idempotency-key')),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CompanionV2Controller.prototype, "deletion", null);
CompanionV2Controller = __decorate([
    (0, common_1.UseGuards)(auth_1.V2AuthGuard),
    (0, common_1.Controller)('api/v2'),
    __metadata("design:paramtypes", [companion_service_1.CompanionV2Service])
], CompanionV2Controller);
exports.CompanionV2Controller = CompanionV2Controller;
let ProfileAvatarV2Controller = class ProfileAvatarV2Controller {
    constructor(service) {
        Object.defineProperty(this, "service", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: service
        });
    }
    async image(id, response) { const file = await this.service.profileAvatar(id); response.setHeader('Content-Type', file.mimeType); response.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); response.send(file.buffer); }
};
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileAvatarV2Controller.prototype, "image", null);
ProfileAvatarV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/profile-avatars'),
    __metadata("design:paramtypes", [companion_service_1.CompanionV2Service])
], ProfileAvatarV2Controller);
exports.ProfileAvatarV2Controller = ProfileAvatarV2Controller;
let InviteResolveV2Controller = class InviteResolveV2Controller {
    constructor(service) {
        Object.defineProperty(this, "service", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: service
        });
    }
    async resolve(scene, requestId = '') { return (0, http_1.ok)(requestId, await this.service.resolveScene(scene)); }
};
__decorate([
    (0, common_1.Get)('scene/:scene'),
    __param(0, (0, common_1.Param)('scene')),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InviteResolveV2Controller.prototype, "resolve", null);
InviteResolveV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/invites'),
    __metadata("design:paramtypes", [companion_service_1.CompanionV2Service])
], InviteResolveV2Controller);
exports.InviteResolveV2Controller = InviteResolveV2Controller;
//# sourceMappingURL=companion.controller.js.map