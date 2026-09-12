export declare const CurrentUserId: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const assertIdempotencyKey: (key: string) => string;
export declare const ok: <T>(requestId: string, data: T) => {
    success: true;
    requestId: string;
    data: T;
};
