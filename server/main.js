"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const interceptor_1 = require("./utils/interceptor");
const exception_filter_1 = require("./utils/exception.filter");
const app_1 = require("./module/app");
const socket_io_1 = require("socket.io");
const room_gateway_1 = require("./gateway/room.gateway");
const realtime_service_1 = require("./v2/realtime.service");
const ws_1 = require("ws");
dotenv.config();
const port = process.env.SERVER_PORT || process.env.PORT || 6015;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_1.AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new exception_filter_1.ExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    const server = await app.listen(port);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: '/socket.io/',
        transports: ['websocket', 'polling']
    });
    const roomGateway = app.get(room_gateway_1.RoomGateway);
    const realtimeV2 = app.get(realtime_service_1.RealtimeV2Service);
    io.on('connection', (socket) => {
        roomGateway.handleConnection(socket);
    });
    const wss = new ws_1.WebSocketServer({ noServer: true });
    server.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url || '/', 'http://localhost');
        if (url.pathname !== '/ws')
            return;
        wss.handleUpgrade(request, socket, head, (client) => wss.emit('connection', client, request));
    });
    wss.on('connection', async (client, request) => {
        const ticket = new URL(request.url || '/', 'http://localhost').searchParams.get('ticket') || '';
        const userId = await realtimeV2.consume(ticket).catch(() => null);
        if (!userId)
            return client.close(4001, 'invalid ticket');
        let unsubscribe = null;
        client.on('message', async (raw) => {
            try {
                const message = JSON.parse(raw.toString());
                if (message.type === 'ping')
                    return client.send(JSON.stringify({ type: 'pong', ts: message.ts }));
                if (message.type !== 'room.subscribe')
                    return;
                const room = await realtimeV2.assertMember(userId, String(message.roomCode));
                if (unsubscribe)
                    await unsubscribe();
                unsubscribe = await realtimeV2.subscribe(room.id, (event) => client.send(JSON.stringify(Object.assign({ type: 'room.version_changed' }, event))));
                client.send(JSON.stringify({ type: 'room.subscribed', requestId: message.requestId, roomCode: room.roomCode, version: Number(room.version) }));
            }
            catch (_a) {
                client.send(JSON.stringify({ type: 'error', code: 'ROOM_FORBIDDEN' }));
            }
        });
        client.on('close', () => { if (unsubscribe)
            void unsubscribe(); });
    });
}
bootstrap();
//# sourceMappingURL=main.js.map