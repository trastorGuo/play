import { ForbiddenException, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { OutboxEventV2, RoomMemberV2, RoomV2 } from './entities';

@Injectable()
export class RealtimeV2Service implements OnModuleInit, OnModuleDestroy {
  private redis:Redis;
  private timer:NodeJS.Timeout|null=null;
  private readonly memoryTickets=new Map<string,{userId:string;expiresAt:number}>();
  private readonly events=new EventEmitter();
  constructor(private readonly db:DataSource){this.redis=new Redis({host:process.env.REDIS_HOST||'127.0.0.1',port:Number(process.env.REDIS_PORT||6379),password:process.env.REDIS_PASSWORD||undefined,lazyConnect:true,maxRetriesPerRequest:1,enableOfflineQueue:false});this.redis.on('error',()=>undefined)}
  async onModuleInit(){try{await this.redis.connect()}catch{if(!this.memoryFallback())return}this.timer=setInterval(()=>void this.flushOutbox(),1000)}
  async onModuleDestroy(){if(this.timer)clearInterval(this.timer);this.redis.disconnect()}
  async issue(userId:string){const ticket=randomBytes(32).toString('base64url');if(this.redis.status==='ready')await this.redis.set(`ws:ticket:${ticket}`,userId,'EX',60,'NX');else if(this.memoryFallback())this.memoryTickets.set(ticket,{userId,expiresAt:Date.now()+60000});else throw new Error('REALTIME_UNAVAILABLE');return{ticket,expiresIn:60}}
  async consume(ticket:string){if(!ticket)return null;if(this.redis.status==='ready'){const result=await this.redis.eval("local v=redis.call('GET',KEYS[1]); if v then redis.call('DEL',KEYS[1]) end; return v",1,`ws:ticket:${ticket}`);return result?String(result):null}if(!this.memoryFallback())return null;const item=this.memoryTickets.get(ticket);this.memoryTickets.delete(ticket);return item&&item.expiresAt>Date.now()?item.userId:null}
  async assertMember(userId:string,roomCode:string){const room=await this.db.getRepository(RoomV2).findOne({where:{roomCode}});if(!room)throw new ForbiddenException();const member=await this.db.getRepository(RoomMemberV2).findOne({where:{roomId:room.id,userId,status:'active'}});if(!member)throw new ForbiddenException();return room}
  async subscribe(roomId:string,onMessage:(event:any)=>void){const channel=`room:channel:${roomId}`;if(this.redis.status!=='ready'){if(!this.memoryFallback())throw new Error('REALTIME_UNAVAILABLE');this.events.on(channel,onMessage);return async()=>{this.events.off(channel,onMessage)}}const subscriber=this.redis.duplicate({lazyConnect:true});await subscriber.connect();await subscriber.subscribe(channel);subscriber.on('message',(_channel,message)=>{try{onMessage(JSON.parse(message))}catch{}});return async()=>{await subscriber.unsubscribe(channel);subscriber.disconnect()}}
  private async flushOutbox(){if(this.redis.status!=='ready'&&!this.memoryFallback())return;const repo=this.db.getRepository(OutboxEventV2);const rows=await repo.createQueryBuilder('event').where('event.published_at IS NULL').andWhere('event.available_at <= :now',{now:new Date()}).orderBy('event.id','ASC').limit(50).getMany();for(const row of rows){try{const channel=`room:channel:${row.aggregateId}`;if(this.redis.status==='ready')await this.redis.publish(channel,JSON.stringify(row.payloadJson));else this.events.emit(channel,row.payloadJson);row.publishedAt=new Date();row.attempts+=1;await repo.save(row)}catch{row.attempts+=1;row.availableAt=new Date(Date.now()+Math.min(row.attempts*1000,60000));await repo.save(row);break}}}
  private memoryFallback(){return process.env.NODE_ENV!=='production'&&process.env.V2_REALTIME_MEMORY_FALLBACK==='true'}
}
