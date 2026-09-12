export declare class V2HealthController {
    health(): {
        success: boolean;
        requestId: string;
        data: {
            status: string;
            version: string;
        };
    };
}
