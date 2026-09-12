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
exports.AuthV2Controller = exports.AuthV2Service = exports.V2AuthGuard = exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const http_1 = require("./http");
const dto_1 = require("./dto");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const https_1 = require("https");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const sha256 = (value) => (0, crypto_1.createHash)('sha256').update(value).digest('hex');
const required = (name) => { const value = process.env[name]; if (!value)
    throw new Error(`${name} is required`); return value; };
const b64 = (value) => Buffer.from(value).toString('base64url');
let TokenService = class TokenService {
    sign(userId, expiresInSeconds = 1800) {
        const body = b64(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
        return `${body}.${(0, crypto_1.createHmac)('sha256', required('V2_TOKEN_SECRET')).update(body).digest('base64url')}`;
    }
    verify(token) {
        const [body, signature] = token.split('.');
        if (!body || !signature)
            throw this.invalid();
        const expected = (0, crypto_1.createHmac)('sha256', required('V2_TOKEN_SECRET')).update(body).digest();
        const received = Buffer.from(signature, 'base64url');
        if (expected.length !== received.length || !(0, crypto_1.timingSafeEqual)(expected, received))
            throw this.invalid();
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        if (payload.exp <= Date.now() / 1000)
            throw this.invalid();
        return String(payload.sub);
    }
    invalid() { return new common_1.UnauthorizedException({ code: 'AUTH_INVALID', message: '登录状态已更新，请重试' }); }
};
TokenService = __decorate([
    (0, common_1.Injectable)()
], TokenService);
exports.TokenService = TokenService;
let V2AuthGuard = class V2AuthGuard {
    constructor(tokens) {
        Object.defineProperty(this, "tokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: tokens
        });
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        request.userId = this.tokens.verify(String(request.headers.authorization || '').replace(/^Bearer\s+/i, ''));
        return true;
    }
};
V2AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [TokenService])
], V2AuthGuard);
exports.V2AuthGuard = V2AuthGuard;
let AuthV2Service = class AuthV2Service {
    constructor(users, refreshTokens, tokens) {
        Object.defineProperty(this, "users", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: users
        });
        Object.defineProperty(this, "refreshTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: refreshTokens
        });
        Object.defineProperty(this, "tokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: tokens
        });
    }
    async login(code) {
        if (!code || code.length > 128)
            throw new common_1.UnauthorizedException({ code: 'AUTH_INVALID', message: '微信登录凭证无效' });
        const openid = process.env.V2_AUTH_MOCK === 'true' ? `mock:${code}` : await this.code2Session(code);
        const openidHash = sha256(`${required('WECHAT_IDENTITY_PEPPER')}:${openid}`);
        let user = await this.users.findOne({ where: { wechatOpenidHash: openidHash } });
        if (!user)
            user = await this.users.save(this.users.create({ wechatOpenidHash: openidHash, unionidHash: null, displayName: null, status: 1 }));
        return this.issue(user);
    }
    async refresh(rawToken) {
        const entity = await this.refreshTokens.findOne({ where: { tokenHash: sha256(rawToken), revokedAt: null } });
        if (!entity || entity.expiresAt <= new Date())
            throw new common_1.UnauthorizedException({ code: 'AUTH_INVALID', message: '登录状态已更新，请重试' });
        const user = await this.users.findOneByOrFail({ id: entity.userId });
        entity.revokedAt = new Date();
        await this.refreshTokens.save(entity);
        const response = await this.issue(user);
        const replacement = await this.refreshTokens.findOneBy({ tokenHash: sha256(response.refreshToken) });
        entity.replacedById = (replacement === null || replacement === void 0 ? void 0 : replacement.id) || null;
        await this.refreshTokens.save(entity);
        return response;
    }
    async logout(userId, rawToken) { const entity = await this.refreshTokens.findOne({ where: { tokenHash: sha256(rawToken), userId } }); if (entity && !entity.revokedAt) {
        entity.revokedAt = new Date();
        await this.refreshTokens.save(entity);
    } }
    async issue(user) {
        const rawRefresh = (0, crypto_1.randomBytes)(32).toString('base64url');
        await this.refreshTokens.save(this.refreshTokens.create({ userId: user.id, tokenHash: sha256(rawRefresh), expiresAt: new Date(Date.now() + 30 * 86400000), revokedAt: null, replacedById: null }));
        const base = (process.env.PUBLIC_API_BASE_URL || 'http://127.0.0.1:6015/api/v2').replace(/\/$/, '');
        return { accessToken: this.tokens.sign(user.id), refreshToken: rawRefresh, expiresIn: 1800, user: { id: String(user.id), displayName: user.displayName, avatarUrl: user.avatarFileId ? `${base}/profile-avatars/${user.avatarFileId}` : null } };
    }
    code2Session(code) {
        const query = new URLSearchParams({ appid: required('WECHAT_APP_ID'), secret: required('WECHAT_APP_SECRET'), js_code: code, grant_type: 'authorization_code' });
        return new Promise((resolve, reject) => (0, https_1.get)(`https://api.weixin.qq.com/sns/jscode2session?${query}`, (response) => { let body = ''; response.on('data', (chunk) => body += chunk); response.on('end', () => { try {
            const data = JSON.parse(body);
            data.openid ? resolve(String(data.openid)) : reject(new common_1.UnauthorizedException({ code: 'AUTH_INVALID', message: '微信登录凭证无效' }));
        }
        catch (error) {
            reject(error);
        } }); }).on('error', reject));
    }
};
AuthV2Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserV2)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.RefreshTokenV2)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeorm_2.Repository, TokenService])
], AuthV2Service);
exports.AuthV2Service = AuthV2Service;
let AuthV2Controller = class AuthV2Controller {
    constructor(auth) {
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth
        });
    }
    async login(body, requestId = '') { return { success: true, requestId, data: await this.auth.login(body.code) }; }
    async refresh(body, requestId = '') { return { success: true, requestId, data: await this.auth.refresh(body.refreshToken) }; }
    async logout(userId, body, requestId = '') { await this.auth.logout(userId, body.refreshToken); return (0, http_1.ok)(requestId, null); }
};
__decorate([
    (0, common_1.Post)('wechat-login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.WechatLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthV2Controller.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthV2Controller.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(V2AuthGuard),
    __param(0, (0, http_1.CurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-request-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthV2Controller.prototype, "logout", null);
AuthV2Controller = __decorate([
    (0, common_1.Controller)('api/v2/auth'),
    __metadata("design:paramtypes", [AuthV2Service])
], AuthV2Controller);
exports.AuthV2Controller = AuthV2Controller;
//# sourceMappingURL=auth.js.map