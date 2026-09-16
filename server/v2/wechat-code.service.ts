import { BadRequestException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { request } from 'https';
import { DataSource, IsNull } from 'typeorm';
import { InviteTokenV2, RoomV2 } from './entities';

type CodeEnvironment = 'release' | 'trial' | 'develop';
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);

@Injectable()
export class WechatCodeV2Service {
  private readonly logger = new Logger(WechatCodeV2Service.name);
  private cached: { token: string; expiresAt: number } | null = null;
  constructor(private readonly db: DataSource) {}

  async image(scene: string, requestedEnvironment?: string) {
    const environment = requestedEnvironment || process.env.WECHAT_CODE_ENV_VERSION || 'release';
    if (!['release', 'trial', 'develop'].includes(environment)) {
      throw new BadRequestException({ code: 'INVALID_CODE_ENVIRONMENT', message: '小程序版本参数无效' });
    }
    const invite = await this.db.getRepository(InviteTokenV2).findOne({ where: { scene, revokedAt: IsNull() } });
    if (!invite || invite.expiresAt && invite.expiresAt <= new Date()) throw new NotFoundException();
    const room = await this.db.getRepository(RoomV2).findOne({ where: { id: invite.roomId, status: 'active' } });
    if (!room) throw new NotFoundException();
    return this.generate(scene, environment as CodeEnvironment);
  }

  private async generate(scene: string, environment: CodeEnvironment, retry = true): Promise<Buffer> {
    const token = await this.accessToken();
    const result = await this.post(`/wxa/getwxacodeunlimit?access_token=${encodeURIComponent(token)}`, {
      scene, page: 'pages/preview/index', env_version: environment,
      // Trial/develop pages can exist before the first public release.
      check_path: environment === 'release',
    });
    if (result.length > pngSignature.length && (result.subarray(0, pngSignature.length).equals(pngSignature) || result.subarray(0, jpegSignature.length).equals(jpegSignature))) return result;
    let errorCode = -1;
    try { errorCode = Number(JSON.parse(result.toString()).errcode ?? -1); } catch { /* invalid upstream response */ }
    if (retry && [40001, 40014, 42001].includes(errorCode)) {
      this.cached = null;
      return this.generate(scene, environment, false);
    }
    // Never log the request URL, access token, scene, or upstream response body.
    this.logger.warn(`WeChat code generation failed: environment=${environment}, errcode=${errorCode}`);
    throw new ServiceUnavailableException({ code: 'WECHAT_CODE_GENERATION_FAILED', message: '小程序码暂不可用，请稍后重试' });
  }

  private async accessToken() {
    if (this.cached && this.cached.expiresAt > Date.now() + 60000) return this.cached.token;
    const appid = this.required('WECHAT_APP_ID'), secret = this.required('WECHAT_APP_SECRET');
    const data = await this.get(`/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`);
    let parsed: { access_token?: string; expires_in?: number; errcode?: number };
    try { parsed = JSON.parse(data.toString()); } catch { parsed = {}; }
    if (!parsed.access_token) {
      this.logger.warn(`WeChat access token failed: errcode=${Number(parsed.errcode ?? -1)}`);
      throw new ServiceUnavailableException({ code: 'WECHAT_ACCESS_TOKEN_FAILED', message: '小程序码服务暂不可用，请稍后重试' });
    }
    this.cached = { token: String(parsed.access_token), expiresAt: Date.now() + Number(parsed.expires_in || 7200) * 1000 };
    return this.cached.token;
  }

  private call(method: 'GET' | 'POST', path: string, body?: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const req = request({ hostname: 'api.weixin.qq.com', path, method, timeout: 12000, headers: body ? { 'Content-Type': 'application/json', 'Content-Length': body.length } : undefined }, response => {
        const chunks: Buffer[] = [];
        response.on('data', chunk => chunks.push(Buffer.from(chunk)));
        response.on('error', reject);
        response.on('end', () => {
          if (response.statusCode !== 200) return reject(new ServiceUnavailableException('小程序码服务暂不可用'));
          resolve(Buffer.concat(chunks));
        });
      });
      req.on('timeout', () => req.destroy(new Error('WECHAT_REQUEST_TIMEOUT')));
      req.on('error', () => reject(new ServiceUnavailableException({ code: 'WECHAT_NETWORK_ERROR', message: '小程序码请求超时，请稍后重试' })));
      if (body) req.write(body);
      req.end();
    });
  }
  private get(path: string) { return this.call('GET', path); }
  private post(path: string, data: unknown) { return this.call('POST', path, Buffer.from(JSON.stringify(data))); }
  private required(name: string) { const value = process.env[name]; if (!value) throw new Error(`${name} is required`); return value; }
}
