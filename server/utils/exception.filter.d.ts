import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class ExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
