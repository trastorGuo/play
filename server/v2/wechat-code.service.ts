import { Injectable, NotFoundException } from '@nestjs/common';
import { request } from 'https';
import { DataSource, IsNull } from 'typeorm';
import { InviteTokenV2, RoomV2 } from './entities';

@Injectable()
export class WechatCodeV2Service {
  private cached:{token:string;expiresAt:number}|null=null;
  constructor(private readonly db:DataSource){}
  async image(scene:string){const invite=await this.db.getRepository(InviteTokenV2).findOne({where:{scene,revokedAt:IsNull()}});if(!invite||invite.expiresAt&&invite.expiresAt<=new Date())throw new NotFoundException();const room=await this.db.getRepository(RoomV2).findOne({where:{id:invite.roomId,status:'active'}});if(!room)throw new NotFoundException();const token=await this.accessToken();const result=await this.post(`/wxa/getwxacodeunlimit?access_token=${encodeURIComponent(token)}`,{scene,page:'pages/preview/index',check_path:true,env_version:process.env.WECHAT_CODE_ENV_VERSION||'release'});if(result.length<100||result[0]===0x7b){throw new Error('WECHAT_CODE_GENERATION_FAILED')}return result}
  private async accessToken(){if(this.cached&&this.cached.expiresAt>Date.now()+60000)return this.cached.token;const appid=this.required('WECHAT_APP_ID'),secret=this.required('WECHAT_APP_SECRET');const data=await this.get(`/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`);const parsed=JSON.parse(data.toString());if(!parsed.access_token)throw new Error('WECHAT_ACCESS_TOKEN_FAILED');this.cached={token:String(parsed.access_token),expiresAt:Date.now()+Number(parsed.expires_in||7200)*1000};return this.cached.token}
  private call(method:'GET'|'POST',path:string,body?:Buffer):Promise<Buffer>{return new Promise((resolve,reject)=>{const req=request({hostname:'api.weixin.qq.com',path,method,headers:body?{'Content-Type':'application/json','Content-Length':body.length}:undefined},response=>{const chunks:Buffer[]=[];response.on('data',chunk=>chunks.push(Buffer.from(chunk)));response.on('end',()=>resolve(Buffer.concat(chunks)))});req.on('error',reject);if(body)req.write(body);req.end()})}
  private get(path:string){return this.call('GET',path)}
  private post(path:string,data:unknown){return this.call('POST',path,Buffer.from(JSON.stringify(data)))}
  private required(name:string){const value=process.env[name];if(!value)throw new Error(`${name} is required`);return value}
}
