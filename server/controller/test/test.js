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
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const test_1 = require("../../service/test/test");
let TestController = class TestController {
    constructor(appService) {
        Object.defineProperty(this, "appService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: appService
        });
    }
    getHello() {
        return this.appService.getHello();
    }
    async findOne() {
        return await this.appService.findOne("1");
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TestController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("findOne"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "findOne", null);
TestController = __decorate([
    (0, common_1.Controller)("test"),
    __metadata("design:paramtypes", [test_1.TestService])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.js.map