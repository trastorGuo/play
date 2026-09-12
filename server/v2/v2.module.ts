import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthV2Controller, AuthV2Service, TokenService, V2AuthGuard } from './auth';
import { AccountDeletionRequestV2, FeedbackFileV2, FeedbackV2, IdempotencyKeyV2, InviteTokenV2, LedgerRecordV2, OutboxEventV2, ProfileAvatarV2, RefreshTokenV2, RoomMemberV2, RoomV2, UserV2 } from './entities';
import { LedgerV2Service } from './ledger.service';
import { OperationsV2Controller, RoomPreviewV2Controller, RoomsV2Controller } from './v2.controller';
import { V2HealthController } from './health.controller';
import { CompanionV2Controller, InviteResolveV2Controller, ProfileAvatarV2Controller } from './companion.controller';
import { CompanionV2Service } from './companion.service';
import { RealtimeV2Controller } from './realtime.controller';
import { RealtimeV2Service } from './realtime.service';
import { WechatCodeV2Controller } from './wechat-code.controller';
import { WechatCodeV2Service } from './wechat-code.service';

@Module({
  imports:[TypeOrmModule.forFeature([UserV2,RefreshTokenV2,RoomV2,RoomMemberV2,LedgerRecordV2,IdempotencyKeyV2,OutboxEventV2,InviteTokenV2,FeedbackV2,FeedbackFileV2,ProfileAvatarV2,AccountDeletionRequestV2])],
  controllers:[V2HealthController,AuthV2Controller,RoomsV2Controller,RoomPreviewV2Controller,OperationsV2Controller,CompanionV2Controller,InviteResolveV2Controller,ProfileAvatarV2Controller,RealtimeV2Controller,WechatCodeV2Controller],
  providers:[TokenService,V2AuthGuard,AuthV2Service,LedgerV2Service,CompanionV2Service,RealtimeV2Service,WechatCodeV2Service],
  exports:[RealtimeV2Service],
})
export class V2Module {}
