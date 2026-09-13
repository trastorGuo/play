import WebSocket from 'ws'

const base = process.env.V2_SMOKE_BASE_URL || 'http://127.0.0.1:6020/api/v2'
const call = async (path, { method = 'GET', token, key, body } = {}) => {
  const response = await fetch(`${base}${path}`, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(key ? { 'Idempotency-Key': key } : {}), 'Content-Type': 'application/json', 'X-Request-Id': crypto.randomUUID() }, body: body ? JSON.stringify(body) : undefined })
  const data = response.status === 204 ? null : await response.json()
  if (!response.ok) throw Object.assign(new Error(data?.error?.message || `HTTP ${response.status}`), { status: response.status, data })
  return data?.data
}
const upload = async (token) => {
  const form = new FormData()
  form.append('file', new Blob([Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])], { type: 'image/png' }), 'smoke.png')
  const response = await fetch(`${base}/files/feedback-images`, { method:'POST', headers:{ Authorization:`Bearer ${token}`,'X-Request-Id':crypto.randomUUID() }, body:form })
  const data=await response.json();if(!response.ok)throw Object.assign(new Error(data?.error?.message||`HTTP ${response.status}`),{status:response.status,data});return data.data
}
const uploadAvatar = async (token) => {
  const form = new FormData()
  form.append('file', new Blob([Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])], { type: 'image/png' }), 'avatar.png')
  const response = await fetch(`${base}/files/profile-avatars`, { method:'POST', headers:{ Authorization:`Bearer ${token}`,'Idempotency-Key':crypto.randomUUID(),'X-Request-Id':crypto.randomUUID() }, body:form })
  const data=await response.json();if(!response.ok)throw Object.assign(new Error(data?.error?.message||`HTTP ${response.status}`),{status:response.status,data});return data.data
}
const openSocket = (ticket, roomCode) => new Promise((resolve,reject) => {
  const wsBase=base.replace(/^http/,'ws').replace(/\/api\/v2$/,'')
  const socket=new WebSocket(`${wsBase}/ws?ticket=${encodeURIComponent(ticket)}`)
  const timer=setTimeout(()=>{socket.close();reject(new Error('websocket timeout'))},5000)
  socket.on('open',()=>socket.send(JSON.stringify({type:'room.subscribe',requestId:crypto.randomUUID(),roomCode,lastVersion:0})))
  socket.on('message',(raw)=>{const event=JSON.parse(String(raw));if(event.type==='room.subscribed'){clearTimeout(timer);resolve({socket,event})}})
  socket.on('error',(error)=>{clearTimeout(timer);reject(error)})
})

const a = await call('/auth/wechat-login', { method: 'POST', body: { code: `smoke-a-${Date.now()}` } })
const b = await call('/auth/wechat-login', { method: 'POST', body: { code: `smoke-b-${Date.now()}` } })
let validationRejected=false
try{await call('/rooms',{method:'POST',token:a.accessToken,key:crypto.randomUUID(),body:{name:'非法字段',nickname:'甲',unexpected:true}})}catch(error){validationRejected=error.status===400}
if(!validationRejected)throw new Error('DTO whitelist failed')
const created = await call('/rooms', { method: 'POST', token: a.accessToken, key: crypto.randomUUID(), body: { name: '集成测试房间', nickname: '甲' } })
if('joinCode' in created)throw new Error('join code leaked from room create')
const firstInvite=await call(`/rooms/${created.roomCode}/share-code`,{method:'POST',token:a.accessToken})
if('joinCode' in firstInvite)throw new Error('join code leaked from share')
const codePreview=await call(`/rooms/${created.roomCode}/preview`)
if(codePreview.roomCode!==created.roomCode||'members' in codePreview)throw new Error('room-code-only preview/privacy failed')
const preview=await call(`/rooms/${created.roomCode}/preview?scene=${encodeURIComponent(firstInvite.scene)}`)
if(preview.roomCode!==created.roomCode||'members' in preview)throw new Error('pre-join privacy failed')
const resetKey=crypto.randomUUID();const invite=await call(`/rooms/${created.roomCode}/invite/reset`,{method:'POST',token:a.accessToken,key:resetKey});const duplicateInvite=await call(`/rooms/${created.roomCode}/invite/reset`,{method:'POST',token:a.accessToken,key:resetKey})
if('joinCode' in invite)throw new Error('join code leaked from reset')
if(invite.scene!==duplicateInvite.scene)throw new Error('invite reset idempotency failed')
let oldInviteRejected=false
try{await call(`/invites/scene/${firstInvite.scene}`)}catch(error){oldInviteRejected=error.status===404}
if(!oldInviteRejected)throw new Error('old invite remains valid')
const joined = await call(`/rooms/${created.roomCode}/join`, { method: 'POST', token: b.accessToken, key: crypto.randomUUID(), body: { nickname: '乙', scene: invite.scene } })
const target = joined.members.find((member) => member.nickname === '乙')
const ticket=await call('/realtime/ticket',{method:'POST',token:a.accessToken})
const {socket}=await openSocket(ticket.ticket,created.roomCode)
const idempotencyKey = crypto.randomUUID()
const first = await call(`/rooms/${created.roomCode}/records`, { method: 'POST', token: a.accessToken, key: idempotencyKey, body: { toMemberId: target.id, points: 20, note: 'smoke' } })
const duplicate = await call(`/rooms/${created.roomCode}/records`, { method: 'POST', token: a.accessToken, key: idempotencyKey, body: { toMemberId: target.id, points: 20, note: 'smoke' } })
if (first.record.id !== duplicate.record.id) throw new Error('idempotency failed')
await call(`/rooms/${created.roomCode}/records/${first.record.id}/reverse`, { method: 'POST', token: a.accessToken, key: crypto.randomUUID(), body: { reason: 'smoke reversal' } })
const file=await upload(a.accessToken);await call('/feedback',{method:'POST',token:a.accessToken,body:{category:'bug',content:'smoke feedback',roomCode:created.roomCode,imageFileId:file.fileId}})
const feedback=await call('/feedback',{token:a.accessToken});if(!feedback.items.some((item)=>item.content==='smoke feedback'))throw new Error('feedback persistence failed')
const avatar=await uploadAvatar(a.accessToken);const profile=await call('/me',{method:'PATCH',token:a.accessToken,key:crypto.randomUUID(),body:{displayName:'冒烟用户',avatarFileId:avatar.fileId}});if(profile.displayName!=='冒烟用户'||!profile.avatarUrl)throw new Error('profile update failed')
const avatarResponse=await fetch(profile.avatarUrl);if(!avatarResponse.ok||avatarResponse.headers.get('content-type')!=='image/png')throw new Error('profile avatar serving failed')
const me=await call('/me',{token:a.accessToken});if(me.roomStats.active<1||me.displayName!=='冒烟用户')throw new Error('profile stats failed')
let deletionBlocked=false
try{await call('/me/account-deletion',{method:'POST',token:a.accessToken,key:crypto.randomUUID()})}catch(error){deletionBlocked=error.status===409}
if(!deletionBlocked)throw new Error('owner deletion guard failed')
const snapshot = await call(`/rooms/${created.roomCode}`, { token: a.accessToken })
if (snapshot.members.reduce((sum, member) => sum + member.balancePoints, 0) !== 0) throw new Error('balance invariant failed')
await call(`/rooms/${created.roomCode}/close`, { method: 'POST', token: a.accessToken, key: crypto.randomUUID() })
let closedRejected = false
try { await call(`/rooms/${created.roomCode}/records`, { method: 'POST', token: a.accessToken, key: crypto.randomUUID(), body: { toMemberId: target.id, points: 1 } }) } catch (error) { closedRejected = error.status === 409 }
socket.close()
if (!closedRejected) throw new Error('closed room accepted write')
console.log(JSON.stringify({ health: await call('/health'), roomCode: created.roomCode, memberCount: snapshot.members.length, balanceSum: 0, idempotentRecordId: first.record.id, reversalPreserved: true, closedWriteRejected: true, validationRejected, preJoinPrivacy:true, inviteReset:true, feedbackFileId:file.fileId, profileAvatarFileId:avatar.fileId, deletionGuard:true, realtimeTicket:true }))
