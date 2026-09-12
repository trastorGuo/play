"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeV2Service = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const events_1 = require("events");
const ioredis_1 = __importDefault(require("ioredis"));
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
let RealtimeV2Service = class RealtimeV2Service {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "redis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "memoryTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new events_1.EventEmitter()
        });
        this.redis = new ioredis_1.default({ host: process.env.REDIS_HOST || '127.0.0.1', port: Number(process.env.REDIS_PORT || 6379), password: process.env.REDIS_PASSWORD || undefined, lazyConnect: true, maxRetriesPerRequest: 1, enableOfflineQueue: false });
        this.redis.on('error', () => undefined);
    }
    async onModuleInit() { try {
        await this.redis.connect();
    }
    catch (_a) {
        if (!this.memoryFallback())
            return;
    } this.timer = setInterval(() => void this.flushOutbox(), 1000); }
    async onModuleDestroy() { if (this.timer)
        clearInterval(this.timer); this.redis.disconnect(); }
    async issue(userId) { const ticket = (0, crypto_1.randomBytes)(32).toString('base64url'); if (this.redis.status === 'ready')
        await this.redis.set(`ws:ticket:${ticket}`, userId, 'EX', 60, 'NX');
    else if (this.memoryFallback())
        this.memoryTickets.set(ticket, { userId, expiresAt: Date.now() + 60000 });
    else
        throw new Error('REALTIME_UNAVAILABLE'); return { ticket, expiresIn: 60 }; }
    async consume(ticket) { if (!ticket)
        return null; if (this.redis.status === 'ready') {
        const result = await this.redis.eval("local v=redis.call('GET',KEYS[1]); if v then redis.call('DEL',KEYS[1]) end; return v", 1, `ws:ticket:${ticket}`);
        return result ? String(result) : null;
    } if (!this.memoryFallback())
        return null; const item = this.memoryTickets.get(ticket); this.memoryTickets.delete(ticket); return item && item.expiresAt > Date.now() ? item.userId : null; }
    async assertMember(userId, roomCode) { const room = await this.db.getRepository(entities_1.RoomV2).findOne({ where: { roomCode } }); if (!room)
        throw new common_1.ForbiddenException(); const member = await this.db.getRepository(entities_1.RoomMemberV2).findOne({ where: { roomId: room.id, userId, status: 'active' } }); if (!member)
        throw new common_1.ForbiddenException(); return room; }
    async subscribe(roomId, onMessage) { const channel = `room:channel:${roomId}`; if (this.redis.status !== 'ready') {
        if (!this.memoryFallback())
            throw new Error('REALTIME_UNAVAILABLE');
        this.events.on(channel, onMessage);
        return async () => { this.events.off(channel, onMessage); };
    } const subscriber = this.redis.duplicate({ lazyConnect: true }); await subscriber.connect(); await subscriber.subscribe(channel); subscriber.on('message', (_channel, message) => { try {
        onMessage(JSON.parse(message));
    }
    catch (_a) { } }); return async () => { await subscriber.unsubscribe(channel); subscriber.disconnect(); }; }
    async flushOutbox() { if (this.redis.status !== 'ready' && !this.memoryFallback())
        return; const repo = this.db.getRepository(entities_1.OutboxEventV2); const rows = await repo.createQueryBuilder('event').where('event.published_at IS NULL').andWhere('event.available_at <= :now', { now: new Date() }).orderBy('event.id', 'ASC').limit(50).getMany(); for (const row of rows) {
        try {
            const channel = `room:channel:${row.aggregateId}`;
            if (this.redis.status === 'ready')
                await this.redis.publish(channel, JSON.stringify(row.payloadJson));
            else
                this.events.emit(channel, row.payloadJson);
            row.publishedAt = new Date();
            row.attempts += 1;
            await repo.save(row);
        }
        catch (_a) {
            row.attempts += 1;
            row.availableAt = new Date(Date.now() + Math.min(row.attempts * 1000, 60000));
            await repo.save(row);
            break;
        }
    } }
    memoryFallback() { return process.env.NODE_ENV !== 'production' && process.env.V2_REALTIME_MEMORY_FALLBACK === 'true'; }
};
RealtimeV2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], RealtimeV2Service);
exports.RealtimeV2Service = RealtimeV2Service;
//# sourceMappingURL=realtime.service.js.map