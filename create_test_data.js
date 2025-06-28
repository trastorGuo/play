const axios = require('axios');

// 配置
const API_BASE = 'http://localhost:6015/api/room';

// 生成唯一ID（模拟用户ID）
const generateUserId = () => Math.floor(Math.random() * 1000000);

// 测试数据
const testUsers = [
  { nickname: '小明', userId: generateUserId() },
  { nickname: '小红', userId: generateUserId() },
  { nickname: '小刚', userId: generateUserId() },
  { nickname: '小丽', userId: generateUserId() },
  { nickname: '4441', userId: generateUserId() }
];

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createTestRoom() {
  console.log('🏠 开始创建测试房间...');
  
  try {
    // 首先测试API连接
    console.log('🔍 测试API连接...');
    try {
      const testResponse = await axios.get(`${API_BASE}/info/1`);
      console.log('✅ API连接正常');
    } catch(error) {
      console.log('❌ API连接失败，可能后端服务器未启动');
      console.log('请确保运行: PORT=6015 npx ts-node --project server/tsconfig.json --files server/main.ts');
      return;
    }
    
    // 1. 创建房间（使用第一个用户作为房主）
    console.log('📝 创建房间...');
    const roomResponse = await axios.post(`${API_BASE}/create`, {
      name: '测试房间',
      ownerId: testUsers[0].userId,
      ownerName: testUsers[0].nickname
    });
    
    if(roomResponse.data.result !== 1) {
      throw new Error('创建房间失败: ' + roomResponse.data.error_msg);
    }
    
    const room = roomResponse.data.data.data;
    console.log(`✅ 房间创建成功，房间号: ${room.roomCode}`);
    
    // 2. 让其他用户加入房间
    console.log('👥 添加其他用户...');
    for(let i = 1; i < testUsers.length; i++) {
      await delay(500); // 避免请求过快
      
      const user = testUsers[i];
      const joinResponse = await axios.post(`${API_BASE}/join`, {
        roomCode: room.roomCode,
        userId: user.userId,
        nickname: user.nickname,
        avatar: `/images/icon/logo.png`
      });
      
      if(joinResponse.data.result === 1) {
        console.log(`✅ ${user.nickname} 加入房间成功`);
      } else {
        console.log(`❌ ${user.nickname} 加入房间失败: ${joinResponse.data.error_msg}`);
      }
    }
    
    // 3. 创建一些交易记录
    console.log('💰 创建交易记录...');
    const transactions = [
      { from: 0, to: 1, amount: 50 },   // 小明 -> 小红 50元
      { from: 1, to: 2, amount: 30 },   // 小红 -> 小刚 30元
      { from: 2, to: 3, amount: 80 },   // 小刚 -> 小丽 80元
      { from: 3, to: 0, amount: 20 },   // 小丽 -> 小明 20元
      { from: 0, to: 2, amount: 100 },  // 小明 -> 小刚 100元
      { from: 1, to: 3, amount: 60 },   // 小红 -> 小丽 60元
      { from: 4, to: 1, amount: 35 },   // 4441 -> 小红 35元
      { from: 2, to: 4, amount: 75 },   // 小刚 -> 4441 75元
      { from: 0, to: 4, amount: 90 }    // 小明 -> 4441 90元
    ];
    
    for(const transaction of transactions) {
      await delay(800); // 间隔一些时间
      
      const fromUser = testUsers[transaction.from];
      const toUser = testUsers[transaction.to];
      
      try {
        const expenseResponse = await axios.post(`${API_BASE}/addExpense`, {
          roomCode: room.roomCode,
          fromUserId: fromUser.userId,
          toUserId: toUser.userId,
          amount: transaction.amount,
          operatorId: fromUser.userId
        });
        
        if(expenseResponse.data.result === 1) {
          console.log(`✅ ${fromUser.nickname} 支付给 ${toUser.nickname} ¥${transaction.amount}`);
        } else {
          console.log(`❌ 交易失败: ${expenseResponse.data.error_msg}`);
        }
      } catch(error) {
        console.log(`❌ 交易请求失败: ${error.message}`);
      }
    }
    
    // 4. 测试昵称修改
    console.log('📝 测试昵称修改...');
    await delay(1000);
    
    try {
      const nicknameResponse = await axios.post(`${API_BASE}/updateNickname`, {
        roomCode: room.roomCode,
        userId: testUsers[1].userId,
        nickname: '小红红'
      });
      
      if(nicknameResponse.data.result === 1) {
        console.log(`✅ ${testUsers[1].nickname} 改名为 小红红`);
        testUsers[1].nickname = '小红红'; // 更新本地记录
      } else {
        console.log(`❌ 昵称修改失败: ${nicknameResponse.data.error_msg}`);
      }
    } catch(error) {
      console.log(`❌ 昵称修改请求失败: ${error.message}`);
    }
    
    // 5. 再添加一些交易记录（昵称修改后）
    console.log('💰 创建更多交易记录（测试昵称同步）...');
    const moreTransactions = [
      { from: 1, to: 0, amount: 25 },   // 小红红 -> 小明 25元
      { from: 4, to: 3, amount: 40 },   // 4441 -> 小丽 40元
      { from: 3, to: 2, amount: 55 }    // 小丽 -> 小刚 55元
    ];
    
    for(const transaction of moreTransactions) {
      await delay(600);
      
      const fromUser = testUsers[transaction.from];
      const toUser = testUsers[transaction.to];
      
      try {
        const expenseResponse = await axios.post(`${API_BASE}/addExpense`, {
          roomCode: room.roomCode,
          fromUserId: fromUser.userId,
          toUserId: toUser.userId,
          amount: transaction.amount,
          operatorId: fromUser.userId
        });
        
        if(expenseResponse.data.result === 1) {
          console.log(`✅ ${fromUser.nickname} 支付给 ${toUser.nickname} ¥${transaction.amount}`);
        } else {
          console.log(`❌ 交易失败: ${expenseResponse.data.error_msg}`);
        }
      } catch(error) {
        console.log(`❌ 交易请求失败: ${error.message}`);
      }
    }
    
    console.log('\n🎯 测试房间创建完成!');
    console.log(`房间号: ${room.roomCode}`);
    console.log(`房间链接: http://localhost:8083/room/${room.roomCode}`);
    
  } catch(error) {
    console.error('❌ 创建测试数据失败:', error.message);
    if(error.response && error.response.data) {
      console.error('响应数据:', error.response.data);
    }
  }
}

// 执行脚本
console.log('🚀 开始创建测试数据...');
console.log('请确保后端服务器运行在 http://localhost:6015');
console.log('请确保前端开发服务器运行在 http://localhost:8083\n');

createTestRoom();
