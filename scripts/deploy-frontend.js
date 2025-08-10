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

async function deployFrontend() {
  try {
    console.log('🚀 开始前端部署...');
    console.log(`目标服务器: ${deployConfig.host}`);
    console.log(`用户: ${deployConfig.username}`);
    
    // 1. 构建前端项目
    console.log('📦 构建前端项目...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 2. 检查构建结果
    if (!fs.existsSync('./dist')) {
      throw new Error('构建失败：dist 目录不存在');
    }
    
    // 3. 本地部署（用于测试）
    if (deployConfig.host === 'localhost') {
      console.log('🏠 本地部署模式');
      const testDeployPath = deployConfig.remotePath;
      
      // 创建测试部署目录
      if (!fs.existsSync(testDeployPath)) {
        fs.mkdirSync(testDeployPath, { recursive: true });
      }
      
      // 复制文件到测试目录
      execSync(`cp -r ./dist/* ${testDeployPath}/`, { stdio: 'inherit' });
      console.log(`✅ 前端文件已复制到: ${testDeployPath}`);
    } else {
      // 远程部署
      console.log('🌐 远程服务器部署');
      const remoteTarget = `${deployConfig.username}@${deployConfig.host}:${deployConfig.deploy.frontend.remotePath}`;
      
      // 使用 rsync 同步文件
      const rsyncCommand = `rsync -avz --delete ./dist/ ${remoteTarget}`;
      console.log(`执行: ${rsyncCommand}`);
      execSync(rsyncCommand, { stdio: 'inherit' });
    }
    
    console.log('🎉 前端部署完成！');
    
  } catch (error) {
    console.error('❌ 前端部署失败:', error.message);
    process.exit(1);
  }
}

// 运行部署
deployFrontend();
