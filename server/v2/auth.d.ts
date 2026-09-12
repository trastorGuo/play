import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RefreshTokenDto, WechatLoginDto } from './dto';
import { Repository } from 'typeorm';
import { RefreshTokenV2, UserV2 } from './entities';
export declare class TokenService {
    sign(userId: string, expiresInSeconds?: number): string;
    verify(token: string): string;
    private invalid;
}
export declare class V2AuthGuard implements CanActivate {
    private readonly tokens;
    constructor(tokens: TokenService);
    canActivate(context: ExecutionContext): boolean;
}
export declare class AuthV2Service {
    private users;
    private refreshTokens;
    private tokens;
    constructor(users: Repository<UserV2>, refreshTokens: Repository<RefreshTokenV2>, tokens: TokenService);
    login(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
    }>;
    refresh(rawToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
    }>;
    logout(userId: string, rawToken: string): Promise<void>;
    private issue;
    private code2Session;
}
export declare class AuthV2Controller {
    private readonly auth;
    constructor(auth: AuthV2Service);
    login(body: WechatLoginDto, requestId?: string): Promise<{
        success: boolean;
        requestId: string;
        data: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            user: {
                id: string;
                displayName: string;
                avatarUrl: string;
            };
        };
    }>;
    refresh(body: RefreshTokenDto, requestId?: string): Promise<{
        success: boolean;
        requestId: string;
        data: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            user: {
                id: string;
                displayName: string;
                avatarUrl: string;
            };
        };
    }>;
    logout(userId: string, body: RefreshTokenDto, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: any;
    }>;
}
