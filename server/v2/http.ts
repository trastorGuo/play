import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUserId = createParamDecorator((_data: unknown, context: ExecutionContext) => String(context.switchToHttp().getRequest().userId));
export const assertIdempotencyKey = (key: string) => { if (!/^[0-9a-f-]{36}$/i.test(key || '')) throw new BadRequestException({ code: 'IDEMPOTENCY_KEY_INVALID', message: '缺少有效幂等键' }); return key; };
export const ok = <T>(requestId: string, data: T) => ({ success: true as const, requestId: requestId || '', data });
