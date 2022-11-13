/*
 * @Description: 请求拦截器
 * @Date: 2022-09-17 14:57:12
 * @Author: 
 * @LastEditTime: 2022-09-17 15:10:49
 */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                map((data) => {
                    return {
                        data: data,
                        result: 1
                    };
                })
            );
    }
}