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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const roomUser_entity_1 = require("./roomUser.entity");
const expenseRecord_entity_1 = require("./expenseRecord.entity");
let Room = class Room {
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
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ownerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ownerName", {
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
        Object.defineProperty(this, "currentUsers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxUsers", {
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
        Object.defineProperty(this, "roomUsers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "expenseRecords", {
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
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, comment: '房间号' }),
    __metadata("design:type", String)
], Room.prototype, "roomCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, comment: '房间名称' }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false, comment: '房主用户ID' }),
    __metadata("design:type", Number)
], Room.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false, comment: '房主名称' }),
    __metadata("design:type", String)
], Room.prototype, "ownerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1, comment: '房间状态：1-活跃，0-已关闭' }),
    __metadata("design:type", Number)
], Room.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, comment: '当前人数' }),
    __metadata("design:type", Number)
], Room.prototype, "currentUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 10, comment: '最大人数' }),
    __metadata("design:type", Number)
], Room.prototype, "maxUsers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ comment: '创建时间' }),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ comment: '更新时间' }),
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => roomUser_entity_1.RoomUser, roomUser => roomUser.room),
    __metadata("design:type", Array)
], Room.prototype, "roomUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expenseRecord_entity_1.ExpenseRecord, expenseRecord => expenseRecord.room),
    __metadata("design:type", Array)
], Room.prototype, "expenseRecords", void 0);
Room = __decorate([
    (0, typeorm_1.Entity)('rooms')
], Room);
exports.Room = Room;
//# sourceMappingURL=room.js.map