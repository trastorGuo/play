# 🚀 部署指南

本项目包含完整的自动化部署配置，支持本地测试和远程服务器部署。

## 📋 快速开始

### 1. 配置部署信息

项目已经为您创建了本地开发的部署配置文件 `deploy.config.js`：

```javascript
// 当前配置（本地开发）
{
  host: 'localhost',          // 服务器地址
  username: 'trastor',        // SSH用户名
  remotePath: '/tmp/play-deploy', // 部署路径
  // ... 其他配置
}
```

### 2. 生产环境配置

如需部署到远程服务器，请修改 `deploy.config.js`：

```javascript
module.exports = {
  host: 'your_server_ip',     // 改为实际服务器IP
  username: 'your_username', // 改为实际用户名
  remotePath: '/var/www/play', // 改为实际部署路径
  // ... 其他配置
};
```

## 🛠️ 可用的部署命令

### 前端部署
```bash
npm run deploy:frontend
```
- 自动构建前端项目 (`npm run build`)
- 将构建文件部署到指定位置
- 支持本地测试和远程部署

### 后端部署
```bash
npm run deploy:backend
```
- 自动构建后端项目 (`npm run build:server`)
- 部署编译后的服务器代码
- 自动安装生产依赖
- 支持远程服务重启

### 完整部署
```bash
npm run deploy:full
```
- 同时部署前端和后端
- 一键完成整个项目的部署
- 显示部署完成后的访问地址

## 📁 部署目录结构

### 本地测试模式
```
/tmp/play-deploy/           # 前端文件
/var/app/play-server/       # 后端文件
```

### 生产环境模式
```
/var/www/play/              # 前端文件
/var/app/play-server/       # 后端文件
```

## 🔧 部署配置详解

### 基本配置
- `host`: 目标服务器地址
- `username`: SSH连接用户名
- `remotePath`: 部署根目录
- `port`: SSH端口（默认22）

### 前端配置
- `buildCommand`: 构建命令
- `localPath`: 本地构建文件路径
- `remotePath`: 远程部署路径

### 后端配置
- `buildCommand`: 构建命令
- `localPath`: 本地服务器代码路径
- `remotePath`: 远程部署路径
- `startCommand`: 服务启动/重启命令

### 排除文件
自动排除以下文件和目录：
- `node_modules/**`
- `.git/**`
- `.env*`
- `*.log`
- `deploy.config.js`

## 🎯 本地测试部署

当前配置已设置为本地测试模式，您可以直接运行：

```bash
# 测试前端部署
npm run deploy:frontend

# 测试后端部署  
npm run deploy:backend

# 测试完整部署
npm run deploy:full
```

部署完成后：
- 🌐 前端访问: http://localhost:8080
- 🔧 后端API: http://localhost:6015

## 🔒 安全注意事项

1. **配置文件安全**: `deploy.config.js` 已添加到 `.gitignore`，不会被提交到代码库
2. **环境变量**: 敏感信息请使用环境变量
3. **SSH密钥**: 推荐使用SSH密钥认证而非密码

## 🆘 故障排除

### 常见问题

1. **"deploy.config.js 文件不存在"**
   - 确保已创建配置文件
   - 检查文件路径是否正确

2. **"rsync 命令不存在"**
   - macOS: 已内置
   - Linux: `sudo apt install rsync` 或 `sudo yum install rsync`
   - Windows: 推荐使用 WSL

3. **SSH连接失败**
   - 检查服务器地址和用户名
   - 确保SSH密钥配置正确
   - 检查防火墙设置

4. **权限错误**
   - 确保目标目录有写入权限
   - 检查SSH用户的权限

### 调试模式

如需调试部署过程，可以直接运行脚本：

```bash
# 直接运行脚本查看详细输出
node scripts/deploy-frontend.js
node scripts/deploy-backend.js  
node scripts/deploy-full.js
```

## 📞 支持

如遇到问题，请检查：
1. 配置文件格式是否正确
2. 网络连接是否正常
3. 服务器权限是否足够
4. 依赖是否安装完整 