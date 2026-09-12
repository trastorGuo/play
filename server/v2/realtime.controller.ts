import { Controller, Headers, HttpCode, Post, UseGuards } from '@nestjs/common';
import { V2AuthGuard } from './auth';
import { CurrentUserId, ok } from './http';
import { RealtimeV2Service } from './realtime.service';
@Controller('api/v2/realtime') @UseGuards(V2AuthGuard)
export class RealtimeV2Controller { constructor(private readonly realtime:RealtimeV2Service){} @Post('ticket') @HttpCode(200) async ticket(@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.realtime.issue(userId))} }
