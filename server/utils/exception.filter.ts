import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { ErrorType } from './exception';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
        exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let exceptionContent: ErrorType = {
            code: 500,
            content: "请检查网络是否异常"
        };
        if(status !== HttpStatus.INTERNAL_SERVER_ERROR) {
            exceptionContent = (exception.getResponse() as ErrorType);
        }
    
        if(String(request.url || '').startsWith('/api/v2')) {
            const payload = exception instanceof HttpException ? exception.getResponse() as any : {};
            if(status === HttpStatus.INTERNAL_SERVER_ERROR) console.error('[api/v2]', request.method, request.url, exception?.stack || exception);
            return response.status(status).json({ success: false, requestId: request.headers['x-request-id'] || '', error: { code: payload.code || 'INTERNAL_ERROR', message: payload.message || '服务暂时不可用' } });
        }
        response.status(status).json({
            result: exceptionContent.code,
            message: exceptionContent.content,
            timestamp: new Date().getTime()
        });
    }
}
