/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 21:51:34
 */
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from './utils/interceptor';
import { ExceptionsFilter } from './utils/exception.filter';
import { AppModule } from './module/app';
import { Server } from 'socket.io';
import { RoomGateway } from './gateway/room.gateway';

// 加载环境变量
dotenv.config();

const port = process.env.SERVER_PORT || process.env.PORT || 6015;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // 注册全局拦截器，拦截全局请求
    app.useGlobalInterceptors(new TransformInterceptor());
    // 异常过滤器  
    app.useGlobalFilters(new ExceptionsFilter());
    
    const server = await app.listen(port);
    
    // 创建Socket.IO服务器
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: '/socket.io/',
        transports: ['websocket', 'polling']
    });

    // 获取WebSocket网关实例
    const roomGateway = app.get(RoomGateway);

    // 设置Socket.IO事件处理
    io.on('connection', (socket) => {
        roomGateway.handleConnection(socket);
    });

    
}

bootstrap();
