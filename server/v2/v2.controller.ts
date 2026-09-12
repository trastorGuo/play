import { Body, Controller, Get, Headers, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LedgerV2Service } from './ledger.service';
import { CurrentUserId, assertIdempotencyKey, ok } from './http';
import { V2AuthGuard } from './auth';
import { CreateRecordDto, CreateRoomDto, JoinRoomDto, RenameMemberDto, ReverseRecordDto } from './dto';

@Controller('api/v2/rooms')
@UseGuards(V2AuthGuard)
export class RoomsV2Controller {
  constructor(private readonly ledger: LedgerV2Service) {}
  @Post() async create(@CurrentUserId() userId:string,@Body() body:CreateRoomDto,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.create(userId,body,assertIdempotencyKey(key)))}
  @Get('recent') async recent(@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,{items:await this.ledger.recent(userId),nextCursor:null})}
  @Get(':roomCode') async snapshot(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.snapshot(roomCode,userId))}
  @Post(':roomCode/join') @HttpCode(200) async join(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Body() body:JoinRoomDto,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.join(userId,roomCode,body,assertIdempotencyKey(key)))}
  @Get(':roomCode/records') async records(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Query('relatedToMe') related:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.records(roomCode,userId,related==='true'))}
  @Post(':roomCode/records') async transfer(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Body() body:CreateRecordDto,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.transfer(roomCode,userId,body,assertIdempotencyKey(key)))}
  @Post(':roomCode/records/:recordId/reverse') async reverse(@Param('roomCode') roomCode:string,@Param('recordId') recordId:string,@CurrentUserId() userId:string,@Body() body:ReverseRecordDto,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.reverse(roomCode,recordId,userId,body?.reason,assertIdempotencyKey(key)))}
  @Post(':roomCode/close') @HttpCode(200) async close(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.close(roomCode,userId,assertIdempotencyKey(key)))}
  @Post(':roomCode/leave') @HttpCode(204) async leave(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Headers('idempotency-key') key:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.leave(roomCode,userId,assertIdempotencyKey(key)))}
  @Patch(':roomCode/me') async rename(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Body() body:RenameMemberDto,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.rename(roomCode,userId,body.nickname))}
  @Get(':roomCode/settlement') async settlement(@Param('roomCode') roomCode:string,@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.settlement(roomCode,userId))}
}

@Controller('api/v2/rooms')
export class RoomPreviewV2Controller {
  constructor(private readonly ledger: LedgerV2Service) {}
  @Get(':roomCode/preview') async preview(@Param('roomCode') roomCode:string,@Query('joinCode') joinCode:string,@Query('invite') invite:string,@Query('scene') scene:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.preview(roomCode,joinCode,invite,scene))}
}

@Controller('api/v2/operations')
@UseGuards(V2AuthGuard)
export class OperationsV2Controller {
  constructor(private readonly ledger:LedgerV2Service){}
  @Get(':key') async get(@Param('key') key:string,@CurrentUserId() userId:string,@Headers('x-request-id') requestId=''){return ok(requestId,await this.ledger.operation(userId,key))}
}
