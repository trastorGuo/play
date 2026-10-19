# 2026-10-20 部署与验收

## 线上结果

- SSH：`root@81.68.255.143`。`play-backend` 已运行 `yizhuoji-backend:v1.0.4`。
- 镜像：`sha256:7abd64281acb01d4e33792b79b2d8f3ddb879902f901c2b398c272ff20c9980b`。
- API：`https://www.6rem.com/api/v2`；旧 `/api/room/*`、网页、Socket.IO 和 `/ws` 保持兼容。
- 生产微信登录开启，mock 关闭；自动同步表和自动 migration 关闭。保留原数据库、Redis、上传卷、环境文件、域名和 Nginx。未更换原有网页包；原网页与 6 个 JS/CSS 资源已验证 200。
- HTTPS 严格证书校验通过，证书有效至 2026-11-17 21:59:59 UTC；应在到期前续签。
- 本次无依赖变更，补丁镜像复用已上线 v1.0.3 的依赖层。依赖变动时必须改用完整 `Dockerfile.yizhuoji`，不能使用补丁路径。

## 数据保护与 migration

完整数据库备份：`/root/backups/yizhuoji/play-pre-20261020.sql.gz`

SHA-256：`8125417749a026094997da010eaba4c4847caa44de6417a3cb7d4529124c63fc`

上传目录备份：`/root/backups/yizhuoji/uploads-pre-20261020.tar.gz`

SHA-256：`3a427c6bb61b5050bcda4c20a48339ddbf09cfc590d2f2c939456c4f11f06178`

- gzip/tar 校验通过。数据库备份在服务器独立演练库恢复成功：21 张表、5 条 migration、余额不平衡 0；随后仅删除本次创建的演练库，原库未恢复、覆盖或清空。
- 部署前后全库行数据的规范化导出 SHA-256 完全一致：`68547fcecdf654c5d235b4ad103f035e22af4d7e199eaeb309990ac8ac976f22`。该检查反映本次部署时间窗口，不保证之后用户不会正常新增数据。
- 线上 15 张 v2 表、3 张旧账本业务表均存在；非法积分与不平衡房间均为 0。
- 从生产只导出 schema 到本机临时 MySQL，与 5 条 migration 新建库比对：137 列、67 条索引项、61 项约束全部一致；重复 migration 执行 0 条。没有把真实用户行数据下载到本机做接口测试。
- 本次不需要新增 migration，也没有对生产执行 migration。

## 修复及验证证据

1. 修复 TypeORM 忽略 `revokedAt:null` 条件导致旧 refresh token 仍可使用。刷新改为同一事务锁定 token、验证撤销/过期、生成替代并提交，5 个并发刷新只能成功 1 次。修复前回归脚本实际失败（期望 401、实际 200），修复后通过。
2. 重新加入的历史成员同样受 20 人容量限制；已加入的 active 成员不误拒绝。
3. 有写入的 smoke 脚本要求显式 `V2_SMOKE_ISOLATED=true` 且只能连接 localhost，避免误跑生产。

已通过：

- `npm run build:server`；旧 Vue `npm run build`（存在旧字体路径与大 chunk 警告，未改动原网页）。
- `npm run test:v2:wechat-code`：10 项通过。
- `npm run test:v2:regressions`：刷新重放、并发刷新、退出撤销、20 人满员重入拒绝。
- `npm run test:v2:smoke`：真实临时 MySQL 的创建、预览隐私、入房、邀请轮换、记账幂等、撤销留痕、整数余额、头像上传/读取、真实头像列表、反馈、注销阻断、关闭拒写及实时订阅。
- `npm run test:v2:compatibility`：操作结果归属隔离、越权拒绝、0/负数/小数/超限拒绝、99,999 正常记账、与我相关、结算、反向记录不可再次撤销、离开保留历史、注销申请；旧接口创建/加入/昵称/记账/记录/离开/统计/SSE/Socket.IO 全流程。
- `npm run verify:v2:schema`、`npm run verify:v2:data`：独立库结构及数据不变量。
- `npm run verify:v2:http`：线上只读探测，24 项鉴权拒绝、4 项不存在资源 404、2 项登录 DTO 验证、健康检查、旧接口、6 个网页资源、Socket.IO、WSS 无效票据 4001；未向生产写入测试数据。
- 本地编译与运行中容器的 `auth.js`、`ledger.service.js` SHA-256 一致。

## 如何复测

只读生产检查：

```bash
npm ci
npm run build:server
npm run test:v2:wechat-code
npm run verify:v2:http
```

写入测试必须另建本机测试库：导入仅 schema 的生产导出（包括旧表），或者应用 v2 migration 后补齐仅用于兼容测试的旧表。服务端设置独立 `DB_DATABASE`、`DB_*` 凭证、`V2_AUTH_MOCK=true`、`NODE_ENV=test`、`DB_SYNCHRONIZE_LEGACY=false`、`DB_MIGRATIONS_RUN=false`、独立上传目录，以及测试用 `V2_TOKEN_SECRET` 和 `WECHAT_IDENTITY_PEPPER`。没有 Redis 的本机可显式启用 `V2_REALTIME_MEMORY_FALLBACK=true`。

```bash
# 独立服务假设启动在 6022；绝对不能指向真实数据。
export V2_SMOKE_ISOLATED=true
export V2_SMOKE_BASE_URL=http://127.0.0.1:6022/api/v2
npm run test:v2:regressions
npm run test:v2:smoke
npm run test:v2:compatibility
# schema 等价检查额外要求 DB_DATABASE 名称为 play_verify_*，且已导入待比对 schema。
npm run verify:v2:schema
npm run verify:v2:data
```

## 外部限制，不能标为通过

- 用不对应真实房间的合成 scene 调微信官方服务，`trial` 成功生成 109,816 字节图片；`release` 返回 41030（页面路径检查未通过），API 按设计返回 503，绝不把错误 JSON 当图片。
- 在微信公众平台发布包含 `pages/preview/index` 的正式小程序版本后，重新通过真实正式版邀请页生成码并扫码。体验版客户端已按自身 `envVersion=trial` 请求，不需要把线上默认环境改成体验版。
- 真机微信登录、头像授权、跨账号加入及扫码体验仍需体验成员验证；接口的 mock 登录和自动测试不能代替微信真实身份凭证。

## 应用回滚

停止当前容器、保留失败容器、将 `play-backend-pre-v1.0.4-20261020` 改名为 `play-backend` 并启动。完整命令见运行手册。不要回滚数据库，不要删除上传目录。保留的旧版本只用于紧急回滚，旧刷新凭证漏洞会随应用回退重新存在，应尽快向前修复。
