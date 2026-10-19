import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = process.env.V2_SMOKE_BASE_URL || 'http://127.0.0.1:6022/api/v2';
if (process.env.V2_SMOKE_ISOLATED !== 'true' || !['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Requires an explicitly isolated loopback test database');
async function request(path, token, method = 'GET', body, status = 200) {
  const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID(), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  assert.equal(response.status, status, `${method} ${path}`);
  return status === 204 ? null : (await response.json()).data;
}
const login = () => request('/auth/wechat-login', null, 'POST', { code: `regression-${randomUUID()}` });
const a = await login();
const rotated = await request('/auth/refresh', null, 'POST', { refreshToken: a.refreshToken });
await request('/auth/refresh', null, 'POST', { refreshToken: a.refreshToken }, 401);
const races = await Promise.all(Array.from({ length: 5 }, () => fetch(base + '/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: rotated.refreshToken }) })));
assert.deepEqual(races.map(r => r.status).sort(), [200, 401, 401, 401, 401]);
const winner = (await races.find(r => r.status === 200).json()).data;
await request('/auth/logout', winner.accessToken, 'POST', { refreshToken: winner.refreshToken }, 204);
await request('/auth/refresh', null, 'POST', { refreshToken: winner.refreshToken }, 401);
console.log('PASS refresh replay, concurrent rotation and logout revocation');
const owner = await login(), peer = await login();
const room = await request('/rooms', owner.accessToken, 'POST', { name: '容量回归', nickname: '房主' }, 201);
const code = room.roomCode;
await request(`/rooms/${code}/join`, peer.accessToken, 'POST', { nickname: '离开成员' });
await request(`/rooms/${code}/leave`, peer.accessToken, 'POST', {}, 204);
for (let i = 0; i < 19; i++) { const user = await login(); await request(`/rooms/${code}/join`, user.accessToken, 'POST', { nickname: `成员${i}` }); }
await request(`/rooms/${code}/join`, peer.accessToken, 'POST', { nickname: '重新加入' }, 409);
const snapshot = await request(`/rooms/${code}`, owner.accessToken);
assert.equal(snapshot.members.filter(m => m.status === 'active').length, 20);
console.log('PASS returning members cannot bypass 20-member capacity');
