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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatCodeV2Controller = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const wechat_code_service_1 = require("./wechat-code.service");
let WechatCodeV2Controller = class WechatCodeV2Controller {
    constructor(codes) {
        Object.defineProperty(this, "codes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: codes
        });
    }
    async image(scene, envVersion, response) { const image = await this.codes.image(scene, envVersion); response.setHeader('Content-Type', image[0] === 0xff ? 'image/jpeg' : 'image/png'); response.setHeader('Cache-Control', 'private,max-age=300'); response.send(image); }
};
__decorate([
    (0, common_1.Get)(':scene.png'),
    __param(0, (0, common_1.Param)('scene')),
    __param(1, (0, common_1.Query)('envVersion')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], WechatCodeV2Controller.prototype, "image", null);
WechatCodeV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/share-codes'),
    __metadata("design:paramtypes", [wechat_code_service_1.WechatCodeV2Service])
], WechatCodeV2Controller);
exports.WechatCodeV2Controller = WechatCodeV2Controller;
//# sourceMappingURL=wechat-code.controller.js.map