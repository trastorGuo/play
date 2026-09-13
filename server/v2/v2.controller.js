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
exports.OperationsV2Controller = exports.RoomPreviewV2Controller = exports.RoomsV2Controller = void 0;
const common_1 = require("@nestjs/common");
const ledger_service_1 = require("./ledger.service");
const http_1 = require("./http");
const auth_1 = require("./auth");
const dto_1 = require("./dto");
let RoomsV2Controller = class RoomsV2Controller {
    constructor(ledger) {
        Object.defineProperty(this, "ledger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ledger
        });
    }
    async create(userId, body, key, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.create(userId, body, (0, http_1.assertIdempotencyKey)(key))); }
    async recent(userId, requestId = '') { return (0, http_1.ok)(requestId, { items: await this.ledger.recent(userId), nextCursor: null }); }
    async snapshot(roomCode, userId, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.snapshot(roomCode, userId)); }
    async join(roomCode, userId, body, key, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.join(userId, roomCode, body, (0, http_1.assertIdempotencyKey)(key))); }
    async records(roomCode, userId, related, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.records(roomCode, userId, related === 'true')); }
    async transfer(roomCode, userId, body, key, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.transfer(roomCode, userId, body, (0, http_1.assertIdempotencyKey)(key))); }
    async reverse(roomCode, recordId, userId, body, key, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.reverse(roomCode, recordId, userId, body === null || body === void 0 ? void 0 : body.reason, (0, http_1.assertIdempotencyKey)(key))); }
    async close(roomCode, userId, key, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.close(roomCode, userId, (0, http_1.assertIdempotencyKey)(key))); }
    async leave(roomCode, userId, key, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.leave(roomCode, userId, (0, http_1.assertIdempotencyKey)(key))); }
    async rename(roomCode, userId, body, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.rename(roomCode, userId, body.nickname)); }
    async settlement(roomCode, userId, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.settlement(roomCode, userId)); }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateRoomDto, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "create", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "recent", null);
__decorate([
    (0, common_1.Get)(':roomCode'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Post)(':roomCode/join'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('idempotency-key')),
    __param(4, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.JoinRoomDto, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "join", null);
__decorate([
    (0, common_1.Get)(':roomCode/records'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Query)('relatedToMe')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "records", null);
__decorate([
    (0, common_1.Post)(':roomCode/records'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('idempotency-key')),
    __param(4, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.CreateRecordDto, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "transfer", null);
__decorate([
    (0, common_1.Post)(':roomCode/records/:recordId/reverse'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, common_1.Param)('recordId')),
    __param(2, (0, http_1.CurrentUserId)()),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Headers)('idempotency-key')),
    __param(5, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, dto_1.ReverseRecordDto, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "reverse", null);
__decorate([
    (0, common_1.Post)(':roomCode/close'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "close", null);
__decorate([
    (0, common_1.Post)(':roomCode/leave'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "leave", null);
__decorate([
    (0, common_1.Patch)(':roomCode/me'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.RenameMemberDto, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "rename", null);
__decorate([
    (0, common_1.Get)(':roomCode/settlement'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomsV2Controller.prototype, "settlement", null);
RoomsV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/rooms'),
    (0, common_1.UseGuards)(auth_1.V2AuthGuard),
    __metadata("design:paramtypes", [ledger_service_1.LedgerV2Service])
], RoomsV2Controller);
exports.RoomsV2Controller = RoomsV2Controller;
let RoomPreviewV2Controller = class RoomPreviewV2Controller {
    constructor(ledger) {
        Object.defineProperty(this, "ledger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ledger
        });
    }
    async preview(roomCode, invite, scene, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.preview(roomCode, invite, scene)); }
};
__decorate([
    (0, common_1.Get)(':roomCode/preview'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, common_1.Query)('invite')),
    __param(2, (0, common_1.Query)('scene')),
    __param(3, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomPreviewV2Controller.prototype, "preview", null);
RoomPreviewV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/rooms'),
    __metadata("design:paramtypes", [ledger_service_1.LedgerV2Service])
], RoomPreviewV2Controller);
exports.RoomPreviewV2Controller = RoomPreviewV2Controller;
let OperationsV2Controller = class OperationsV2Controller {
    constructor(ledger) {
        Object.defineProperty(this, "ledger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ledger
        });
    }
    async get(key, userId, requestId = '') { return (0, http_1.ok)(requestId, await this.ledger.operation(userId, key)); }
};
__decorate([
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, http_1.CurrentUserId)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OperationsV2Controller.prototype, "get", null);
OperationsV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/operations'),
    (0, common_1.UseGuards)(auth_1.V2AuthGuard),
    __metadata("design:paramtypes", [ledger_service_1.LedgerV2Service])
], OperationsV2Controller);
exports.OperationsV2Controller = OperationsV2Controller;
//# sourceMappingURL=v2.controller.js.map