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
import { Server } from 'socket.io';
import { RoomGateway } from './gateway/room.gateway';

const port = process.env.port || process.env.PORT || 6015;

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

    console.log(`server服务已启动，服务器网址：http://localhost:${port}`);
    console.log(`WebSocket服务已启动，路径：ws://localhost:${port}/socket.io/`);
}

bootstrap();
