# 一桌记 v2 接口增补说明

本文件补充交付包 `docs/04-api.openapi.yaml` 在落地阶段新增的微信平台和实时能力。所有 JSON 接口沿用 `{ success, requestId, data }` / `{ success, requestId, error }` 信封和 Bearer access token。

| 方法 | 路径 | 鉴权 | 用途 |
|---|---|---|---|
| GET | `/api/v2/invites/scene/:scene` | 否 | 解析小程序码 scene，仅返回加入前公开摘要 |
| GET | `/api/v2/share-codes/:scene.png` | 否 | 返回微信 `getwxacodeunlimit` 生成的 PNG；scene 无效时 404 |
| POST | `/api/v2/realtime/ticket` | 是 | 签发 60 秒、单用户绑定的 WebSocket 握手票据 |
| GET upgrade | `/ws?ticket=...` | 票据 | 原生 WSS；客户端订阅房号后只接收 `{ type:'room.version.changed', roomCode, version }` |

`scene`、分享卡片和 PNG 均不得返回余额、流水、加入码、邀请 token 或数据库 ID。收到版本跳跃、断线重连、切网或小程序 `onShow` 时，客户端必须重新请求房间快照，不以 WebSocket 消息计算余额。

