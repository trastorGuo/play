import { CanActivate, Controller, ExecutionContext, Headers, HttpCode, Injectable, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUserId, ok } from './http';
import { RefreshTokenDto, WechatLoginDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { get } from 'https';
import { Repository } from 'typeorm';
import { RefreshTokenV2, UserV2 } from './entities';

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const required = (name: string) => { const value = process.env[name]; if (!value) throw new Error(`${name} is required`); return value; };
const b64 = (value: string) => Buffer.from(value).toString('base64url');

@Injectable()
export class TokenService {
  sign(userId: string, expiresInSeconds = 1800) {
    const body = b64(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
    return `${body}.${createHmac('sha256', required('V2_TOKEN_SECRET')).update(body).digest('base64url')}`;
  }
  verify(token: string): string {
    const [body, signature] = token.split('.');
    if (!body || !signature) throw this.invalid();
    const expected = createHmac('sha256', required('V2_TOKEN_SECRET')).update(body).digest();
    const received = Buffer.from(signature, 'base64url');
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) throw this.invalid();
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as { sub: string; exp: number };
    if (payload.exp <= Date.now() / 1000) throw this.invalid();
    return String(payload.sub);
  }
  private invalid() { return new UnauthorizedException({ code: 'AUTH_INVALID', message: '登录状态已更新，请重试' }); }
}

@Injectable()
export class V2AuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.userId = this.tokens.verify(String(request.headers.authorization || '').replace(/^Bearer\s+/i, ''));
    return true;
  }
}

@Injectable()
export class AuthV2Service {
  constructor(@InjectRepository(UserV2) private users: Repository<UserV2>, @InjectRepository(RefreshTokenV2) private refreshTokens: Repository<RefreshTokenV2>, private tokens: TokenService) {}
  async login(code: string) {
    if (!code || code.length > 128) throw new UnauthorizedException({ code: 'AUTH_INVALID', message: '微信登录凭证无效' });
    const openid = process.env.V2_AUTH_MOCK === 'true' ? `mock:${code}` : await this.code2Session(code);
    const openidHash = sha256(`${required('WECHAT_IDENTITY_PEPPER')}:${openid}`);
    let user = await this.users.findOne({ where: { wechatOpenidHash: openidHash } });
    if (!user) user = await this.users.save(this.users.create({ wechatOpenidHash: openidHash, unionidHash: null, displayName: null, status: 1 }));
    return this.issue(user);
  }
  async refresh(rawToken: string) {
    const entity = await this.refreshTokens.findOne({ where: { tokenHash: sha256(rawToken), revokedAt: null } });
    if (!entity || entity.expiresAt <= new Date()) throw new UnauthorizedException({ code: 'AUTH_INVALID', message: '登录状态已更新，请重试' });
    const user = await this.users.findOneByOrFail({ id: entity.userId });
    entity.revokedAt = new Date(); await this.refreshTokens.save(entity);
    const response = await this.issue(user); const replacement = await this.refreshTokens.findOneBy({ tokenHash: sha256(response.refreshToken) });
    entity.replacedById = replacement?.id || null; await this.refreshTokens.save(entity); return response;
  }
  async logout(userId:string,rawToken:string){const entity=await this.refreshTokens.findOne({where:{tokenHash:sha256(rawToken),userId}});if(entity&&!entity.revokedAt){entity.revokedAt=new Date();await this.refreshTokens.save(entity)}}
  private async issue(user: UserV2) {
    const rawRefresh = randomBytes(32).toString('base64url');
    await this.refreshTokens.save(this.refreshTokens.create({ userId: user.id, tokenHash: sha256(rawRefresh), expiresAt: new Date(Date.now() + 30 * 86400_000), revokedAt: null, replacedById: null }));
    const base=(process.env.PUBLIC_API_BASE_URL||'http://127.0.0.1:6015/api/v2').replace(/\/$/,'');
    return { accessToken: this.tokens.sign(user.id), refreshToken: rawRefresh, expiresIn: 1800, user: { id: String(user.id), displayName: user.displayName, avatarUrl:user.avatarFileId?`${base}/profile-avatars/${user.avatarFileId}`:null } };
  }
  private code2Session(code: string): Promise<string> {
    const query = new URLSearchParams({ appid: required('WECHAT_APP_ID'), secret: required('WECHAT_APP_SECRET'), js_code: code, grant_type: 'authorization_code' });
    return new Promise((resolve, reject) => get(`https://api.weixin.qq.com/sns/jscode2session?${query}`, (response) => { let body = ''; response.on('data', (chunk) => body += chunk); response.on('end', () => { try { const data = JSON.parse(body); data.openid ? resolve(String(data.openid)) : reject(new UnauthorizedException({ code: 'AUTH_INVALID', message: '微信登录凭证无效' })); } catch (error) { reject(error); } }); }).on('error', reject));
  }
}

@Controller('api/v2/auth')
export class AuthV2Controller {
  constructor(private readonly auth: AuthV2Service) {}
  @Post('wechat-login') @HttpCode(200) async login(@Body() body: WechatLoginDto, @Headers('x-request-id') requestId = '') { return { success: true, requestId, data: await this.auth.login(body.code) }; }
  @Post('refresh') @HttpCode(200) async refresh(@Body() body: RefreshTokenDto, @Headers('x-request-id') requestId = '') { return { success: true, requestId, data: await this.auth.refresh(body.refreshToken) }; }
  @Post('logout') @HttpCode(204) @UseGuards(V2AuthGuard) async logout(@CurrentUserId() userId:string,@Body() body:RefreshTokenDto,@Headers('x-request-id') requestId=''){await this.auth.logout(userId,body.refreshToken);return ok(requestId,null)}
}
