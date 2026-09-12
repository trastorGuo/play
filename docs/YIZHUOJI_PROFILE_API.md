# 打牌记账啦个人资料 API 补充

以下接口统一位于 `/api/v2`，JSON 响应继续使用标准信封，写请求必须携带 UUID 格式的 `Idempotency-Key`。

- `POST /files/profile-avatars`：Bearer 鉴权，`multipart/form-data` 字段名 `file`；接受不超过 2 MB 的 JPG、PNG、WebP，返回 `{ fileId, avatarUrl }`。
- `PATCH /me`：Bearer 鉴权，请求体 `{ displayName: string, avatarFileId?: uuid }`；昵称 1～20 个字，头像必须归属当前用户。
- `GET /profile-avatars/{fileId}`：不可枚举 UUID 公开读取，响应为图片内容并启用 immutable 缓存；不会暴露反馈截图。
- `GET /me` 与登录响应中的 `user` 新增可空字段 `avatarUrl`；房间快照成员新增可空字段 `avatarUrl`。

数据库变更由 `202609130001-UserProfiles` migration 管理，新增 `profile_avatars_v2`，并向 `users_v2` 添加 `avatar_file_id` 外键。该表与旧站数据表完全隔离。
