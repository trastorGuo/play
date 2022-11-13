/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 21:51:34
 */
import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from './utils/interceptor';
import { ExceptionsFilter } from './utils/exception.filter';
import { AppModule } from './module/app';

const port = process.env.port || process.env.PORT;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // 注册全局拦截器，拦截全局请求
    app.useGlobalInterceptors(new TransformInterceptor());
    // 异常过滤器  
    app.useGlobalFilters(new ExceptionsFilter());
    await app.listen(port);
    console.log(`server服务已启动，服务器网址：http://localhost:${port}`);
}

bootstrap();
