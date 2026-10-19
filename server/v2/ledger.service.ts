import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes, randomInt } from 'crypto';
import { DataSource, EntityManager } from 'typeorm';
import { IdempotencyKeyV2, InviteTokenV2, LedgerRecordV2, OutboxEventV2, RoomMemberV2, RoomV2, UserV2 } from './entities';

const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const normalized = (value: string) => value.trim().normalize('NFKC').toLocaleLowerCase('zh-CN');
const fail = (code: string, message: string) => new ConflictException({ code, message });

@Injectable()
export class LedgerV2Service {
  constructor(private readonly dataSource: DataSource) {}

  async recent(userId: string) {
    const members = await this.dataSource.getRepository(RoomMemberV2).find({ where: { userId }, order: { updatedAt: 'DESC' }, take: 30 });
    const rooms = members.length ? await this.dataSource.getRepository(RoomV2).createQueryBuilder('room').where('room.id IN (:...ids)', { ids: members.map((m) => m.roomId) }).getMany() : [];
    const roomMembers = members.length ? await this.dataSource.getRepository(RoomMemberV2).createQueryBuilder('member').where('member.room_id IN (:...ids)', { ids: members.map((m) => m.roomId) }).getMany() : [];
    const userIds = [...new Set(roomMembers.map((item) => item.userId).filter((id): id is string => Boolean(id)))];
    const users = userIds.length ? await this.dataSource.getRepository(UserV2).createQueryBuilder('user').where('user.id IN (:...ids)', { ids: userIds }).getMany() : [];
    const avatarByUser = new Map(users.map((user) => [String(user.id), user.avatarFileId ? this.avatarUrl(user.avatarFileId) : null]));
    return members.map((member) => {
      const room = rooms.find((candidate) => String(candidate.id) === String(member.roomId))!;
      const peers = roomMembers.filter((item) => String(item.roomId) === String(room.id));
      const owner = peers.find((item) => item.role === 'owner');
      const activePeers = peers.filter((item) => item.status === 'active').sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
      const avatarOf = (peer: RoomMemberV2) => peer.userId ? avatarByUser.get(String(peer.userId)) || null : null;
      return {
        roomCode: room.roomCode, name: room.name, ownerNickname: owner?.nickname || '', ownerAvatarUrl: owner ? avatarOf(owner) : null,
        status: room.status, activeMembers: activePeers.length, maxMembers: room.maxMembers, updatedAt: room.updatedAt,
        myBalancePoints: Number(member.balancePoints),
        memberPreviews: activePeers.map((peer) => ({ id: String(peer.id), nickname: peer.nickname, avatarUrl: avatarOf(peer) })),
      };
    });
  }

  async preview(roomCode: string, invite?: string, scene?: string) {
    const room = await this.roomByCode(roomCode);
    const tokenValid = await this.validInvite(room.id, invite, scene);
    if ((invite || scene) && !tokenValid) throw new NotFoundException({ code: 'INVITE_INVALID', message: '邀请已失效' });
    const members = await this.dataSource.getRepository(RoomMemberV2).find({ where: { roomId: room.id, status: 'active' } });
    return { roomCode, name: room.name, ownerNickname: members.find((m) => m.role === 'owner')?.nickname || '', status: room.status, activeMembers: members.length, maxMembers: room.maxMembers, updatedAt: room.updatedAt };
  }

  async create(userId: string, input: { name: string; nickname: string }, key: string) {
    this.validateRoomName(input.name); this.validateNickname(input.nickname);
    return this.dataSource.transaction(async (manager) => this.idempotent(manager, userId, key, 'room.create', input, async () => {
      let room: RoomV2 | null = null;
      for (let attempt = 0; attempt < 8 && !room; attempt++) {
        const roomCode = String(randomInt(100000, 1000000));
        // Preserve the non-null legacy column for rollback; no usable join code is generated or returned.
        try { room = await manager.save(RoomV2, manager.create(RoomV2, { roomCode, joinCodeHash: hash(randomBytes(32)), joinCodeCiphertext: null, joinCodeIv: null, joinCodeTag: null, name: input.name.trim(), ownerUserId: userId, status: 'active', maxMembers: 20, version: '1', closedAt: null })); }
        catch (error: any) { if (error?.code !== 'ER_DUP_ENTRY') throw error; }
      }
      if (!room) throw new Error('ROOM_CODE_EXHAUSTED');
      await manager.save(RoomMemberV2, manager.create(RoomMemberV2, { roomId: room.id, userId, legacyRoomUserId: null, nickname: input.nickname.trim(), nicknameNormalized: normalized(input.nickname), balancePoints: '0', role: 'owner', status: 'active', leftAt: null }));
      await this.outbox(manager, room, 'room.created'); return this.snapshotWith(manager, room, userId);
    }));
  }

  async join(userId: string, roomCode: string, input: { nickname: string; inviteToken?: string; scene?: string }, key: string) {
    this.validateNickname(input.nickname);
    return this.dataSource.transaction(async (manager) => this.idempotent(manager, userId, key, 'room.join', { roomCode, ...input }, async () => {
      const room = await manager.getRepository(RoomV2).createQueryBuilder('room').setLock('pessimistic_write').where('room.room_code=:roomCode', { roomCode }).getOne();
      if (!room) throw new NotFoundException({ code: 'ROOM_NOT_FOUND', message: '房间号无效或房间已删除' }); this.assertWritable(room);
      const tokenValid = await this.validInvite(room.id,input.inviteToken,input.scene,manager);
      if ((input.inviteToken || input.scene) && !tokenValid) throw new NotFoundException({ code: 'INVITE_INVALID', message: '邀请已失效' });
      const repository = manager.getRepository(RoomMemberV2); let member = await repository.findOne({ where: { roomId: room.id, userId } });
      const active = await repository.find({ where: { roomId: room.id, status: 'active' } });
      if (active.some((item) => item.id !== member?.id && item.nicknameNormalized === normalized(input.nickname))) throw fail('ROOM_NICKNAME_CONFLICT', '这个昵称已有人使用');
      if ((!member || member.status !== 'active') && active.length >= room.maxMembers) throw fail('ROOM_FULL', '房间人数已满');
      if (member) { member.nickname = input.nickname.trim(); member.nicknameNormalized = normalized(input.nickname); member.status = 'active'; member.leftAt = null; }
      else member = repository.create({ roomId: room.id, userId, nickname: input.nickname.trim(), nicknameNormalized: normalized(input.nickname), balancePoints: '0', role: 'member', status: 'active', leftAt: null, legacyRoomUserId: null });
      await repository.save(member); await this.bump(manager, room, 'member.joined', userId); return this.snapshotWith(manager, room, userId);
    }));
  }

  async snapshot(roomCode: string, userId: string) { const room = await this.roomByCode(roomCode); return this.snapshotWith(this.dataSource.manager, room, userId); }
  async records(roomCode: string, userId: string, related = false) {
    const room = await this.roomByCode(roomCode); const member = await this.member(this.dataSource.manager, room.id, userId);
    const query = this.dataSource.getRepository(LedgerRecordV2).createQueryBuilder('record').where('record.room_id=:roomId', { roomId: room.id }).orderBy('record.created_at','DESC').addOrderBy('record.id','DESC').take(30);
    if (related) query.andWhere('(record.from_member_id=:memberId OR record.to_member_id=:memberId)', { memberId: member.id });
    return { items: (await query.getMany()).map((item) => this.recordDto(item, userId, room.ownerUserId)), nextCursor: null };
  }

  async transfer(roomCode: string, userId: string, input: { toMemberId: string; points: number; note?: string }, key: string) {
    if (!Number.isInteger(input.points) || input.points < 1 || input.points > 99999) throw new BadRequestException({ code: 'POINTS_INVALID', message: '积分须为 1～99,999 的正整数' });
    if ((input.note || '').length > 100) throw new BadRequestException({ code: 'NOTE_TOO_LONG', message: '备注最多 100 字' });
    return this.dataSource.transaction(async (manager) => this.idempotent(manager, userId, key, 'record.create', { roomCode, ...input }, async () => {
      const room = await this.lockRoom(manager, roomCode); this.assertWritable(room); const from = await this.member(manager, room.id, userId, true, true);
      const to = await manager.getRepository(RoomMemberV2).createQueryBuilder('member').setLock('pessimistic_write').where('member.id=:id AND member.room_id=:roomId AND member.status=:status', { id: input.toMemberId, roomId: room.id, status: 'active' }).getOne();
      if (!to) throw new NotFoundException({ code: 'MEMBER_NOT_FOUND', message: '目标成员不存在' }); if (String(from.id) === String(to.id)) throw new BadRequestException({ code: 'SELF_TRANSFER', message: '不能给自己记积分' });
      from.balancePoints = String(Number(from.balancePoints) - input.points); to.balancePoints = String(Number(to.balancePoints) + input.points); await manager.save([from, to]);
      const record = await manager.save(LedgerRecordV2, manager.create(LedgerRecordV2, { roomId: room.id, fromMemberId: from.id, toMemberId: to.id, points: String(input.points), type: 'transfer', originalRecordId: null, fromNicknameSnapshot: from.nickname, toNicknameSnapshot: to.nickname, note: input.note?.trim() || null, operatorUserId: userId, idempotencyKey: key, reversedAt: null }));
      await this.bump(manager, room, 'record.created', userId); await this.assertBalanced(manager, room.id);
      return { record: this.recordDto(record, userId, room.ownerUserId), roomVersion: Number(room.version), balances: [from, to].map((m) => ({ memberId: String(m.id), balancePoints: Number(m.balancePoints) })) };
    }));
  }

  async reverse(roomCode: string, recordId: string, userId: string, reason: string | undefined, key: string) {
    return this.dataSource.transaction(async (manager) => this.idempotent(manager, userId, key, 'record.reverse', { roomCode, recordId, reason }, async () => {
      const room = await this.lockRoom(manager, roomCode); this.assertWritable(room); await this.member(manager,room.id,userId,false,true);
      const original = await manager.getRepository(LedgerRecordV2).createQueryBuilder('record').setLock('pessimistic_write').where('record.id=:recordId AND record.room_id=:roomId', { recordId, roomId: room.id }).getOne();
      if (!original || original.type === 'reversal') throw fail('RECORD_NOT_REVERSIBLE', '这条记录不能撤销'); if (original.reversedAt) throw fail('RECORD_ALREADY_REVERSED', '这条记录已经撤销');
      const fiveMinutes = Date.now() - original.createdAt.getTime() <= 300000; if (original.operatorUserId !== userId && room.ownerUserId !== userId || (!fiveMinutes && room.ownerUserId !== userId)) throw new ForbiddenException({ code: 'REVERSE_FORBIDDEN', message: '已超过可撤销时间' });
      const members = await manager.getRepository(RoomMemberV2).createQueryBuilder('member').setLock('pessimistic_write').where('member.id IN (:...ids)', { ids: [original.fromMemberId, original.toMemberId] }).getMany(); const from = members.find((m) => String(m.id) === String(original.toMemberId))!; const to = members.find((m) => String(m.id) === String(original.fromMemberId))!;
      from.balancePoints = String(Number(from.balancePoints) - Number(original.points)); to.balancePoints = String(Number(to.balancePoints) + Number(original.points)); original.reversedAt = new Date(); await manager.save([from, to, original]);
      const reversal = await manager.save(LedgerRecordV2, manager.create(LedgerRecordV2, { roomId: room.id, fromMemberId: from.id, toMemberId: to.id, points: original.points, type: 'reversal', originalRecordId: original.id, fromNicknameSnapshot: from.nickname, toNicknameSnapshot: to.nickname, note: reason?.trim() || original.note, operatorUserId: userId, idempotencyKey: key, reversedAt: null }));
      await this.bump(manager, room, 'record.reversed', userId); await this.assertBalanced(manager, room.id); return this.recordDto(reversal, userId, room.ownerUserId);
    }));
  }

  async close(roomCode: string, userId: string, key: string) { return this.dataSource.transaction(async (manager) => this.idempotent(manager, userId, key, 'room.close', { roomCode }, async () => { const room = await this.lockRoom(manager, roomCode); if (room.ownerUserId !== userId) throw new ForbiddenException({ code: 'OWNER_REQUIRED', message: '仅房主可以结束房间' }); this.assertWritable(room); room.status='closed'; room.closedAt=new Date(); await this.bump(manager, room, 'room.closed', userId); return this.settlementWith(manager, room, userId); })); }
  async settlement(roomCode: string, userId: string) { const room=await this.roomByCode(roomCode); await this.member(this.dataSource.manager, room.id, userId); return this.settlementWith(this.dataSource.manager, room, userId); }
  async rename(roomCode:string,userId:string,nickname:string){this.validateNickname(nickname);return this.dataSource.transaction(async manager=>{const room=await this.lockRoom(manager,roomCode);this.assertWritable(room);const me=await this.member(manager,room.id,userId,true,true);const conflict=await manager.findOne(RoomMemberV2,{where:{roomId:room.id,nicknameNormalized:normalized(nickname),status:'active'}});if(conflict&&String(conflict.id)!==String(me.id))throw fail('ROOM_NICKNAME_CONFLICT','这个昵称已有人使用');me.nickname=nickname.trim();me.nicknameNormalized=normalized(nickname);await manager.save(me);await this.bump(manager,room,'member.renamed',userId);return this.snapshotWith(manager,room,userId)})}
  async leave(roomCode:string,userId:string,key:string){return this.dataSource.transaction(async manager=>this.idempotent(manager,userId,key,'room.leave',{roomCode},async()=>{const room=await this.lockRoom(manager,roomCode);this.assertWritable(room);const me=await this.member(manager,room.id,userId,true,true);if(me.role==='owner')throw fail('OWNER_MUST_CLOSE','房主需先结束房间');me.status='left';me.leftAt=new Date();await manager.save(me);await this.bump(manager,room,'member.left',userId);return null}))}
  async operation(userId: string, key: string) { const row=await this.dataSource.getRepository(IdempotencyKeyV2).findOne({where:{userId,idempotencyKey:key}}); return row ? { status: row.status, resourceType: row.resourceType, resourceId: row.resourceId, errorCode: null } : { status:'unknown', resourceType:null, resourceId:null,errorCode:null }; }

  private async snapshotWith(manager: EntityManager, room: RoomV2, userId: string) { const current=await this.member(manager,room.id,userId); const members=await manager.find(RoomMemberV2,{where:{roomId:room.id},order:{joinedAt:'ASC'}}); const userIds=members.map(m=>m.userId).filter((id):id is string=>Boolean(id));const users=userIds.length?await manager.getRepository(UserV2).createQueryBuilder('u').where('u.id IN (:...userIds)',{userIds}).getMany():[];const avatars=new Map(users.map(u=>[String(u.id),u.avatarFileId?this.avatarUrl(u.avatarFileId):null]));const records=await manager.find(LedgerRecordV2,{where:{roomId:room.id},order:{createdAt:'DESC'},take:8}); return {id:String(room.id),roomCode:room.roomCode,name:room.name,status:room.status,version:Number(room.version),currentMemberId:String(current.id),members:members.map(m=>({id:String(m.id),nickname:m.nickname,avatarUrl:m.userId?avatars.get(String(m.userId))||null:null,balancePoints:Number(m.balancePoints),role:m.role,status:m.status,joinedAt:m.joinedAt})),recentRecords:records.map(r=>this.recordDto(r,userId,room.ownerUserId)),permissions:{canWrite:room.status==='active'&&current.status==='active',canClose:room.status==='active'&&room.ownerUserId===userId,canReverseAny:room.status==='active'&&room.ownerUserId===userId}}; }
  private async settlementWith(manager:EntityManager,room:RoomV2,userId:string){await this.member(manager,room.id,userId);const members=await manager.find(RoomMemberV2,{where:{roomId:room.id}});const records=await manager.count(LedgerRecordV2,{where:{roomId:room.id}});const raw=await manager.getRepository(LedgerRecordV2).createQueryBuilder('r').select('COALESCE(SUM(r.points),0)','total').where('r.room_id=:id',{id:room.id}).getRawOne();return{roomCode:room.roomCode,status:room.status,totalRecords:records,totalAmountMinor:Number(raw.total),startedAt:room.createdAt,closedAt:room.closedAt,balances:members.map(m=>({memberId:String(m.id),nickname:m.nickname,balancePoints:Number(m.balancePoints)})).sort((a,b)=>b.balancePoints-a.balancePoints)}}
  private recordDto(r:LedgerRecordV2,userId:string,ownerId:string){return{id:String(r.id),type:r.type,fromMemberId:String(r.fromMemberId),fromNicknameSnapshot:r.fromNicknameSnapshot,toMemberId:String(r.toMemberId),toNicknameSnapshot:r.toNicknameSnapshot,points:Number(r.points),note:r.note,originalRecordId:r.originalRecordId?String(r.originalRecordId):null,reversedAt:r.reversedAt,canReverse:!r.reversedAt&&r.type==='transfer'&&(r.operatorUserId===userId&&Date.now()-r.createdAt.getTime()<=300000||ownerId===userId),createdAt:r.createdAt}}
  private async roomByCode(code:string){const room=await this.dataSource.getRepository(RoomV2).findOne({where:{roomCode:code}});if(!room)throw new NotFoundException({code:'ROOM_NOT_FOUND',message:'房间号无效或房间已删除'});return room}
  private async lockRoom(manager:EntityManager,code:string){const room=await manager.getRepository(RoomV2).createQueryBuilder('room').setLock('pessimistic_write').where('room.room_code=:code',{code}).getOne();if(!room)throw new NotFoundException({code:'ROOM_NOT_FOUND',message:'房间号无效或房间已删除'});return room}
  private async member(manager:EntityManager,roomId:string,userId:string,lock=false,activeOnly=false){let q=manager.getRepository(RoomMemberV2).createQueryBuilder('member').where('member.room_id=:roomId AND member.user_id=:userId',{roomId,userId});if(activeOnly)q=q.andWhere('member.status=:status',{status:'active'});if(lock)q=q.setLock('pessimistic_write');const m=await q.getOne();if(!m)throw new ForbiddenException({code:'ROOM_FORBIDDEN',message:'你不是该房间成员'});return m}
  private assertWritable(room:RoomV2){if(room.status!=='active')throw fail('ROOM_CLOSED','本房间已结束，只能查看记录')}
  private validateNickname(value:string){const length=[...String(value||'').trim()].length;if(length<1||length>10)throw new BadRequestException({code:'NICKNAME_INVALID',message:'昵称应为 1～10 个字'})}
  private validateRoomName(value:string){const length=[...String(value||'').trim()].length;if(length<1||length>20)throw new BadRequestException({code:'ROOM_NAME_INVALID',message:'房间名称应为 1～20 个字'})}
  private async validInvite(roomId:string,invite?:string,scene?:string,manager:EntityManager=this.dataSource.manager){if(!invite&&!scene)return false;const query=manager.getRepository(InviteTokenV2).createQueryBuilder('invite').where('invite.room_id=:roomId AND invite.revoked_at IS NULL',{roomId}).andWhere('(invite.expires_at IS NULL OR invite.expires_at>:now)',{now:new Date()});if(invite)query.andWhere('invite.token_hash=:tokenHash',{tokenHash:hash(invite)});else query.andWhere('invite.scene=:scene',{scene});return Boolean(await query.getOne())}
  private async bump(manager:EntityManager,room:RoomV2,event:string,userId:string){room.version=String(Number(room.version)+1);await manager.save(room);await this.outbox(manager,room,event,userId)}
  private async outbox(manager:EntityManager,room:RoomV2,eventType:string,userId?:string){await manager.save(OutboxEventV2,manager.create(OutboxEventV2,{aggregateType:'room',aggregateId:room.id,eventType,payloadJson:{roomCode:room.roomCode,version:Number(room.version),reason:eventType},attempts:0,availableAt:new Date(),publishedAt:null}))}
  private async assertBalanced(manager:EntityManager,roomId:string){const raw=await manager.getRepository(RoomMemberV2).createQueryBuilder('m').select('COALESCE(SUM(m.balance_points),0)','total').where('m.room_id=:roomId',{roomId}).getRawOne();if(Number(raw.total)!==0)throw new Error('ROOM_BALANCE_INVARIANT_BROKEN')}
  private avatarUrl(id:string){const base=(process.env.PUBLIC_API_BASE_URL||'http://127.0.0.1:6015/api/v2').replace(/\/$/,'');return`${base}/profile-avatars/${id}`}
  private async idempotent<T>(manager:EntityManager,userId:string,key:string,operation:string,request:unknown,work:()=>Promise<T>):Promise<T>{const repo=manager.getRepository(IdempotencyKeyV2);const requestHash=hash(JSON.stringify(request));const existing=await repo.findOne({where:{userId,idempotencyKey:key}});if(existing){if(existing.requestHash!==requestHash)throw fail('IDEMPOTENCY_CONFLICT','同一幂等键不能用于不同请求');if(existing.status==='succeeded')return existing.responseJson as T;throw fail('OPERATION_PROCESSING','请求正在处理中')}const row=await repo.save(repo.create({userId,idempotencyKey:key,operation,status:'processing',requestHash,responseStatus:null,responseJson:null,resourceType:null,resourceId:null,expiresAt:new Date(Date.now()+86400_000)}));const result=await work();row.status='succeeded';row.responseStatus=200;row.responseJson=result;await repo.save(row);return result}
}
