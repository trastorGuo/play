import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { WechatCodeV2Service } from './wechat-code.service';
@Controller('api/v2/share-codes')
export class WechatCodeV2Controller { constructor(private readonly codes:WechatCodeV2Service){} @Get(':scene.png') async image(@Param('scene') scene:string,@Res() response:Response){const image=await this.codes.image(scene);response.setHeader('Content-Type','image/png');response.setHeader('Cache-Control','private,max-age=300');response.send(image)} }
