# 一桌记 API v2 运行手册

## 变更边界

v2 仅使用 14 张 `*_v2` 表，不重命名、不覆盖旧 `rooms`、`room_users`、`expense_records`；旧 `/api/room/*` 仍保留。生产同步建表已关闭，schema 只由 migration 管理。

## 必需环境变量

以 `.env.example` 为模板。`V2_TOKEN_SECRET`、`WECHAT_IDENTITY_PEPPER`、`V2_JOIN_CODE_PEPPER` 必须分别使用随机高熵值，`V2_JOIN_CODE_ENCRYPTION_KEY` 必须是 base64 编码的 32 字节随机密钥。生产必须设置微信 AppID/AppSecret、Redis、反馈图片持久化目录，并保持 `V2_AUTH_MOCK=false`、`V2_REALTIME_MEMORY_FALLBACK=false`、`DB_SYNCHRONIZE_LEGACY=false`。

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
V2_SMOKE_BASE_URL=http://127.0.0.1:6020/api/v2 npm run test:v2:smoke
```

smoke 会创建两名测试用户与一个已关闭测试房间，验证 DTO 白名单、加入前隐私、邀请轮换与幂等、事务记账、幂等重放、反向撤销、余额守恒、反馈图片/记录、注销阻断、WSS ticket 和关闭拒写。另运行 `npm run verify:v2:data` 只读核验表隔离和全库余额约束。

开发环境在未安装 Redis 时可显式设置 `V2_REALTIME_MEMORY_FALLBACK=true` 做单实例联调；生产禁止使用该选项，WSS ticket、发布订阅与 outbox 必须落到 Redis。反馈图片默认写入 `V2_FEEDBACK_UPLOAD_DIR`，生产需挂载持久卷并纳入备份策略。

## 发布与回滚

先备份 MySQL 和反馈图片目录并恢复演练，再执行 migration；灰度顺序为内部体验 → 新房间白名单 → 旧房间认领 → 全量。应用保留上一稳定镜像；API 异常时停止 v2 写入并回退应用，不能用旧快照覆盖已经产生的新账目。`FeedbackFiles2026091200030` 已有关联反馈后不可单独回滚，需用向前修复 migration。
