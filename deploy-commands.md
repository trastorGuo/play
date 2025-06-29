# Node.js 服务部署命令

## 首次部署（服务器新建命令）

### 1. 本地准备
```bash
# 确保项目已构建
pnpm run build
pnpm run build:server
```

### 2. 上传项目到服务器
```bash
scp -r /Users/trastor/code/play root@81.68.255.143:/root/
```

### 3. 服务器端首次部署
```bash
# 连接服务器
ssh root@81.68.255.143

# 进入项目目录
cd /root/play

# 构建 Node.js 服务镜像
docker build -f Dockerfile.node -t play-backend .

# 启动 Node.js 服务容器
docker run -d \
  --name play-backend \
  -p 6015:6015 \
  --restart unless-stopped \
  play-backend

# 查看服务状态
docker ps
docker logs play-backend
```

## 后续部署命令

### 方式一：使用 pnpm 脚本（推荐）
```bash
# 一键部署
pnpm run deploy:node
```

### 方式二：手动步骤
```bash
# 1. 上传项目
scp -r /Users/trastor/code/play root@81.68.255.143:/root/

# 2. 服务器操作
ssh root@81.68.255.143
cd /root/play

# 3. 停止并删除旧容器
docker stop play-backend 2>/dev/null || true
docker rm play-backend 2>/dev/null || true

# 4. 重新构建镜像
docker build -f Dockerfile.node -t play-backend .

# 5. 启动新容器
docker run -d \
  --name play-backend \
  -p 6015:6015 \
  --restart unless-stopped \
  play-backend
```

## 常用管理命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs play-backend
docker logs -f play-backend  # 实时查看日志

# 重启容器
docker restart play-backend

# 停止容器
docker stop play-backend

# 删除容器
docker rm play-backend

# 查看容器资源使用情况
docker stats play-backend

# 进入容器调试
docker exec -it play-backend sh
```

## 故障排查

```bash
# 如果容器启动失败，查看详细日志
docker logs play-backend

# 检查端口是否被占用
netstat -tlnp | grep 6015

# 重新构建镜像（清除缓存）
docker build --no-cache -f Dockerfile.node -t play-backend .

# 清理无用的镜像
docker image prune
``` 