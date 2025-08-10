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
    
        response.status(status).json({
            result: exceptionContent.code,
            message: exceptionContent.content,
            timestamp: new Date().getTime()
        });
    }
}