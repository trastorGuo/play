"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2Module = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_1 = require("./auth");
const entities_1 = require("./entities");
const ledger_service_1 = require("./ledger.service");
const v2_controller_1 = require("./v2.controller");
const health_controller_1 = require("./health.controller");
const companion_controller_1 = require("./companion.controller");
const companion_service_1 = require("./companion.service");
const realtime_controller_1 = require("./realtime.controller");
const realtime_service_1 = require("./realtime.service");
const wechat_code_controller_1 = require("./wechat-code.controller");
const wechat_code_service_1 = require("./wechat-code.service");
let V2Module = class V2Module {
};
V2Module = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.UserV2, entities_1.RefreshTokenV2, entities_1.RoomV2, entities_1.RoomMemberV2, entities_1.LedgerRecordV2, entities_1.IdempotencyKeyV2, entities_1.OutboxEventV2, entities_1.InviteTokenV2, entities_1.FeedbackV2, entities_1.FeedbackFileV2, entities_1.ProfileAvatarV2, entities_1.AccountDeletionRequestV2])],
        controllers: [health_controller_1.V2HealthController, auth_1.AuthV2Controller, v2_controller_1.RoomsV2Controller, v2_controller_1.RoomPreviewV2Controller, v2_controller_1.OperationsV2Controller, companion_controller_1.CompanionV2Controller, companion_controller_1.InviteResolveV2Controller, companion_controller_1.ProfileAvatarV2Controller, realtime_controller_1.RealtimeV2Controller, wechat_code_controller_1.WechatCodeV2Controller],
        providers: [auth_1.TokenService, auth_1.V2AuthGuard, auth_1.AuthV2Service, ledger_service_1.LedgerV2Service, companion_service_1.CompanionV2Service, realtime_service_1.RealtimeV2Service, wechat_code_service_1.WechatCodeV2Service],
        exports: [realtime_service_1.RealtimeV2Service],
    })
], V2Module);
exports.V2Module = V2Module;
//# sourceMappingURL=v2.module.js.map