import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoomV2 } from './entities';
export declare class RealtimeV2Service implements OnModuleInit, OnModuleDestroy {
    private readonly db;
    private redis;
    private timer;
    private readonly memoryTickets;
    private readonly events;
    constructor(db: DataSource);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    issue(userId: string): Promise<{
        ticket: string;
        expiresIn: number;
    }>;
    consume(ticket: string): Promise<string>;
    assertMember(userId: string, roomCode: string): Promise<RoomV2>;
    subscribe(roomId: string, onMessage: (event: any) => void): Promise<() => Promise<void>>;
    private flushOutbox;
    private memoryFallback;
}
