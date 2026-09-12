import { RealtimeV2Service } from './realtime.service';
export declare class RealtimeV2Controller {
    private readonly realtime;
    constructor(realtime: RealtimeV2Service);
    ticket(userId: string, requestId?: string): Promise<{
        success: true;
        requestId: string;
        data: {
            ticket: string;
            expiresIn: number;
        };
    }>;
}
