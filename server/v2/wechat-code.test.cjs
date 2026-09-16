require('reflect-metadata');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { WechatCodeV2Service } = require('./wechat-code.service');
const { WechatCodeV2Controller } = require('./wechat-code.controller');

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
function fixture({ expired = false, closed = false } = {}) {
  let reads = 0;
  const calls = [];
  const service = new WechatCodeV2Service({ getRepository: () => ({ findOne: async () => ++reads === 1 ? { roomId: 'room', expiresAt: new Date(Date.now() + (expired ? -1000 : 60000)) } : closed ? null : { id: 'room', status: 'active' } }) });
  service.accessToken = async () => 'test-token-never-log';
  service.post = async (_path, body) => { calls.push(body); return png; };
  service.logger = { warn: () => {} };
  return { service, calls, reads: () => reads };
}

for (const environment of ['trial', 'develop', 'release']) {
  test(`${environment} produces the requested code and checks only released pages`, async () => {
    const { service, calls } = fixture();
    assert.deepEqual(await service.image('opaque-scene', environment), png);
    assert.equal(calls[0].env_version, environment);
    assert.equal(calls[0].check_path, environment === 'release');
    assert.equal(calls[0].page, 'pages/preview/index');
  });
}
test('missing version retains the server/default release behavior', async () => {
  const { service, calls } = fixture();
  await service.image('opaque-scene');
  assert.equal(calls[0].env_version, process.env.WECHAT_CODE_ENV_VERSION || 'release');
});
test('WeChat JPEG response is accepted and served with its real content type', async () => {
  const { service } = fixture();
  const jpeg = Buffer.from([0xff,0xd8,0xff,0xe0,0,0x10,0x4a,0x46,0x49,0x46,0xff,0xd9]);
  service.post = async () => jpeg;
  const headers = {};
  let image;
  await new WechatCodeV2Controller(service).image('opaque-scene', 'trial', { setHeader: (name, value) => { headers[name] = value; }, send: value => { image = value; } });
  assert.equal(headers['Content-Type'], 'image/jpeg');
  assert.deepEqual(image, jpeg);
});
test('unrecognized versions are rejected before accessing an invitation', async () => {
  const { service, reads } = fixture();
  await assert.rejects(service.image('opaque-scene', 'arbitrary'), error => error.getStatus() === 400);
  assert.equal(reads(), 0);
});
for (const options of [{ expired: true }, { closed: true }]) {
  test(`expired invitations and closed rooms cannot generate codes: ${JSON.stringify(options)}`, async () => {
    const { service, calls } = fixture(options);
    await assert.rejects(service.image('opaque-scene', 'trial'), error => error.getStatus() === 404);
    assert.equal(calls.length, 0);
  });
}
test('WeChat error JSON is a 503, never an image or leaked credential', async () => {
  const { service } = fixture();
  service.post = async () => Buffer.from(JSON.stringify({ errcode: 41030, errmsg: 'invalid page test-token-never-log' }));
  const logs = [];
  service.logger.warn = value => logs.push(value);
  await assert.rejects(service.image('opaque-scene', 'release'), error => error.getStatus() === 503 && error.getResponse().code === 'WECHAT_CODE_GENERATION_FAILED');
  assert.ok(logs[0].includes('41030'));
  assert.ok(!logs.join('').includes('test-token-never-log'));
  assert.ok(!logs.join('').includes('opaque-scene'));
});
test('expired upstream access token is retried once, without endless retries', async () => {
  const { service } = fixture();
  let attempts = 0;
  service.post = async () => ++attempts === 1 ? Buffer.from('{"errcode":42001}') : png;
  assert.deepEqual(await service.image('opaque-scene', 'trial'), png);
  assert.equal(attempts, 2);
  attempts = 0;
  service.post = async () => { attempts++; return Buffer.from('{"errcode":42001}'); };
  await assert.rejects(service.image('opaque-scene', 'trial'), error => error.getStatus() === 503);
  assert.equal(attempts, 2);
});
