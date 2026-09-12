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
exports.WechatCodeV2Service = void 0;
const common_1 = require("@nestjs/common");
const https_1 = require("https");
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
let WechatCodeV2Service = class WechatCodeV2Service {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "cached", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    async image(scene) { const invite = await this.db.getRepository(entities_1.InviteTokenV2).findOne({ where: { scene, revokedAt: (0, typeorm_1.IsNull)() } }); if (!invite || invite.expiresAt && invite.expiresAt <= new Date())
        throw new common_1.NotFoundException(); const room = await this.db.getRepository(entities_1.RoomV2).findOne({ where: { id: invite.roomId, status: 'active' } }); if (!room)
        throw new common_1.NotFoundException(); const token = await this.accessToken(); const result = await this.post(`/wxa/getwxacodeunlimit?access_token=${encodeURIComponent(token)}`, { scene, page: 'pages/preview/index', check_path: true, env_version: process.env.WECHAT_CODE_ENV_VERSION || 'release' }); if (result.length < 100 || result[0] === 0x7b) {
        throw new Error('WECHAT_CODE_GENERATION_FAILED');
    } return result; }
    async accessToken() { if (this.cached && this.cached.expiresAt > Date.now() + 60000)
        return this.cached.token; const appid = this.required('WECHAT_APP_ID'), secret = this.required('WECHAT_APP_SECRET'); const data = await this.get(`/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`); const parsed = JSON.parse(data.toString()); if (!parsed.access_token)
        throw new Error('WECHAT_ACCESS_TOKEN_FAILED'); this.cached = { token: String(parsed.access_token), expiresAt: Date.now() + Number(parsed.expires_in || 7200) * 1000 }; return this.cached.token; }
    call(method, path, body) { return new Promise((resolve, reject) => { const req = (0, https_1.request)({ hostname: 'api.weixin.qq.com', path, method, headers: body ? { 'Content-Type': 'application/json', 'Content-Length': body.length } : undefined }, response => { const chunks = []; response.on('data', chunk => chunks.push(Buffer.from(chunk))); response.on('end', () => resolve(Buffer.concat(chunks))); }); req.on('error', reject); if (body)
        req.write(body); req.end(); }); }
    get(path) { return this.call('GET', path); }
    post(path, data) { return this.call('POST', path, Buffer.from(JSON.stringify(data))); }
    required(name) { const value = process.env[name]; if (!value)
        throw new Error(`${name} is required`); return value; }
};
WechatCodeV2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WechatCodeV2Service);
exports.WechatCodeV2Service = WechatCodeV2Service;
//# sourceMappingURL=wechat-code.service.js.map