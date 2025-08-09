"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const test_1 = require("./test/test");
const room_1 = require("./bookkeeping/room");
const typeorm_1 = require("@nestjs/typeorm");
const room_2 = require("../entity/bookkeeping/room");
const roomUser_entity_1 = require("../entity/bookkeeping/roomUser.entity");
const expenseRecord_entity_1 = require("../entity/bookkeeping/expenseRecord.entity");
const redis_service_1 = require("../service/redis.service");
const app_controller_1 = require("../controller/app.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            test_1.TestModule,
            room_1.RoomModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: '81.68.255.143',
                port: 3306,
                username: 'trastor',
                password: 'ab1997gz0314',
                database: 'play',
                entities: [room_2.Room, roomUser_entity_1.RoomUser, expenseRecord_entity_1.ExpenseRecord],
                autoLoadEntities: true,
                synchronize: true
            })
        ],
        controllers: [app_controller_1.AppController],
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.js.map