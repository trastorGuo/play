// Read-only production probe: never signs in, creates rooms or alters user data.
import assert from 'node:assert/strict';
import WebSocket from 'ws';
const origin = process.env.V2_VERIFY_ORIGIN || 'https://www.6rem.com';
const protectedRoutes = [
 ['GET','rooms/recent'], ['GET','rooms/000000'], ['POST','rooms'], ['POST','rooms/000000/join'],
 ['GET','rooms/000000/records'], ['POST','rooms/000000/records'], ['POST','rooms/000000/records/0/reverse'],
 ['POST','rooms/000000/close'], ['POST','rooms/000000/leave'], ['PATCH','rooms/000000/me'], ['GET','rooms/000000/settlement'],
 ['GET','operations/00000000-0000-4000-8000-000000000000'], ['POST','rooms/000000/share-code'], ['POST','rooms/000000/invite/reset'],
 ['GET','feedback'], ['POST','feedback'], ['POST','files/feedback-images'], ['POST','files/profile-avatars'],
 ['GET','me'], ['PATCH','me'], ['GET','me/account-deletion/check'], ['POST','me/account-deletion'], ['POST','realtime/ticket'], ['POST','auth/logout'],
];
for (const [method,path] of protectedRoutes) {
 const response = await fetch(`${origin}/api/v2/${path}`, {method});
 assert.equal(response.status,401,`${method} ${path}`);
 const body=await response.json();assert.equal(body.success,false);
}
const health=await fetch(origin+'/api/v2/health');assert.equal(health.status,200);assert.equal((await health.json()).data.status,'ok');
for(const path of ['rooms/000000/preview','invites/scene/diagnostic-nonexistent','profile-avatars/00000000-0000-4000-8000-000000000000','share-codes/diagnostic-nonexistent.png']){
 const response=await fetch(`${origin}/api/v2/${path}`);assert.equal(response.status,404,path);
}
for(const path of ['auth/wechat-login','auth/refresh']){
 const response=await fetch(`${origin}/api/v2/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(response.status,400,path);
}
const legacy=await fetch(origin+'/api/room/admin/test');assert.equal(legacy.status,200);assert.equal((await legacy.json()).data.result,1);
const web=await fetch(origin+'/');assert.equal(web.status,200);const html=await web.text();assert.ok(html.includes('<html'));
const assets=[...html.matchAll(/(?:src|href)="([^"\s]+\.(?:js|css))"/g)].map(m=>m[1]).filter(p=>!/^https?:/.test(p));
for(const asset of assets)assert.equal((await fetch(new URL(asset,origin))).status,200,asset);
const socket=await fetch(origin+'/socket.io/?EIO=4&transport=polling');assert.ok((await socket.text()).startsWith('0{"sid"'));
await new Promise((resolve,reject)=>{const ws=new WebSocket(origin.replace(/^http/,'ws')+'/ws?ticket=invalid-diagnostic');const timer=setTimeout(()=>{ws.terminate();reject(new Error('WSS timeout'))},8000);ws.on('close',code=>{clearTimeout(timer);try{assert.equal(code,4001);resolve()}catch(e){reject(e)}});ws.on('error',reject)});
console.log(JSON.stringify({origin,protectedRoutes:protectedRoutes.length,publicMissingResources:4,authValidation:2,legacyHttp:true,legacySocketIO:true,wssAuthorization:true,webAssets:assets.length,tlsVerified:true,writes:0}));
