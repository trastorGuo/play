import { Response } from 'express';
import { WechatCodeV2Service } from './wechat-code.service';
export declare class WechatCodeV2Controller {
    private readonly codes;
    constructor(codes: WechatCodeV2Service);
    image(scene: string, envVersion: string, response: Response): Promise<void>;
}
