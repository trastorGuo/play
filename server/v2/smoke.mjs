const base = process.env.V2_SMOKE_BASE_URL || 'http://127.0.0.1:6020/api/v2'
const call = async (path, { method = 'GET', token, key, body } = {}) => {
  const response = await fetch(`${base}${path}`, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(key ? { 'Idempotency-Key': key } : {}), 'Content-Type': 'application/json', 'X-Request-Id': crypto.randomUUID() }, body: body ? JSON.stringify(body) : undefined })
  const data = await response.json()
  if (!response.ok) throw Object.assign(new Error(data?.error?.message || `HTTP ${response.status}`), { status: response.status, data })
  return data.data
}

const a = await call('/auth/wechat-login', { method: 'POST', body: { code: `smoke-a-${Date.now()}` } })
const b = await call('/auth/wechat-login', { method: 'POST', body: { code: `smoke-b-${Date.now()}` } })
const created = await call('/rooms', { method: 'POST', token: a.accessToken, key: crypto.randomUUID(), body: { name: '集成测试房间', nickname: '甲' } })
const joined = await call(`/rooms/${created.roomCode}/join`, { method: 'POST', token: b.accessToken, key: crypto.randomUUID(), body: { nickname: '乙' } })
const target = joined.members.find((member) => member.nickname === '乙')
const idempotencyKey = crypto.randomUUID()
const first = await call(`/rooms/${created.roomCode}/records`, { method: 'POST', token: a.accessToken, key: idempotencyKey, body: { toMemberId: target.id, points: 20, note: 'smoke' } })
const duplicate = await call(`/rooms/${created.roomCode}/records`, { method: 'POST', token: a.accessToken, key: idempotencyKey, body: { toMemberId: target.id, points: 20, note: 'smoke' } })
if (first.record.id !== duplicate.record.id) throw new Error('idempotency failed')
await call(`/rooms/${created.roomCode}/records/${first.record.id}/reverse`, { method: 'POST', token: a.accessToken, key: crypto.randomUUID(), body: { reason: 'smoke reversal' } })
const snapshot = await call(`/rooms/${created.roomCode}`, { token: a.accessToken })
if (snapshot.members.reduce((sum, member) => sum + member.balancePoints, 0) !== 0) throw new Error('balance invariant failed')
await call(`/rooms/${created.roomCode}/close`, { method: 'POST', token: a.accessToken, key: crypto.randomUUID() })
let closedRejected = false
try { await call(`/rooms/${created.roomCode}/records`, { method: 'POST', token: a.accessToken, key: crypto.randomUUID(), body: { toMemberId: target.id, points: 1 } }) } catch (error) { closedRejected = error.status === 409 }
if (!closedRejected) throw new Error('closed room accepted write')
console.log(JSON.stringify({ health: await call('/health'), roomCode: created.roomCode, memberCount: snapshot.members.length, balanceSum: 0, idempotentRecordId: first.record.id, reversalPreserved: true, closedWriteRejected: true }))
