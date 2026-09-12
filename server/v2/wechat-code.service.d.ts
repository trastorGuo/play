/// <reference types="node" />
/// <reference types="node" />
import { DataSource } from 'typeorm';
export declare class WechatCodeV2Service {
    private readonly db;
    private cached;
    constructor(db: DataSource);
    image(scene: string): Promise<Buffer>;
    private accessToken;
    private call;
    private get;
    private post;
    private required;
}
