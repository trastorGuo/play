"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const room_1 = require("../../entity/bookkeeping/room");
const roomUser_entity_1 = require("../../entity/bookkeeping/roomUser.entity");
const expenseRecord_entity_1 = require("../../entity/bookkeeping/expenseRecord.entity");
const room_2 = require("../../controller/bookkeeping/room");
const room_3 = require("../../service/bookkeeping/room");
const redis_service_1 = require("../../service/redis.service");
const room_gateway_1 = require("../../gateway/room.gateway");
let RoomModule = class RoomModule {
};
RoomModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([room_1.Room, roomUser_entity_1.RoomUser, expenseRecord_entity_1.ExpenseRecord])],
        controllers: [room_2.RoomController],
        providers: [room_3.RoomService, redis_service_1.RedisService, room_gateway_1.RoomGateway]
    })
], RoomModule);
exports.RoomModule = RoomModule;
//# sourceMappingURL=room.js.map