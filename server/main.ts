/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 21:51:34
 */
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './utils/interceptor';
import { ExceptionsFilter } from './utils/exception.filter';
import { AppModule } from './module/app';
import { Server } from 'socket.io';
import { RoomGateway } from './gateway/room.gateway';
import { RealtimeV2Service } from './v2/realtime.service';
import { WebSocketServer } from 'ws';

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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    
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
    const realtimeV2 = app.get(RealtimeV2Service);

    // 旧网页继续使用 Socket.IO。
    io.on('connection', (socket) => {
        roomGateway.handleConnection(socket);
    });

    // 小程序 v2 使用标准 WSS，消息只携带版本变化。
    const wss = new WebSocketServer({ noServer: true });
    server.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url || '/', 'http://localhost');
        if(url.pathname !== '/ws') return;
        wss.handleUpgrade(request, socket, head, (client) => wss.emit('connection', client, request));
    });
    wss.on('connection', async (client, request) => {
        const ticket = new URL(request.url || '/', 'http://localhost').searchParams.get('ticket') || '';
        const userId = await realtimeV2.consume(ticket).catch(() => null);
        if(!userId) return client.close(4001, 'invalid ticket');
        let unsubscribe: (() => Promise<void>) | null = null;
        client.on('message', async (raw) => {
            try {
                const message = JSON.parse(raw.toString());
                if(message.type === 'ping') return client.send(JSON.stringify({ type: 'pong', ts: message.ts }));
                if(message.type !== 'room.subscribe') return;
                const room = await realtimeV2.assertMember(userId, String(message.roomCode));
                if(unsubscribe) await unsubscribe();
                unsubscribe = await realtimeV2.subscribe(room.id, (event) => client.send(JSON.stringify({ type: 'room.version_changed', ...event })));
                client.send(JSON.stringify({ type: 'room.subscribed', requestId: message.requestId, roomCode: room.roomCode, version: Number(room.version) }));
            } catch { client.send(JSON.stringify({ type: 'error', code: 'ROOM_FORBIDDEN' })); }
        });
        client.on('close', () => { if(unsubscribe) void unsubscribe(); });
    });

    
}

bootstrap();
