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
const interceptor_1 = require("./utils/interceptor");
const exception_filter_1 = require("./utils/exception.filter");
const app_1 = require("./module/app");
const socket_io_1 = require("socket.io");
const room_gateway_1 = require("./gateway/room.gateway");
dotenv.config();
const port = process.env.SERVER_PORT || process.env.PORT || 6015;
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
}
bootstrap();
//# sourceMappingURL=main.js.map