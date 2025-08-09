<template>
  <!-- 顶部导航 -->
  <PageNavigation 
    title="打牌记账" 
    subtitle="和朋友一起记录输赢"
    back-path="/"
  >
    <template #right>
      <button class="help-btn" @click="debounceClick(showHelpDialog, 'showHelp')">
        <span class="help-icon">?</span>
      </button>
    </template>
  </PageNavigation>
  
  <div class="card-game-page dark-theme">
    <div class="game-content">
      <!-- 主标题区域 -->
      <div class="hero-section">
        <div class="logo-area">
          <div class="app-icon">🎯</div>
          <h1>打牌记账</h1>
        </div>
        <p class="tagline">和朋友一起，记录每一局输赢</p>
      </div>
      
      <!-- 功能卡片区域 -->
      <div class="action-cards">
        <div class="action-card create-card" @click="debounceClick(showCreateRoomDialog, 'createRoom')" :class="{ disabled: creating }">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ creating ? '创建中...' : '创建房间' }}</h3>
            <p>邀请好友，开始新的游戏</p>
          </div>
        </div>
        
        <div class="action-card join-card" @click="debounceClick(showJoinDialog, 'joinRoom')" :class="{ disabled: joining }">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12L10 7M15 12H3" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ joining ? '进入中...' : '加入房间' }}</h3>
            <p>输入房间号，快速加入</p>
          </div>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="footer-info">
        <span>简约 · 高效 · 专注</span>
      </div>
    </div>
    
    <!-- 创建房间弹窗 -->
    <NicknameDialog 
      v-model="createRoomDialogVisible"
      title="创建房间"
      placeholder="请输入您的昵称"
      confirm-text="确认创建"
      loading-text="创建中..."
      :loading="creating"
      :tips="['昵称将作为房主身份显示给其他玩家', '昵称不能为空且不能与房间内其他人重复']"
      :show-close="true"
      @confirm="handleCreateRoomConfirm"
      @close="createRoomDialogVisible = false"
    />

    <!-- 进房间弹窗 -->
    <el-dialog
      v-model="joinDialogVisible"
      title="进入房间"
      width="85%"
      :max-width="320"
      center
      :close-on-click-modal="false"
      :show-close="false"
      class="custom-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">进入房间</span>
          <button class="dialog-close-btn" @click="joinDialogVisible = false">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="join-dialog-content">
        <el-input
          v-model="roomIdInput"
          placeholder="请输入房间号"
          size="large"
          maxlength="10"
          clearable
          type="number"
        />
        <div class="dialog-tips">
          <p>• 房间号由房主提供</p>
          <p>• 进入房间后需要设置昵称</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            type="primary" 
            @click="debounceClick(checkRoomAndJoin, 'checkJoin', 800)" 
            size="large"
            :loading="joining"
            :disabled="!roomIdInput.trim()"
            class="confirm-btn"
          >
            {{ joining ? '检查中...' : '进入' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 进房间昵称设置弹窗 -->
    <NicknameDialog 
      v-model="joinNicknameDialogVisible"
      title="设置昵称"
      placeholder="请输入你在房间内的昵称"
      confirm-text="确认加入"
      loading-text="加入中..."
      :loading="joining"
      :show-close="true"
      @confirm="handleJoinRoomConfirm"
      @close="joinNicknameDialogVisible = false"
    />

    <!-- 使用说明弹窗 -->
    <el-dialog
      v-model="helpDialogVisible"
      title="使用说明"
      width="85%"
      :max-width="400"
      center
      :show-close="false"
      class="help-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">使用说明</span>
          <button class="dialog-close-btn" @click="helpDialogVisible = false">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="help-content">
        <div class="help-section">
          <h3>🏠 创建房间</h3>
          <ul>
            <li>点击"我要开房"按钮创建新房间</li>
            <li>设置您的昵称，系统将自动生成个性化头像</li>
            <li>房间创建成功后，您将成为房主</li>
            <li>分享房间号给好友，邀请他们加入</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h3>🚪 加入房间</h3>
          <ul>
            <li>点击"进房间"按钮，输入好友提供的房间号</li>
            <li>设置您在该房间的昵称（不能与其他人重复）</li>
            <li>成功加入后即可开始记账</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h3>💰 记账功能</h3>
          <ul>
            <li>在房间内可以记录游戏输赢</li>
            <li>支持添加支出记录，系统自动计算余额</li>
            <li>所有记录实时同步给房间内所有成员</li>
            <li>可以查看详细的交易历史</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h3>👥 用户管理</h3>
          <ul>
            <li>房主可以管理房间设置</li>
            <li>点击用户头像可以修改昵称</li>
            <li>系统会显示用户进出房间的状态</li>
            <li>支持最多10人同时在线</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h3>📱 设备兼容</h3>
          <ul>
            <li>支持手机、平板、电脑等各种设备</li>
            <li>自适应不同屏幕尺寸</li>
            <li>浏览器本地记录用户身份，方便下次进入</li>
          </ul>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="debounceClick(() => helpDialogVisible = false, 'closeHelp')" size="large" class="confirm-btn">
            我知道了
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElDialog, ElInput, ElButton } from 'element-plus';
import Toast from '@/utils/toast.js';
import { debounceClick } from '@/utils/debounce.js';
import PageNavigation from '@/components/PageNavigation.vue';
import NicknameDialog from '@/components/NicknameDialog.vue';
import { createRoom as apiCreateRoom, getRoomInfo as apiGetRoomInfo, joinRoom as apiJoinRoom } from '@/api/room';
import { generateAvatar, getUserSession, validateNickname, RoomUserSession } from '@/utils/userUtils';

const router = useRouter();

// 用户会话信息
const userSession = ref(null);

// 状态管理
const creating = ref(false);
const joining = ref(false);
const createRoomDialogVisible = ref(false);
const joinDialogVisible = ref(false);
const joinNicknameDialogVisible = ref(false);
const helpDialogVisible = ref(false);

// 表单数据
const roomIdInput = ref('');
const ownerNickname = ref('');
const joinNickname = ref('');
const targetRoomInfo = ref(null);

// 头像现在由组件自动生成，不需要预览变量

// 计算属性

// 生命周期
onMounted(() => {
  userSession.value = getUserSession();
});

// 头像现在由UserAvatar组件自动处理，不需要手动更新

// 显示创建房间弹窗
const showCreateRoomDialog = () => {
  ownerNickname.value = '';
  createRoomDialogVisible.value = true;
};

// 处理创建房间昵称确认
const handleCreateRoomConfirm = (nickname) => {
  ownerNickname.value = nickname;
  createRoom();
};

// 显示帮助弹窗
const showHelpDialog = () => {
  helpDialogVisible.value = true;
};

// 创建房间
const createRoom = async () => {
  const validation = validateNickname(ownerNickname.value);
  if(!validation.valid) {
    Toast.warning(validation.message);
    return;
  }
  
  try {
    creating.value = true;
    
    const response = await apiCreateRoom({
      name: `${ownerNickname.value.trim()}的房间`,
      ownerId: userSession.value.userId.hashCode(), // 使用用户ID的哈希值
      ownerName: ownerNickname.value.trim()
    });
    
    if(response.data && response.data.result === 1 && response.data.data && response.data.data.roomCode) {
      Toast.success('房间创建成功！');
      createRoomDialogVisible.value = false;
      
      const roomCode = response.data.data.roomCode;
      const nickname = ownerNickname.value.trim();
      const avatar = generateAvatar(nickname);
      
      // 保存用户信息到 localStorage（兼容旧逻辑）
      const userInfo = {
        userId: userSession.value.userId,
        nickname: nickname,
        avatar: avatar,
        roomCode: roomCode
      };
      localStorage.setItem(`room_${roomCode}_user`, JSON.stringify(userInfo));
      
      // 保存到用户会话管理
      RoomUserSession.saveRoomUser(roomCode, {
                nickname: nickname,
        avatar: avatar
        });
      
              router.push(`/room/${roomCode}`);
    } else {
      const errorMsg = response.data?.error_msg || response.error_msg || '创建房间失败';
      Toast.error(errorMsg);
    }
    
  } catch(error) {
    Toast.error('创建房间失败，请重试');
    console.error('创建房间异常:', error);
  }finally{
    creating.value = false;
  }
};

// 显示进房间弹窗
const showJoinDialog = () => {
  roomIdInput.value = '';
  joinDialogVisible.value = true;
};

// 检查房间并进入昵称设置
const checkRoomAndJoin = async () => {
  if(!roomIdInput.value.trim()) {
    Toast.warning('请输入房间号');
    return;
  }
  
  try {
    joining.value = true;
    const roomCode = roomIdInput.value.trim();
    
    const response = await apiGetRoomInfo(roomCode);
    
    if(response.data && response.data.result === 1 && response.data.data) {
      targetRoomInfo.value = response.data.data;
      
      // 检查是否第一次进入这个房间
      const isFirstTime = RoomUserSession.isFirstTimeEnter(roomCode);
      
      if(!isFirstTime) {
        // 非第一次进入，直接使用历史昵称进入房间
        const roomUserData = RoomUserSession.getRoomUser(roomCode);
        if(roomUserData && roomUserData.nickname) {
          Toast.success(`欢迎回来，${truncateName(roomUserData.nickname)}！`);
          
          // 更新访问时间
          RoomUserSession.saveRoomUser(roomCode, roomUserData);
          
          // 保存用户信息到 localStorage（兼容旧逻辑）
          const userInfo = {
            userId: userSession.value.userId,
            nickname: roomUserData.nickname,
            avatar: roomUserData.avatar || generateAvatar(roomUserData.nickname),
            roomCode: roomCode
          };
          localStorage.setItem(`room_${roomCode}_user`, JSON.stringify(userInfo));
          
          joinDialogVisible.value = false;
          router.push(`/room/${roomCode}`);
          return;
        }
      }
      
      // 第一次进入，需要设置昵称
      joinDialogVisible.value = false;
      joinNickname.value = '';
      joinNicknameDialogVisible.value = true;
    } else {
      const errorMsg = response.data?.error_msg || response.error_msg || '房间不存在或已关闭';
      Toast.error(errorMsg);
    }
    
  } catch(error) {
    Toast.error('查询房间失败，请检查房间号');
    console.error('查询房间异常:', error);
  }finally{
    joining.value = false;
  }
};

// 处理加入房间昵称确认
const handleJoinRoomConfirm = (nickname) => {
  joinNickname.value = nickname;
  joinRoom();
};

// 加入房间
const joinRoom = async () => {
  const validation = validateNickname(joinNickname.value);
  if(!validation.valid) {
          Toast.warning(validation.message);
    return;
  }
  
  try {
    joining.value = true;
    
    const response = await apiJoinRoom({
      roomCode: targetRoomInfo.value.roomCode,
      userId: userSession.value.userId.hashCode(),
      nickname: joinNickname.value.trim()
    });
    
    if(response.data && response.data.result === 1) {
      Toast.success('加入房间成功！');
      joinNicknameDialogVisible.value = false;
      
      const roomCode = targetRoomInfo.value.roomCode;
      const nickname = joinNickname.value.trim();
      const avatar = generateAvatar(nickname);
      
      // 保存用户信息到 localStorage（兼容旧逻辑）
      const userInfo = {
        userId: userSession.value.userId,
        nickname: nickname,
        avatar: avatar,
        roomCode: roomCode
      };
      localStorage.setItem(`room_${roomCode}_user`, JSON.stringify(userInfo));
      
      // 保存到用户会话管理
      RoomUserSession.saveRoomUser(roomCode, {
                nickname: nickname,
        avatar: avatar
        });
      
      router.push(`/room/${roomCode}`);
    } else {
      const errorMsg = response.data?.error_msg || response.error_msg || '加入房间失败';
      Toast.error(errorMsg);
    }
    
  } catch(error) {
    Toast.error('加入房间失败，请重试');
    console.error('加入房间异常:', error);
  }finally{
    joining.value = false;
  }
};

// 截断用户名，最多显示8个字符
const truncateName = (name) => {
  if (!name) return '';
  if (name.length <= 8) return name;
  return name.substring(0, 8) + '...';
};

// 给 String 添加 hashCode 方法用于生成数字ID
String.prototype.hashCode = function() {
  let hash = 0;
  if(this.length === 0) return hash;
  for(let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
</script>

<style lang="scss" scoped>
.card-game-page {
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  
  .game-content {
    max-width: 420px;
    width: 100%;
    text-align: center;
    overflow: hidden;
    margin-top: 70px;
  }
  
  .hero-section {
    margin-bottom: 40px;
    
    .logo-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      
      .app-icon {
        font-size: 48px;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
      }
      
      h1 {
        font-size: 36px;
        font-weight: 800;
        color: white;
        margin: 0;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    }
    
    .tagline {
      font-size: 18px;
      color: rgba(255,255,255,0.9);
      margin: 0;
      font-weight: 500;
      letter-spacing: 0.3px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
  }
  
  .action-cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 32px 24px;
    
    .action-card {
      background: white;
      border-radius: 24px;
      padding: 28px 24px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(226,232,240,0.8);
      display: flex;
      align-items: center;
      gap: 24px;
      text-align: left;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        border-color: rgba(99,102,241,0.2);
      }
      
      &:active {
        transform: translateY(-4px);
      }
      
      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        
        &:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-color: rgba(226,232,240,0.8);
        }
      }
      
      .card-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        
        svg {
          width: 28px;
          height: 28px;
        }
      }
      
      .card-content {
        flex: 1;
        
        h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }
        
        p {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
          line-height: 1.4;
        }
      }
    }
    
    .create-card {
      .card-icon {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
      }
      
      &:hover .card-icon {
        transform: scale(1.1);
        box-shadow: 0 8px 24px rgba(99,102,241,0.4);
      }
    }
    
    .join-card {
      .card-icon {
        background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
        color: white;
      }
      
      &:hover .card-icon {
        transform: scale(1.1);
        box-shadow: 0 8px 24px rgba(5,150,105,0.4);
      }
    }
  }
  
  .footer-info {
    color: rgba(255,255,255,0.8);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    
    span {
      opacity: 0.8;
    }
  }
}

.help-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
  
  .help-icon {
    font-size: 16px;
    font-weight: bold;
  }
}

:deep(.custom-dialog) {
  .el-dialog {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }
  
  .el-dialog__header {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .el-dialog__body {
    padding: 20px;
  }
  
  .el-dialog__footer {
    padding: 12px 20px 20px;
    border-top: 1px solid #eee;
  }
}

:deep(.help-dialog) {
  .el-dialog {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }
  
  .el-dialog__header {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .el-dialog__body {
    padding: 20px;
  }
  
  .el-dialog__footer {
    padding: 12px 20px 20px;
    border-top: 1px solid #eee;
  }
}

.create-room-dialog-content,
.join-dialog-content,
.join-nickname-content {
  .avatar-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    .avatar-img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid #e9ecef;
      margin-bottom: 6px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.08);
    }
    
    .avatar-tip {
      font-size: 12px;
      color: #6c757d;
      margin: 0;
      opacity: 0.6;
      font-weight: 500;
      margin-top: 4px;
    }
  }


  
  .el-input {
    margin: 12px 0;
    
    :deep(.el-input__wrapper) {
      border-radius: 12px;
      padding: 12px 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      border: 1px solid #e9ecef;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #ced4da;
      }
      
      &.is-focus {
        border-color: #409eff;
        box-shadow: 0 3px 8px rgba(64,158,255,0.12);
      }
    }
  }
  
  .dialog-tips {
    margin-top: 12px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    border-left: 3px solid #409eff;
    
    p {
      font-size: 13px;
      color: #495057;
      margin: 3px 0;
      line-height: 1.4;
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.help-dialog {
  .help-content {
    max-height: 70vh;
    overflow-y: auto;
    
    .help-section {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      h3 {
        color: #333;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
        padding-bottom: 6px;
        border-bottom: 2px solid #f0f0f0;
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 6px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px 20px;
  background: #fff;
  
  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    flex: 1;
    letter-spacing: 0.3px;
  }
  
  .dialog-close-btn {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border: none;
    background: #f8f9fa;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e9ecef;
      transform: translateY(-50%) scale(1.05);
    }
    
    &:active {
      transform: translateY(-50%) scale(0.95);
    }
    
    .close-icon {
      width: 18px;
      height: 18px;
      color: #1a1a1a !important;
      stroke: #1a1a1a !important;
      fill: #1a1a1a !important;
      stroke-width: 3;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  
  .el-button {
    min-width: 120px;
  }
  
  .confirm-btn {
    flex: 1;
    max-width: 200px;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 0 3px 8px rgba(64,158,255,0.25);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(64,158,255,0.35);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .card-game-page {
    padding: 70px 16px 16px;
    
    .game-content {
      max-width: 100%;
    }
    
    .hero-section {
      margin-bottom: 32px;
      
      .logo-area {
        gap: 12px;
        margin-bottom: 12px;
        
        .app-icon {
          font-size: 40px;
        }
        
        h1 {
          font-size: 28px;
        }
      }
      
      .tagline {
        font-size: 16px;
      }
    }
    
          .action-cards {
        gap: 16px;
        margin: 0 24px 20px;
      
              .action-card {
          padding: 20px 18px;
          gap: 18px;
        
        .card-icon {
          width: 48px;
          height: 48px;
          
          svg {
            width: 24px;
            height: 24px;
          }
        }
        
        .card-content {
          h3 {
            font-size: 18px;
          }
          
          p {
            font-size: 14px;
          }
        }
      }
    }
    
    .footer-info {
      font-size: 13px;
      letter-spacing: 1.5px;
    }
  }
  
  :deep(.custom-dialog) {
    width: 90% !important;
    max-width: 340px !important;
  }
  
  .help-dialog {
    width: 90% !important;
    max-width: 380px !important;
  }
}

/* 横屏适配 */
@media (max-height: 600px) and (orientation: landscape) {
  .card-game-page {
    padding: 60px 20px 16px;
    
    .hero-section {
      margin-bottom: 24px;
      
      .logo-area {
        gap: 12px;
        margin-bottom: 10px;
        
        .app-icon {
          font-size: 36px;
        }
        
        h1 {
          font-size: 28px;
        }
      }
      
      .tagline {
        font-size: 16px;
      }
    }
    
    .action-cards {
      gap: 16px;
      margin: 0 32px 16px;
      
      .action-card {
        padding: 20px 24px;
        gap: 20px;
        
        .card-icon {
          width: 48px;
          height: 48px;
          
          svg {
            width: 24px;
            height: 24px;
          }
        }
        
        .card-content {
          h3 {
            font-size: 18px;
          }
          
          p {
            font-size: 14px;
          }
        }
      }
    }
    
    .footer-info {
      font-size: 12px;
      letter-spacing: 1.5px;
    }
  }
}

.dialog-footer .el-button {
  flex: 1;
}

/* 超小高度适配 */
@media (max-height: 500px) {
  .card-game-page {
    padding: 50px 20px 12px;
    
    .hero-section {
      margin-bottom: 16px;
      
      .logo-area {
        gap: 8px;
        margin-bottom: 8px;
        
        .app-icon {
          font-size: 32px;
        }
        
        h1 {
          font-size: 24px;
        }
      }
      
      .tagline {
        font-size: 14px;
      }
    }
    
    .action-cards {
      gap: 12px;
      margin: 0 32px 12px;
      
      .action-card {
        padding: 16px 20px;
        gap: 16px;
        
        .card-icon {
          width: 40px;
          height: 40px;
          
          svg {
            width: 20px;
            height: 20px;
          }
        }
        
        .card-content {
          h3 {
            font-size: 16px;
            margin-bottom: 4px;
          }
          
          p {
            font-size: 13px;
          }
        }
      }
    }
    
    .footer-info {
      font-size: 11px;
      letter-spacing: 1px;
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .card-game-page {
    padding: 70px 1rem 1rem;
  }
  
  .user-info {
    padding: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.6rem;
  }
  
  .action-buttons {
    gap: 0.8rem;
  }
  
  .create-room-btn,
  .join-room-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .card-game-page {
    padding: 60px 0.8rem 0.8rem;
  }
  
  .user-info h2 {
    font-size: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.4rem;
  }
}
</style> 