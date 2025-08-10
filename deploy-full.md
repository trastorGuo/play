# 完整项目部署指南

⚠️ **安全提醒**: 本文档已移除敏感信息。服务器配置现在从 `deploy.config.js` 读取。

## 🚀 自动化部署（推荐）

现在项目已配置完整的自动化部署，强烈推荐使用：

```bash
# 开发环境部署
npm run deploy:full

# 生产环境部署  
NODE_ENV=production npm run deploy:full
```

## 📋 手动部署流程

如需手动部署，请按以下步骤操作：

### 1. 本地准备
```bash
# 构建前端
npm run build

# 构建后端  
npm run build:server
```

### 2. 打包上传
```bash
# 创建临时目录并复制必要文件
rm -rf temp_deploy && mkdir temp_deploy
cp -r dist nginx Dockerfile Dockerfile.node package.json package-lock.json temp_deploy/

# 打包压缩并上传
tar -czf deploy.tar.gz -C temp_deploy .
scp deploy.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/root/

# 清理本地临时文件
rm -rf temp_deploy deploy.tar.gz
```

### 3. 服务器端首次部署
```bash
# 连接服务器
ssh ${DEPLOY_USER}@${DEPLOY_HOST}

# 清理旧项目并创建新目录
rm -rf /root/play && mkdir -p /root/play && cd /root/play

# 解压项目文件
tar -xzf /root/deploy.tar.gz -C /root/play

# 安装依赖
npm install --production

# 构建并启动 Docker 容器
docker-compose up -d --build

# 查看容器状态
docker-compose ps
docker-compose logs
```

## 🔄 更新部署

### 使用自动化脚本（推荐）
```bash
NODE_ENV=production npm run deploy:full
```

### 手动更新步骤
```bash
# 1. 本地打包
npm run build && npm run build:server
rm -rf temp_deploy && mkdir temp_deploy
cp -r dist nginx Dockerfile Dockerfile.node package.json package-lock.json temp_deploy/
tar -czf deploy.tar.gz -C temp_deploy .
scp deploy.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/root/
rm -rf temp_deploy deploy.tar.gz

# 2. 服务器更新
ssh ${DEPLOY_USER}@${DEPLOY_HOST}
cd /root/play
tar -xzf /root/deploy.tar.gz -C /root/play
docker-compose down
docker-compose up -d --build
```

## 🐳 Docker 配置说明

### docker-compose.yml
```yaml
version: '3.8'
services:
  nginx:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile.node
    ports:
      - "6015:6015"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 📁 部署目录结构

```
/root/play/                 # 项目根目录
├── dist/                   # 前端构建文件
├── nginx/                  # Nginx 配置
├── server/                 # 后端构建文件
├── Dockerfile              # 前端容器配置
├── Dockerfile.node         # 后端容器配置
├── docker-compose.yml      # 容器编排配置
└── package.json           # 项目依赖
```

## 🔧 容器管理命令

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs
docker-compose logs -f backend  # 实时查看后端日志

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 完全重建
docker-compose down
docker-compose up -d --build

# 进入容器调试
docker-compose exec backend sh
docker-compose exec nginx sh
```

## 🔍 故障排查

### 常见问题

1. **容器启动失败**
```bash
docker-compose logs
```

2. **端口冲突**
```bash
netstat -tlnp | grep :80
netstat -tlnp | grep :6015
```

3. **重建镜像**
```bash
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### 健康检查

```bash
# 检查前端访问
curl -I http://${DEPLOY_HOST}

# 检查后端API  
curl http://${DEPLOY_HOST}:6015/health

# 检查WebSocket
curl -I http://${DEPLOY_HOST}:6015/socket.io/
```

## 📊 性能监控

```bash
# 查看容器资源使用
docker stats

# 查看系统资源
htop
df -h
free -h

# Nginx 访问日志
docker-compose logs nginx | tail -100
```

## 🔒 安全配置

### SSL/TLS 配置（可选）
如需启用 HTTPS，请更新 nginx 配置并获取 SSL 证书。

### 防火墙配置
```bash
# 开放必要端口
ufw allow 80
ufw allow 6015
ufw enable
```

## 🌐 服务访问

部署完成后，您可以通过以下地址访问服务：

- **前端访问**: http://${DEPLOY_HOST}
- **后端 API**: http://${DEPLOY_HOST}:6015
- **WebSocket**: ws://${DEPLOY_HOST}:6015/socket.io/

> 📝 注意：实际地址请查看 `deploy.config.js` 中的配置

## 📞 技术支持

如遇到部署问题，请检查：
1. 服务器网络连接
2. Docker 服务状态
3. 端口占用情况
4. 配置文件格式
5. 环境变量设置 