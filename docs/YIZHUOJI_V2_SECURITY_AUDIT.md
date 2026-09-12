# 一桌记 v2 安全审计记录

审计日期：2026-09-12。审计范围为 `/api/v2`、其 MySQL/Redis 集成及小程序生产依赖。

## 已落实的控制

- v2 数据全部落入 14 张带 `_v2` 后缀的新表，未复用或改写旧网页表。
- 付款成员、操作者与房间权限均由 access token 对应用户及服务端 membership 推导。
- 积分 DTO 和事务层双重约束为 1～99,999 正整数；一笔流水在同一事务内一减一加。
- 记账、撤销、建房、加入、离开、关闭、重置邀请和注销请求使用 UUID 幂等键。
- 撤销只创建反向流水，保留原流水；反向流水不可再次撤销。
- 房间关闭后所有业务写操作永久拒绝；离开成员仍保留历史数据。
- 加入码仅存带 pepper 的摘要及 AES-256-GCM 密文；邀请 token 仅存 SHA-256 摘要。
- 分享内容只包含公开摘要和短期 scene，不包含账目、余额、加入码、token 或内部 ID。
- 反馈图片校验 MIME、文件签名和 5 MB 上限，数据库仅保存受控磁盘路径与元数据。
- DTO 全局启用 whitelist、禁止未知字段和类型转换；认证票据采用 HMAC 并设置有效期。
- Redis 用于跨实例版本广播；生产环境禁止退回进程内广播。

## 依赖审计结果

执行 `npm audit --omit=dev` 后：

- 原代码仓库生产依赖：low 3、moderate 6、high 14、critical 0。
- 小程序生产依赖：low 0、moderate 18、high 8、critical 0。

已在不引入破坏性主版本升级的范围内更新 Axios、mysql2、Swiper、TypeORM 及锁文件，并重新通过网页构建、服务端构建和小程序构建。

剩余项主要来自 NestJS 9 / Express 的旧主版本依赖链，以及 DCloud 4.76 构建工具链的传递依赖。`npm audit fix --force` 会跨越 NestJS 等主版本，不能作为补丁发布直接执行。下一条可执行动作是在独立升级分支完成 NestJS 12 与新版 DCloud 编译器迁移，逐接口跑 `test:v2:smoke`、旧网页回归和微信真机回归后再合并。发布门禁禁止出现 critical 漏洞。

## 密钥与日志要求

- `V2_TOKEN_SECRET`、`V2_REFRESH_SECRET`、`V2_JOIN_CODE_PEPPER`、`V2_JOIN_CODE_ENCRYPTION_KEY` 必须由密钥管理服务注入且彼此不同。
- `WECHAT_APP_SECRET` 仅存在服务端；不得写入小程序、日志或镜像层。
- 禁止记录 access/refresh token、微信 code、加入码、邀请 token、密钥和完整请求头。
- 上传目录不应由静态服务器直接列目录；备份与清理任务按 `feedback_files_v2` 引用执行。

