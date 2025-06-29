const axios = require('axios');

const BASE_URL = 'http://localhost:6015/api/room';

async function createTestRoom() {
    try {
        console.log('开始创建测试房间...');

        // 1. 创建房间
        const createRoomResponse = await axios.post(`${BASE_URL}/create`, {
            name: '测试房间',
            ownerId: 1001,
            ownerName: '房主小明'
        });

        if (createRoomResponse.data.result !== 1) {
            throw new Error('创建房间失败: ' + createRoomResponse.data.error_msg);
        }

        const roomData = createRoomResponse.data.data.data;
        const roomCode = roomData.roomCode;
        console.log(`✅ 房间创建成功，房间号: ${roomCode}`);

        // 2. 添加更多用户
        const users = [
            { userId: 1002, nickname: '小红' },
            { userId: 1003, nickname: '小刚' },
            { userId: 1004, nickname: '小丽' }
        ];

        for (const user of users) {
            const joinResponse = await axios.post(`${BASE_URL}/join`, {
                roomCode: roomCode,
                userId: user.userId,
                nickname: user.nickname
            });

            if (joinResponse.data.result === 1) {
                console.log(`✅ ${user.nickname} 加入房间成功`);
            } else {
                console.log(`❌ ${user.nickname} 加入房间失败: ${joinResponse.data.error_msg}`);
            }
        }

        // 3. 添加一些支出记录
        const expenses = [
            { fromUserId: 1002, toUserId: 1001, amount: 50, operatorId: 1002, desc: '小红给房主小明转账50元' },
            { fromUserId: 1003, toUserId: 1001, amount: 30, operatorId: 1003, desc: '小刚给房主小明转账30元' },
            { fromUserId: 1004, toUserId: 1002, amount: 20, operatorId: 1004, desc: '小丽给小红转账20元' },
            { fromUserId: 1001, toUserId: 1003, amount: 15, operatorId: 1001, desc: '房主小明给小刚转账15元' },
            { fromUserId: 1002, toUserId: 1004, amount: 25, operatorId: 1002, desc: '小红给小丽转账25元' }
        ];

        for (const expense of expenses) {
            const expenseResponse = await axios.post(`${BASE_URL}/addExpense`, {
                roomCode: roomCode,
                fromUserId: expense.fromUserId,
                toUserId: expense.toUserId,
                amount: expense.amount,
                operatorId: expense.operatorId
            });

            if (expenseResponse.data.result === 1) {
                console.log(`✅ ${expense.desc}`);
            } else {
                console.log(`❌ 添加支出记录失败: ${expenseResponse.data.error_msg}`);
            }

            // 添加延迟，避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 4. 查询房间信息
        const roomInfoResponse = await axios.get(`${BASE_URL}/info/${roomCode}`);
        if (roomInfoResponse.data.result === 1) {
            const roomInfo = roomInfoResponse.data.data;
            console.log('\n📊 房间信息:');
            console.log(`房间号: ${roomInfo.roomCode}`);
            console.log(`房间名: ${roomInfo.name}`);
            console.log(`房主: ${roomInfo.ownerName}`);
            console.log(`当前人数: ${roomInfo.currentUsers}`);
            console.log(`用户列表:`);
            if (roomInfo.roomUsers && roomInfo.roomUsers.length > 0) {
                roomInfo.roomUsers.forEach(user => {
                    console.log(`  - ${user.nickname} (余额: ${user.balance})`);
                });
            }
            if (roomInfo.activities) {
                console.log(`活动记录数: ${roomInfo.activities.length}`);
            }
        } else {
            console.log('❌ 获取房间信息失败:', roomInfoResponse.data);
        }

        console.log(`\n🎉 测试数据创建完成！`);
        console.log(`🏠 房间号: ${roomCode}`);
        console.log(`🌐 访问地址: http://localhost:8080/room/${roomCode}`);
        console.log(`📱 或在首页输入房间号: ${roomCode}`);

    } catch (error) {
        console.error('❌ 创建测试数据失败:', error.message);
        if (error.response && error.response.data) {
            console.error('服务器响应:', error.response.data);
        }
    }
}

// 执行创建测试房间
createTestRoom(); 