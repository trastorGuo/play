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
exports.RoomUser = void 0;
const typeorm_1 = require("typeorm");
const room_1 = require("./room");
let RoomUser = class RoomUser {
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
        Object.defineProperty(this, "nickname", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "balance", {
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
        Object.defineProperty(this, "isOwner", {
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
        Object.defineProperty(this, "room", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoomUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: '房间ID' }),
    __metadata("design:type", Number)
], RoomUser.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: '用户ID' }),
    __metadata("design:type", Number)
], RoomUser.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, comment: '用户昵称' }),
    __metadata("design:type", String)
], RoomUser.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '当前余额' }),
    __metadata("design:type", Number)
], RoomUser.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1, comment: '状态：1-在房间，0-已离开' }),
    __metadata("design:type", Number)
], RoomUser.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, comment: '是否是房主：1-是，0-否' }),
    __metadata("design:type", Number)
], RoomUser.prototype, "isOwner", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ comment: '加入时间' }),
    __metadata("design:type", Date)
], RoomUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ comment: '更新时间' }),
    __metadata("design:type", Date)
], RoomUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_1.Room, room => room.roomUsers),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", room_1.Room)
], RoomUser.prototype, "room", void 0);
RoomUser = __decorate([
    (0, typeorm_1.Entity)('room_users')
], RoomUser);
exports.RoomUser = RoomUser;
//# sourceMappingURL=roomUser.entity.js.map