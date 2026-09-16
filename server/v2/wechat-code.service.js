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
var WechatCodeV2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatCodeV2Service = void 0;
const common_1 = require("@nestjs/common");
const https_1 = require("https");
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
let WechatCodeV2Service = WechatCodeV2Service_1 = class WechatCodeV2Service {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new common_1.Logger(WechatCodeV2Service_1.name)
        });
        Object.defineProperty(this, "cached", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    async image(scene, requestedEnvironment) {
        const environment = requestedEnvironment || process.env.WECHAT_CODE_ENV_VERSION || 'release';
        if (!['release', 'trial', 'develop'].includes(environment)) {
            throw new common_1.BadRequestException({ code: 'INVALID_CODE_ENVIRONMENT', message: '小程序版本参数无效' });
        }
        const invite = await this.db.getRepository(entities_1.InviteTokenV2).findOne({ where: { scene, revokedAt: (0, typeorm_1.IsNull)() } });
        if (!invite || invite.expiresAt && invite.expiresAt <= new Date())
            throw new common_1.NotFoundException();
        const room = await this.db.getRepository(entities_1.RoomV2).findOne({ where: { id: invite.roomId, status: 'active' } });
        if (!room)
            throw new common_1.NotFoundException();
        return this.generate(scene, environment);
    }
    async generate(scene, environment, retry = true) {
        var _a;
        const token = await this.accessToken();
        const result = await this.post(`/wxa/getwxacodeunlimit?access_token=${encodeURIComponent(token)}`, {
            scene, page: 'pages/preview/index', env_version: environment,
            check_path: environment === 'release',
        });
        if (result.length > pngSignature.length && (result.subarray(0, pngSignature.length).equals(pngSignature) || result.subarray(0, jpegSignature.length).equals(jpegSignature)))
            return result;
        let errorCode = -1;
        try {
            errorCode = Number((_a = JSON.parse(result.toString()).errcode) !== null && _a !== void 0 ? _a : -1);
        }
        catch (_b) { }
        if (retry && [40001, 40014, 42001].includes(errorCode)) {
            this.cached = null;
            return this.generate(scene, environment, false);
        }
        this.logger.warn(`WeChat code generation failed: environment=${environment}, errcode=${errorCode}`);
        throw new common_1.ServiceUnavailableException({ code: 'WECHAT_CODE_GENERATION_FAILED', message: '小程序码暂不可用，请稍后重试' });
    }
    async accessToken() {
        var _a;
        if (this.cached && this.cached.expiresAt > Date.now() + 60000)
            return this.cached.token;
        const appid = this.required('WECHAT_APP_ID'), secret = this.required('WECHAT_APP_SECRET');
        const data = await this.get(`/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`);
        let parsed;
        try {
            parsed = JSON.parse(data.toString());
        }
        catch (_b) {
            parsed = {};
        }
        if (!parsed.access_token) {
            this.logger.warn(`WeChat access token failed: errcode=${Number((_a = parsed.errcode) !== null && _a !== void 0 ? _a : -1)}`);
            throw new common_1.ServiceUnavailableException({ code: 'WECHAT_ACCESS_TOKEN_FAILED', message: '小程序码服务暂不可用，请稍后重试' });
        }
        this.cached = { token: String(parsed.access_token), expiresAt: Date.now() + Number(parsed.expires_in || 7200) * 1000 };
        return this.cached.token;
    }
    call(method, path, body) {
        return new Promise((resolve, reject) => {
            const req = (0, https_1.request)({ hostname: 'api.weixin.qq.com', path, method, timeout: 12000, headers: body ? { 'Content-Type': 'application/json', 'Content-Length': body.length } : undefined }, response => {
                const chunks = [];
                response.on('data', chunk => chunks.push(Buffer.from(chunk)));
                response.on('error', reject);
                response.on('end', () => {
                    if (response.statusCode !== 200)
                        return reject(new common_1.ServiceUnavailableException('小程序码服务暂不可用'));
                    resolve(Buffer.concat(chunks));
                });
            });
            req.on('timeout', () => req.destroy(new Error('WECHAT_REQUEST_TIMEOUT')));
            req.on('error', () => reject(new common_1.ServiceUnavailableException({ code: 'WECHAT_NETWORK_ERROR', message: '小程序码请求超时，请稍后重试' })));
            if (body)
                req.write(body);
            req.end();
        });
    }
    get(path) { return this.call('GET', path); }
    post(path, data) { return this.call('POST', path, Buffer.from(JSON.stringify(data))); }
    required(name) { const value = process.env[name]; if (!value)
        throw new Error(`${name} is required`); return value; }
};
WechatCodeV2Service = WechatCodeV2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WechatCodeV2Service);
exports.WechatCodeV2Service = WechatCodeV2Service;
//# sourceMappingURL=wechat-code.service.js.map