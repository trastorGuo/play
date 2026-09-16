import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { WechatCodeV2Service } from './wechat-code.service';
@Controller('api/v2/share-codes')
export class WechatCodeV2Controller { constructor(private readonly codes:WechatCodeV2Service){} @Get(':scene.png') async image(@Param('scene') scene:string,@Query('envVersion') envVersion:string,@Res() response:Response){const image=await this.codes.image(scene,envVersion);response.setHeader('Content-Type',image[0]===0xff?'image/jpeg':'image/png');response.setHeader('Cache-Control','private,max-age=300');response.send(image)} }
