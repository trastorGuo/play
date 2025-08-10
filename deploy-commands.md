# 项目部署命令指南

⚠️ **安全提醒**: 本文档已移除敏感信息。服务器IP、用户名等信息现在从 `deploy.config.js` 读取。

## 环境配置

请先配置部署环境：
```bash
# 开发环境（默认）
npm run deploy:frontend

# 生产环境
NODE_ENV=production npm run deploy:frontend
```

## 快速部署

### 1. 构建项目
```bash
npm run build
npm run build:server
```

### 2. 上传项目到服务器
```bash
# 使用自动化部署脚本（推荐）
npm run deploy:full

# 或手动上传（需要先配置 deploy.config.js）
scp -r /Users/trastor/code/play ${DEPLOY_USER}@${DEPLOY_HOST}:/root/
```

### 3. 服务器端首次部署
```bash
# 连接服务器
ssh ${DEPLOY_USER}@${DEPLOY_HOST}

# 进入项目目录
cd /root/play

# 构建 Node.js 服务镜像
docker build -f Dockerfile.node -t play-node .

# 构建 Nginx 镜像  
docker build -f Dockerfile -t play-nginx .

# 启动容器
docker-compose up -d
```

## 环境变量说明

请在 `deploy.config.js` 中配置以下信息：
- `DEPLOY_HOST`: 服务器IP地址
- `DEPLOY_USER`: SSH用户名
- `DEPLOY_PATH`: 部署路径

## 相关文档

详细部署说明请查看：
- `DEPLOY.md` - 完整部署指南
- `deploy.config.js` - 部署配置文件
- `scripts/` - 自动化部署脚本

## 安全提醒

- 🔒 敏感信息已从文档中移除
- 🔒 请勿将 `deploy.config.js` 提交到公共仓库  
- 🔒 建议使用 SSH 密钥而非密码认证 