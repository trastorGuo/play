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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_1 = require("../../service/bookkeeping/room");
let RoomController = class RoomController {
    constructor(roomService) {
        Object.defineProperty(this, "roomService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: roomService
        });
    }
    async createRoom(body) {
        try {
            if (!body.ownerId || !body.ownerName) {
                return {
                    result: 0,
                    error_msg: '缺少必需参数：ownerId和ownerName'
                };
            }
            const roomData = {
                name: body.name || `${body.ownerName}的房间`,
                ownerId: body.ownerId,
                ownerName: body.ownerName
            };
            const room = await this.roomService.createRoom(roomData);
            return {
                result: 1,
                data: room,
                message: '房间创建成功'
            };
        }
        catch (error) {
            console.error('创建房间失败:', error);
            return {
                result: 0,
                error_msg: error.message || '创建房间失败'
            };
        }
    }
    async getRoomInfo(roomCode) {
        try {
            const room = await this.roomService.getRoomInfo(roomCode);
            return {
                result: 1,
                data: room
            };
        }
        catch (error) {
            return {
                result: 0,
                error_msg: error.message || '查询房间失败'
            };
        }
    }
    async getRoomRecords(roomCode) {
        try {
            const room = await this.roomService.getRoomInfo(roomCode);
            const records = await this.roomService.getRoomRecords(room.id);
            return {
                result: 1,
                data: records
            };
        }
        catch (error) {
            return {
                result: 0,
                error_msg: error.message || '获取记录失败'
            };
        }
    }
    async joinRoom(body) {
        try {
            const roomUser = await this.roomService.addUserToRoom(body.roomCode, {
                userId: body.userId,
                nickname: body.nickname
            });
            return {
                result: 1,
                data: roomUser,
                message: '加入房间成功'
            };
        }
        catch (error) {
            return {
                result: 0,
                error_msg: error.message || '加入房间失败'
            };
        }
    }
    async updateUserNickname(body) {
        try {
            const room = await this.roomService.getRoomInfo(body.roomCode);
            const roomUser = await this.roomService.updateUserNickname(room.id, body.userId, body.nickname);
            return {
                result: 1,
                data: roomUser,
                message: '昵称更新成功'
            };
        }
        catch (error) {
            return {
                result: 0,
                error_msg: error.message || '更新昵称失败'
            };
        }
    }
    async addExpenseRecord(body) {
        try {
            const room = await this.roomService.getRoomInfo(body.roomCode);
            const users = await this.roomService.getRoomUsers(room.id);
            const fromUser = users.find(u => u.userId === body.fromUserId);
            const toUser = users.find(u => u.userId === body.toUserId);
            const operator = users.find(u => u.userId === body.operatorId);
            if (!fromUser || !toUser || !operator) {
                throw new Error('用户不存在');
            }
            const recordData = {
                fromUserId: body.fromUserId,
                fromUserName: fromUser.nickname,
                toUserId: body.toUserId,
                toUserName: toUser.nickname,
                amount: body.amount,
                type: 'pay',
                operatorName: operator.nickname
            };
            const record = await this.roomService.addExpenseRecord(room.id, recordData);
            return {
                result: 1,
                data: record,
                message: '记录添加成功'
            };
        }
        catch (error) {
            return {
                result: 0,
                error_msg: error.message || '添加记录失败'
            };
        }
    }
    async leaveRoom(body) {
        try {
            const room = await this.roomService.getRoomInfo(body.roomCode);
            await this.roomService.leaveRoom(room.id, body.userId);
            return {
                result: 1,
                message: '离开房间成功'
            };
        }
        catch (error) {
            return {
                result: 0,
                error_msg: error.message || '离开房间失败'
            };
        }
    }
    async subscribeToRoomEvents(roomCode, response) {
        try {
            await this.roomService.getRoomInfo(roomCode);
            this.roomService.handleSSEConnection(roomCode, response);
        }
        catch (error) {
            response.status(404).json({
                result: 0,
                error_msg: error.message || '房间不存在'
            });
        }
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('info/:roomCode'),
    __param(0, (0, common_1.Param)('roomCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomInfo", null);
__decorate([
    (0, common_1.Get)('records/:roomCode'),
    __param(0, (0, common_1.Param)('roomCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomRecords", null);
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)('updateNickname'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "updateUserNickname", null);
__decorate([
    (0, common_1.Post)('addExpense'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "addExpenseRecord", null);
__decorate([
    (0, common_1.Post)('leave'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Get)(':roomCode/events'),
    __param(0, (0, common_1.Param)('roomCode')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "subscribeToRoomEvents", null);
RoomController = __decorate([
    (0, common_1.Controller)('api/room'),
    __metadata("design:paramtypes", [room_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.js.map