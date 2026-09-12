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
exports.RealtimeV2Controller = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("./auth");
const http_1 = require("./http");
const realtime_service_1 = require("./realtime.service");
let RealtimeV2Controller = class RealtimeV2Controller {
    constructor(realtime) {
        Object.defineProperty(this, "realtime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: realtime
        });
    }
    async ticket(userId, requestId = '') { return (0, http_1.ok)(requestId, await this.realtime.issue(userId)); }
};
__decorate([
    (0, common_1.Post)('ticket'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RealtimeV2Controller.prototype, "ticket", null);
RealtimeV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/realtime'),
    (0, common_1.UseGuards)(auth_1.V2AuthGuard),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeV2Service])
], RealtimeV2Controller);
exports.RealtimeV2Controller = RealtimeV2Controller;
//# sourceMappingURL=realtime.controller.js.map