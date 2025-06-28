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
exports.ExpenseRecord = void 0;
const typeorm_1 = require("typeorm");
const room_1 = require("./room");
let ExpenseRecord = class ExpenseRecord {
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
        Object.defineProperty(this, "fromUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fromUserName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toUserName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "amount", {
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
        Object.defineProperty(this, "note", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "operatorName", {
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
], ExpenseRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: '房间ID' }),
    __metadata("design:type", Number)
], ExpenseRecord.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: '付款用户ID' }),
    __metadata("design:type", Number)
], ExpenseRecord.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, comment: '付款用户昵称' }),
    __metadata("design:type", String)
], ExpenseRecord.prototype, "fromUserName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: '收款用户ID' }),
    __metadata("design:type", Number)
], ExpenseRecord.prototype, "toUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, comment: '收款用户昵称' }),
    __metadata("design:type", String)
], ExpenseRecord.prototype, "toUserName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, comment: '金额' }),
    __metadata("design:type", Number)
], ExpenseRecord.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, comment: '类型：win-赢钱，lose-输钱，pay-支付，receive-收款' }),
    __metadata("design:type", String)
], ExpenseRecord.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true, comment: '备注' }),
    __metadata("design:type", String)
], ExpenseRecord.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, comment: '操作用户昵称' }),
    __metadata("design:type", String)
], ExpenseRecord.prototype, "operatorName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ comment: '记录时间' }),
    __metadata("design:type", Date)
], ExpenseRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_1.Room, room => room.expenseRecords),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", room_1.Room)
], ExpenseRecord.prototype, "room", void 0);
ExpenseRecord = __decorate([
    (0, typeorm_1.Entity)('expense_records')
], ExpenseRecord);
exports.ExpenseRecord = ExpenseRecord;
//# sourceMappingURL=expenseRecord.entity.js.map