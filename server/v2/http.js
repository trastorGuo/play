"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.assertIdempotencyKey = exports.CurrentUserId = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUserId = (0, common_1.createParamDecorator)((_data, context) => String(context.switchToHttp().getRequest().userId));
const assertIdempotencyKey = (key) => { if (!/^[0-9a-f-]{36}$/i.test(key || ''))
    throw new common_1.BadRequestException({ code: 'IDEMPOTENCY_KEY_INVALID', message: '缺少有效幂等键' }); return key; };
exports.assertIdempotencyKey = assertIdempotencyKey;
const ok = (requestId, data) => ({ success: true, requestId: requestId || '', data });
exports.ok = ok;
//# sourceMappingURL=http.js.map