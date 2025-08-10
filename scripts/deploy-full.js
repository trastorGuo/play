#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// 读取部署配置（优先使用本地配置）
let deployConfig;
try {
  // 优先尝试读取本地配置文件
  try {
    deployConfig = require('../deploy.config.local.js');
    console.log('✅ 读取本地部署配置成功 (deploy.config.local.js)');
  } catch (localError) {
    // 如果本地配置不存在，使用默认配置
    deployConfig = require('../deploy.config.js');
    console.log('✅ 读取默认部署配置成功 (deploy.config.js)');
  }
} catch (error) {
  console.error('❌ 无法读取部署配置文件');
  console.error('请确保 deploy.config.js 或 deploy.config.local.js 文件存在并配置正确');
  process.exit(1);
}

async function deployFull() {
  try {
    console.log('🚀 开始完整部署...');
    console.log(`目标服务器: ${deployConfig.host}`);
    console.log(`用户: ${deployConfig.username}`);
    console.log('==========================================');
    
    // 1. 构建前端和后端
    console.log('📦 构建前端项目...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('📦 构建后端项目...');
    execSync('npm run build:server', { stdio: 'inherit' });
    
    // 2. 检查构建结果
    if (!fs.existsSync('./dist')) {
      throw new Error('前端构建失败：dist 目录不存在');
    }
    
    if (!fs.existsSync('./server') || !fs.readdirSync('./server').some(file => file.endsWith('.js'))) {
      throw new Error('后端构建失败：server 目录中没有编译后的JS文件');
    }
    
    console.log('✅ 构建完成');
    console.log('==========================================');
    
    // 3. 部署
    if (deployConfig.host === 'localhost') {
      console.log('🏠 本地部署模式');
      
      // 前端部署
      console.log('📂 部署前端...');
      const frontendPath = deployConfig.remotePath + '/frontend';
      if (!fs.existsSync(frontendPath)) {
        fs.mkdirSync(frontendPath, { recursive: true });
      }
      execSync(`cp -r ./dist/* ${frontendPath}/`, { stdio: 'inherit' });
      console.log(`✅ 前端文件已复制到: ${frontendPath}`);
      
      // 后端部署
      console.log('📂 部署后端...');
      const backendPath = deployConfig.deploy.backend.remotePath;
      if (!fs.existsSync(backendPath)) {
        fs.mkdirSync(backendPath, { recursive: true });
      }
      execSync(`cp -r ./server/* ${backendPath}/`, { stdio: 'inherit' });
      execSync(`cp package.json ${backendPath}/`, { stdio: 'inherit' });
      console.log(`✅ 后端文件已复制到: ${backendPath}`);
      
      // 安装后端依赖
      console.log('📦 安装后端依赖...');
      execSync(`cd ${backendPath} && npm install --production`, { stdio: 'inherit' });
      
    } else {
      // 远程部署
      console.log('🌐 远程服务器部署');
      
      // 前端部署
      console.log('📂 部署前端...');
      const frontendTarget = `${deployConfig.username}@${deployConfig.host}:${deployConfig.deploy.frontend.remotePath}`;
      execSync(`rsync -avz --delete ./dist/ ${frontendTarget}`, { stdio: 'inherit' });
      
      // 后端部署
      console.log('📂 部署后端...');
      const backendTarget = `${deployConfig.username}@${deployConfig.host}:${deployConfig.deploy.backend.remotePath}`;
      execSync(`rsync -avz --delete --exclude=node_modules ./server/ ${backendTarget}`, { stdio: 'inherit' });
      execSync(`rsync -avz package.json ${backendTarget}`, { stdio: 'inherit' });
      
      // 远程安装依赖
      console.log('📦 远程安装依赖...');
      const sshCommand = `ssh ${deployConfig.username}@${deployConfig.host} "cd ${deployConfig.deploy.backend.remotePath} && npm install --production"`;
      execSync(sshCommand, { stdio: 'inherit' });
      
      // 重启服务
      if (deployConfig.deploy.backend.startCommand) {
        console.log('🔄 重启后端服务...');
        const restartCommand = `ssh ${deployConfig.username}@${deployConfig.host} "${deployConfig.deploy.backend.startCommand}"`;
        execSync(restartCommand, { stdio: 'inherit' });
      }
    }
    
    console.log('==========================================');
    console.log('🎉 完整部署完成！');
    console.log(`🌐 前端访问地址: ${deployConfig.host === 'localhost' ? 'http://localhost:8080' : 'http://' + deployConfig.host}`);
    console.log(`🔧 后端API地址: ${deployConfig.host === 'localhost' ? 'http://localhost:6015' : 'http://' + deployConfig.host + ':6015'}`);
    
  } catch (error) {
    console.error('❌ 完整部署失败:', error.message);
    process.exit(1);
  }
}

// 运行部署
deployFull();
