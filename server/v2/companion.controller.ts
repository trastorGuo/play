import { Body, Controller, Get, Headers, HttpCode, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { V2AuthGuard } from './auth';
import { CompanionV2Service } from './companion.service';
import { CurrentUserId, assertIdempotencyKey, ok } from './http';
import { FeedbackDto, UpdateProfileDto } from './dto';

@UseGuards(V2AuthGuard)
@Controller('api/v2')
export class CompanionV2Controller {
  constructor(private readonly service:CompanionV2Service){}
  @Post('rooms/:roomCode/share-code') @HttpCode(200) async share(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.share(roomCode,userId))}
  @Post('rooms/:roomCode/invite/reset') @HttpCode(200) async reset(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.reset(roomCode,userId,assertIdempotencyKey(key)))}
  @Get('feedback') async feedbackList(@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.feedbackList(userId))}
  @Post('feedback') async feedback(@CurrentUserId() userId:string,@Body() body:FeedbackDto,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.feedback(userId,body))}
  @Post('files/feedback-images') @UseInterceptors(FileInterceptor('file',{limits:{fileSize:5*1024*1024}})) async upload(@CurrentUserId() userId:string,@UploadedFile() file:any,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.uploadFeedbackImage(userId,file))}
  @Post('files/profile-avatars') @UseInterceptors(FileInterceptor('file',{limits:{fileSize:2*1024*1024}})) async uploadAvatar(@CurrentUserId() userId:string,@UploadedFile() file:any,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.uploadProfileAvatar(userId,file,assertIdempotencyKey(key)))}
  @Get('me') async me(@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.me(userId))}
  @Patch('me') async updateMe(@CurrentUserId() userId:string,@Body() body:UpdateProfileDto,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.updateProfile(userId,body,assertIdempotencyKey(key)))}
  @Get('me/account-deletion/check') async deletionCheck(@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.deletionCheck(userId))}
  @Post('me/account-deletion') @HttpCode(202) async deletion(@CurrentUserId() userId:string,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.requestDeletion(userId,assertIdempotencyKey(key)))}
}

@Controller('api/v2/profile-avatars')
export class ProfileAvatarV2Controller {
  constructor(private readonly service: CompanionV2Service) {}
  @Get(':id') async image(@Param('id') id:string,@Res() response:any){const file=await this.service.profileAvatar(id);response.setHeader('Content-Type',file.mimeType);response.setHeader('Cache-Control','public, max-age=31536000, immutable');response.send(file.buffer)}
}

@Controller('api/v2/invites')
export class InviteResolveV2Controller {
  constructor(private readonly service:CompanionV2Service){}
  @Get('scene/:scene') async resolve(@Param('scene') scene:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.service.resolveScene(scene))}
}
