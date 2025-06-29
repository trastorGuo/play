# 前后端一体化部署命令

## 首次部署（服务器新建命令）

### 1. 本地准备和构建
```bash
# 构建前端
npm run build

# 构建后端
npm run build:server
```

### 2. 上传项目到服务器（优化版本，只上传必要文件）
```bash
# 创建临时目录并复制必要文件
rm -rf temp_deploy && mkdir temp_deploy
cp -r dist nginx Dockerfile Dockerfile.node package.json package-lock.json temp_deploy/

# 打包压缩并上传
tar -czf deploy.tar.gz -C temp_deploy .
scp deploy.tar.gz root@81.68.255.143:/root/

# 清理本地临时文件
rm -rf temp_deploy deploy.tar.gz
```

### 3. 服务器端首次部署
```bash
# 连接服务器
ssh root@81.68.255.143

# 清理旧项目并创建新目录
rm -rf /root/play && mkdir -p /root/play && cd /root/play

# 解压项目文件
tar -xzf ../deploy.tar.gz && rm ../deploy.tar.gz

# 部署前端（Vue + Nginx）
docker stop vueApp 2>/dev/null || true
docker rm vueApp 2>/dev/null || true
docker build -t vuenginxcontainer .
docker run -d --name vueApp -p 80:80 --restart unless-stopped vuenginxcontainer

# 部署后端（Node.js）
docker stop play-backend 2>/dev/null || true
docker rm play-backend 2>/dev/null || true
docker build -f Dockerfile.node -t play-backend .
docker run -d --name play-backend -p 6015:6015 --restart unless-stopped play-backend

# 查看服务状态
docker ps
echo "前端日志："
docker logs vueApp
echo "后端日志："
docker logs play-backend
```

## 后续部署命令

### 方式一：使用 npm 脚本（推荐）
```bash
# 一键部署前后端
npm run deploy:full
```

### 方式二：手动步骤
```bash
# 1. 本地构建
npm run build
npm run build:server

# 2. 上传项目（优化版本，只上传必要文件）
rm -rf temp_deploy && mkdir temp_deploy
cp -r dist nginx Dockerfile Dockerfile.node package.json package-lock.json temp_deploy/
tar -czf deploy.tar.gz -C temp_deploy .
scp deploy.tar.gz root@81.68.255.143:/root/
rm -rf temp_deploy deploy.tar.gz

# 3. 服务器操作
ssh root@81.68.255.143
rm -rf /root/play && mkdir -p /root/play && cd /root/play
tar -xzf ../deploy.tar.gz && rm ../deploy.tar.gz

# 4. 重新部署前端
docker stop vueApp 2>/dev/null || true
docker rm vueApp 2>/dev/null || true
docker build -t vuenginxcontainer .
docker run -d --name vueApp -p 80:80 --restart unless-stopped vuenginxcontainer

# 5. 重新部署后端
docker stop play-backend 2>/dev/null || true
docker rm play-backend 2>/dev/null || true
docker build -f Dockerfile.node -t play-backend .
docker run -d --name play-backend -p 6015:6015 --restart unless-stopped play-backend

# 6. 检查服务状态
docker ps
```

## 单独部署命令

### 只部署前端
```bash
npm run deploy
```

### 只部署后端
```bash
npm run deploy:node
```

## 常用管理命令

```bash
# 查看所有容器状态
docker ps

# 查看前端日志
docker logs vueApp
docker logs -f vueApp  # 实时查看

# 查看后端日志
docker logs play-backend
docker logs -f play-backend  # 实时查看

# 重启前端服务
docker restart vueApp

# 重启后端服务
docker restart play-backend

# 重启所有服务
docker restart vueApp play-backend

# 停止所有服务
docker stop vueApp play-backend

# 查看资源使用情况
docker stats

# 清理无用镜像
docker image prune
```

## 故障排查

```bash
# 检查端口占用
netstat -tlnp | grep 80    # 前端端口
netstat -tlnp | grep 6015  # 后端端口

# 查看详细错误日志
docker logs vueApp
docker logs play-backend

# 重新构建镜像（清除缓存）
docker build --no-cache -t vuenginxcontainer .
docker build --no-cache -f Dockerfile.node -t play-backend .

# 进入容器调试
docker exec -it vueApp sh
docker exec -it play-backend sh

# 检查网络连接
docker network ls
docker inspect bridge
```

## 服务访问地址

- **前端访问**: http://81.68.255.143
- **后端 API**: http://81.68.255.143:6015
- **WebSocket**: ws://81.68.255.143:6015/socket.io/ 