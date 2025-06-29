"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const interceptor_1 = require("./utils/interceptor");
const exception_filter_1 = require("./utils/exception.filter");
const app_1 = require("./module/app");
const socket_io_1 = require("socket.io");
const room_gateway_1 = require("./gateway/room.gateway");
const port = process.env.port || process.env.PORT || 6015;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_1.AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new exception_filter_1.ExceptionsFilter());
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
    io.on('connection', (socket) => {
        roomGateway.handleConnection(socket);
    });
    console.log(`server服务已启动，服务器网址：http://localhost:${port}`);
    console.log(`WebSocket服务已启动，路径：ws://localhost:${port}/socket.io/`);
}
bootstrap();
//# sourceMappingURL=main.js.map