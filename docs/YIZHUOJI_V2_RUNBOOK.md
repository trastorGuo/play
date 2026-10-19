# 一桌记 API v2 运行手册

## 当前线上：v1.0.4（2026-10-20）

已部署 `yizhuoji-backend:v1.0.4` 到 `play-backend`，部署目录 `/opt/yizhuoji-v1.0.4/`。本次修复刷新凭证重放/并发轮换及离开成员重新加入绕过人数上限。没有执行生产 DDL 或数据修复；自动 schema 同步和启动 migration 均关闭。具体测试、备份校验值、数据一致性及未通过的外部门禁见 [部署验收记录](DEPLOYMENT_2026-10-20.md)。

回滚只切应用，禁止将备份覆盖回有新增账目的生产库：

```bash
docker stop play-backend
docker rename play-backend play-backend-failed-v1.0.4
docker rename play-backend-pre-v1.0.4-20261020 play-backend
docker start play-backend
curl -f https://www.6rem.com/api/v2/health
```

## 历史版本：v1.0.3（2026-09-17）

- 已将 `play-backend` 从 `yizhuoji-backend:v1.0.1` 切换到 `yizhuoji-backend:v1.0.3`，镜像 ID `sha256:3c24aa699b2f47733ad138ae0958645634ce05184e27dcde77c58a4f06480cee`。源码位于本仓库 `server/v2/`，服务器部署目录 `/opt/yizhuoji-v1.0.3/`；包含此前暂存的房号入房、真实头像以及本次小程序码修复。
- `GET /api/v2/share-codes/:scene.png?envVersion=trial|develop|release` 校验版本、邀请有效期与房间状态。体验/开发码不检查已发布页面，正式码检查；旧客户端不传版本时读取 `WECHAT_CODE_ENV_VERSION`，默认 `release`。PNG/JPEG 均验证签名，响应 MIME 按实际格式设置；微信错误 JSON 返回 503，记录中只保留版本和数值错误码。
- 生产 AppID 保持 `wx66bc3be527b94972`，API 为 `https://www.6rem.com/api/v2`，`V2_AUTH_MOCK=false`、`DB_SYNCHRONIZE_LEGACY=false`、`DB_MIGRATIONS_RUN=false`。本次无 schema 修改，没有执行生产 migration。
- 数据备份 `/root/backups/yizhuoji/play-pre-v1.0.3-20260917.sql.gz`，SHA-256 `800fc46146107ad2983d6f5d371107e343bf48a9a0e45add3eb11b2df8555811`；上传文件备份 `/root/backups/yizhuoji/uploads-pre-v1.0.3-20260917.tar.gz`，SHA-256 `3a427c6bb61b5050bcda4c20a48339ddbf09cfc590d2f2c939456c4f11f06178`。已在独立临时库恢复 21 张表并核验积分守恒；临时恢复库和后续独立 smoke 库/容器均已清理。
- 本地与镜像内 10 项码服务测试通过；专用测试库从 migration 建表后，扩展 smoke 验证两人入房、纯房号预览/加入、头像、邀请轮换、记账幂等、反向撤销、关闭只读及 WebSocket。上线后新/旧 HTTP 接口正常；公网 WSS 为 101，无效票据关闭码 4001；15 张 v2 表余额不平衡房间数为 0，非法积分数为 0。
- 合成 scene（不对应任何真实房间）的微信生成测试：`trial` 成功返回约 107 KB JPEG；`release` 当时返回 `41030`，说明发布路径尚不可用。配套小程序 1.0.8 会自动发送自身版本，正式发布后无需切换全局版本配置。真实生产邀请的外发诊断被自动审批拒绝，未用真实邀请做扫码验收，需体验成员真机完成。
- 小程序 1.0.8 产物在 `/Users/trastor/WeChatProjects/yizhuoji/dist/build/mp-weixin/`，需重新上传并设为体验版；后端上线不会更新已上传的小程序包。

本次应用回滚（仅容器，保留上线后数据）：

```bash
ssh root@81.68.255.143
docker stop play-backend
docker rename play-backend play-backend-failed-v1.0.3
docker rename play-backend-pre-v1.0.3-20260917 play-backend
docker start play-backend
curl -f https://www.6rem.com/api/v2/health
```

复现码服务测试：`npm run build:server && npm run test:v2:wechat-code`；完整 smoke 只能连接专用测试数据库，不可对生产库创建测试房间。

## 变更边界

v2 仅使用 15 张 `*_v2` 表，不重命名、不覆盖旧 `rooms`、`room_users`、`expense_records`；旧 `/api/room/*` 仍保留。生产同步建表已关闭，schema 只由 migration 管理。

## 必需环境变量

以 `.env.example` 为模板。`V2_TOKEN_SECRET`、`WECHAT_IDENTITY_PEPPER` 必须分别使用随机高熵值。加入码已废止；现有 `V2_JOIN_CODE_PEPPER` 与 `V2_JOIN_CODE_ENCRYPTION_KEY` 仅为历史版本回滚保留，新代码不再读取。生产必须设置微信 AppID/AppSecret、Redis、反馈图片持久化目录，并保持 `V2_AUTH_MOCK=false`、`V2_REALTIME_MEMORY_FALLBACK=false`、`DB_SYNCHRONIZE_LEGACY=false`。

## migration

```bash
cd /Users/trastor/code/play
npx typeorm-ts-node-commonjs migration:show -d server/data-source.ts
npx typeorm-ts-node-commonjs migration:run -d server/data-source.ts
```

回滚只允许在确认 v2 没有业务写入时执行：

```bash
npx typeorm-ts-node-commonjs migration:revert -d server/data-source.ts
```

已有新账目时禁止回滚表；应先把 v2 置为只读，修复后用补偿流水恢复。

## 构建与运行

```bash
npm run build:server
npm run server
```

本地 smoke 需使用专用测试库/隔离 v2 表并启动服务后执行：

```bash
V2_SMOKE_ISOLATED=true V2_SMOKE_BASE_URL=http://127.0.0.1:6020/api/v2 npm run test:v2:smoke
```

smoke 会创建两名测试用户与一个已关闭测试房间，验证 DTO 白名单、加入前隐私、邀请轮换与幂等、事务记账、幂等重放、反向撤销、余额守恒、反馈图片/记录、注销阻断、WSS ticket 和关闭拒写。另运行 `npm run verify:v2:data` 只读核验表隔离和全库余额约束。

开发环境在未安装 Redis 时可显式设置 `V2_REALTIME_MEMORY_FALLBACK=true` 做单实例联调；生产禁止使用该选项，WSS ticket、发布订阅与 outbox 必须落到 Redis。反馈图片默认写入 `V2_FEEDBACK_UPLOAD_DIR`，生产需挂载持久卷并纳入备份策略。

## 发布与回滚

2026-09-14 入房规则：公开预览和申请加入仅需六位房间号；若请求带短期 `scene`/邀请 token，则仍核验其有效期和撤销状态。重置邀请仅撤销旧链接和小程序码，不能阻止知道房号的人手动加入；旧 `join_code_*` 列保留以支持应用回滚，新房间只写不可用的随机摘要，不生成可用加入码。无 schema 迁移。旧版客户端可能仍传 `joinCode`，DTO 暂时接受并忽略，待体验版更新后可移除兼容字段。

先备份 MySQL 和反馈图片目录并恢复演练，再执行 migration；灰度顺序为内部体验 → 新房间白名单 → 旧房间认领 → 全量。应用保留上一稳定镜像；API 异常时停止 v2 写入并回退应用，不能用旧快照覆盖已经产生的新账目。`FeedbackFiles2026091200030` 已有关联反馈后不可单独回滚，需用向前修复 migration。

## 81.68.255.143 同仓部署记录（2026-09-13）

2026-09-14 最新后端候选：本地提交 `bdac090`（仅房号入房）与 `605dfd4`（最近房间真实头像）已编译，同步到服务器 `/opt/yizhuoji-v1.0.2/server/`；关键 JS 文件 SHA-256 与本地一致。已构建 `yizhuoji-backend:v1.0.2`，镜像 ID `sha256:724dac9d1fed79e8e4b60ed3bc04589f7dbb7819ebf087306f540684b7c37966`，断网临时容器入口语法检查通过。当前运行中的 `play-backend` **仍是 v1.0.1**；v2 健康接口返回 200。服务器环境文件已确认 AppSecret 非空（未读取或记录值）。新生产库备份尚未获执行许可，因此未切换容器、未运行会写入生产库的 smoke，不能声称线上已有 v1.0.2 的新功能。

- 单一 NestJS 镜像 `yizhuoji-backend:v1.0.1` 同时提供旧 `/api/room/*` 和新 `/api/v2/*`；仍由 `vueApp` 的 Nginx 将 `/api/` 代理到主机 6015 端口。`/socket.io/` 原配置保留，另加 `/ws` WebSocket 代理。
- MySQL 的 `play` 库保留旧表与新 `*_v2` 表；新服务使用 `DB_SYNCHRONIZE_LEGACY=false`、`DB_MIGRATIONS_RUN=false`。切换前备份：`/root/backups/yizhuoji/play-pre-v1.0.1-20260913.sql.gz`，SHA-256 `d86c673fc489412bd6718ca9c80c5cd6c03a85b91a9bf76de675dd95e5e61ee0`。此备份仅供灾难恢复，**不能覆盖上线后写入的新账目**。
- 容器 `play-backend` 使用私有网络 `yizhuoji-internal`，网络中的 `mysql`、`yizhuoji-redis` 提供数据库与 Redis；Redis 不映射公网端口。图片持久化到 `/opt/yizhuoji-v1.0.1/storage/`。
- 生产配置在服务器 `/opt/yizhuoji-v1.0.1/backend.env`（权限 600），不纳入 Git。2026-09-13 已将 AppID 更新为 `wx66bc3be527b94972`，重新创建容器后进程内值已核对；2026-09-14 只读检查确认 `WECHAT_APP_SECRET` 非空，未输出密钥。更新 `--env-file` 后必须保留旧容器并以相同参数重新创建 `play-backend`，单纯 `docker restart` 不会重新读取环境文件。HTTPS 证书已更新至 2026-11-17，并通过严格 TLS 验证。
- 切换后验证：本机和 HTTPS `/api/v2/health` 均为 200，旧 `/api/room/admin/rooms` 为 200，`/ws` 能完成 101 握手；MySQL `rooms_v2` 只读查询、Redis `PING` 成功。临时验证容器 `yizhuoji-backend-staging` 已停止。

重新构建时，在此仓库先运行 `npm ci && npm run build:server`，再执行 `docker build -f Dockerfile.yizhuoji -t yizhuoji-backend:<新版本> .`。生产环境更新应用镜像之前，必须先备份数据库及上传目录、核对 migration，并在独立本机端口验证。不要在生产库执行会创建测试房间的 smoke 脚本。

仅应用回滚（不要回滚含新账目的数据库）：

```bash
ssh root@81.68.255.143
docker stop play-backend
docker rename play-backend play-backend-failed-v1.0.1
docker rename play-backend-pre-v1.0.1 play-backend
docker start play-backend
curl -k -f https://www.6rem.com/api/room/admin/rooms
```

旧镜像另有 `play-backend:pre-yizhuoji-v1.0.1` 标签。若需恢复 Nginx 的原配置，将 `/opt/yizhuoji-v1.0.1/nginx-default.conf` 复制回 `vueApp:/etc/nginx/conf.d/default.conf`，运行 `docker exec vueApp nginx -t` 后 `docker exec vueApp nginx -s reload`。变更前后的 Nginx 配置均在 `/opt/yizhuoji-v1.0.1/`，新配置还保存在镜像 `vuenginxcontainer:yizhuoji-v1.0.1`。回滚应用后小程序 v2 会暂不可用，应先暂停小程序发布，而旧网页仍可运行。
