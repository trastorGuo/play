// 部署脚本示例
// 使用前请：
// 1. 复制 deploy.config.example.js 为 deploy.config.js
// 2. 填入真实的服务器配置信息
// 3. 修改此脚本中的部署逻辑

require('dotenv').config();
const { execSync } = require('child_process');

try {
  // 加载部署配置
  const deployConfig = require('../deploy.config.js');
  
  console.log('开始部署到服务器...');
  console.log('目标服务器:', deployConfig.host);
  
  // 在这里添加你的部署逻辑
  // 例如：scp, ssh, rsync 等命令
  
  console.log('部署完成！');
} catch (error) {
  console.error('部署失败:', error.message);
  console.log('请确保 deploy.config.js 文件存在并配置正确');
}
