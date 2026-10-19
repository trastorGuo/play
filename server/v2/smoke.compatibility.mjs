import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = process.env.V2_SMOKE_BASE_URL || 'http://127.0.0.1:6022/api/v2';
if (process.env.V2_SMOKE_ISOLATED !== 'true' || !['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Requires an explicitly isolated loopback test database');
async function call(path, { token, method = 'GET', body, status = 200, key = randomUUID() } = {}) {
  const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  assert.equal(response.status, status, `${method} ${path}: ${await response.clone().text()}`);
  return status === 204 ? null : (await response.json()).data;
}
const login = () => call('/auth/wechat-login', { method: 'POST', body: { code: `compat-${randomUUID()}` } });
const a = await login(), b = await login(), stranger = await login();
const key = randomUUID();
const room = await call('/rooms', { token: a.accessToken, method: 'POST', body: { name: '接口验收', nickname: '房主' }, key, status: 201 });
const p = `/rooms/${room.roomCode}`;
assert.equal((await call(`/operations/${key}`, { token: a.accessToken })).status, 'succeeded');
assert.equal((await call(`/operations/${key}`, { token: b.accessToken })).status, 'unknown');
await call(p, { token: stranger.accessToken, status: 403 });
await call(p + '/leave', { token: a.accessToken, method: 'POST', status: 409 });
const joined = await call(p + '/join', { token: b.accessToken, method: 'POST', body: { nickname: '成员' } });
await call(p + '/me', { token: b.accessToken, method: 'PATCH', body: { nickname: '新昵称' } });
await call(p + '/close', { token: b.accessToken, method: 'POST', status: 403 });
const member = joined.members.find(m => m.nickname === '成员');
for (const points of [0, -1, 1.5, 100000]) await call(p + '/records', { token: a.accessToken, method: 'POST', body: { toMemberId: member.id, points }, status: 400 });
const record = await call(p + '/records', { token: a.accessToken, method: 'POST', body: { toMemberId: member.id, points: 99999 }, status: 201 });
assert.equal((await call(p + '/records?relatedToMe=true', { token: a.accessToken })).items.length, 1);
await call(p + '/settlement', { token: a.accessToken });
await call(p + `/records/${record.record.id}/reverse`, { token: b.accessToken, method: 'POST', body: {}, status: 403 });
const reversed = await call(p + `/records/${record.record.id}/reverse`, { token: a.accessToken, method: 'POST', body: {}, status: 201 });
await call(p + `/records/${reversed.id}/reverse`, { token: a.accessToken, method: 'POST', body: {}, status: 409 });
assert.equal((await call(p + '/records', { token: a.accessToken })).items.length, 2);
await call(p + '/leave', { token: b.accessToken, method: 'POST', status: 204 });
await call(p + '/records', { token: b.accessToken }); // Historical membership remains readable.
await call(p + '/close', { token: a.accessToken, method: 'POST' });
assert.equal((await call('/me/account-deletion/check', { token: a.accessToken })).canApply, true);
assert.equal((await call('/me/account-deletion', { token: a.accessToken, method: 'POST', status: 202 })).status, 'pending');
const image = await fetch(base + '/share-codes/does-not-exist.png?envVersion=trial');
assert.equal(image.status, 404);
const legacy = base.replace('/api/v2', '/api/room');
async function old(path, body) {
 const response = await fetch(legacy + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
 assert.ok(response.ok, path); const envelope = await response.json(); const value = envelope.data;
 assert.equal(value.result, 1, `${path}: ${JSON.stringify(value)}`); return value.data;
}
const created = await old('/create', { name: '旧版兼容验收', ownerId: 1000000001, ownerName: '旧版甲' });
const roomCode = created.roomCode;
await old('/join', { roomCode, userId: 1000000002, nickname: '旧版乙' });
await old('/info/' + roomCode);
await old('/updateNickname', { roomCode, userId: 1000000002, nickname: '旧版乙改名' });
await old('/addExpense', { roomCode, fromUserId: 1000000001, toUserId: 1000000002, amount: 10, operatorId: 1000000001 });
assert.equal((await old('/records/' + roomCode)).length, 1);
await old('/admin/test'); await old('/admin/rooms'); await old(`/admin/room/${roomCode}/stats`);
const abort = new AbortController();
const stream = await fetch(`${legacy}/${roomCode}/events`, { signal: abort.signal });
assert.ok(stream.headers.get('content-type').includes('text/event-stream')); abort.abort();
await old('/leave', { roomCode, userId: 1000000002 });
const socketIO = await fetch(new URL('/socket.io/?EIO=4&transport=polling', base));
assert.ok((await socketIO.text()).startsWith('0{"sid"'));
console.log('PASS v2 operation isolation, permissions, integer limits, history, settlement, deletion and legacy HTTP/SSE/Socket.IO compatibility');
