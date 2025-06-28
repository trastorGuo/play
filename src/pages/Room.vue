<template>
  <!-- 顶部导航 -->
  <PageNavigation 
    title="房间" 
    :subtitle="`房间号: ${roomId}`"
    back-path="/card-game"
    :force-back-path="true"
  />
  
  <div class="room-page">
    <div class="room-content">
      <!-- 用户列表 -->
      <div class="users-section">
        <div 
          class="users-scroll-container"
          ref="usersScrollContainer"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @touchstart="startTouch"
          @touchmove="onTouch"
          @touchend="endTouch"
        >
          <div class="users-horizontal-list">
            <!-- 添加好友按钮 - 放在第一位 -->
            <div class="add-user-card" @click="showAddUserDialog">
              <div class="add-icon">+</div>
              <div class="add-text">邀请</div>
            </div>
            
            <div 
              v-for="user in sortedUsers" 
              :key="user.id"
              class="user-card"
              @click="handleUserClick(user)"
            >
              <!-- 当前用户角标 -->
              <div v-if="user.id === currentUserId" class="user-badge">我</div>
              <div class="user-avatar-wrapper">
                <UserAvatar 
                  :nickname="user.nickname" 
                  :size="40"
                />
              </div>
              <div class="user-name">{{ truncateName(user.nickname) }}</div>
              <div class="user-balance" :class="{ positive: user.balance >= 0, negative: user.balance < 0 }">
                ¥{{ user.balance }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="room-tips">
        <span>点击自己头像可修改昵称，点击好友头像可支出分数</span>
      </div>
      
      <!-- 交易记录和状态提示区域 -->
      <div class="activity-section">
        <div class="activity-header">
          <h3 class="activity-title">房间动态</h3>
        </div>
        <div class="activity-list" v-if="activityList.length > 0">
          <div 
            v-for="activity in activityList" 
            :key="activity.id"
            class="activity-item"
            :class="[
              activity.type, 
              { 'related-to-me': activity.isRelatedToCurrentUser },
              { 'join-room': activity.type === 'status' && activity.action === 'join' }
            ]"
          >
            <!-- 交易记录 -->
            <div v-if="activity.type === 'transaction'" class="transaction-content">
              <div class="transaction-info">
                <span class="activity-time">
                  {{ formatDetailTime(activity.createdAt) }}
                </span>
                <span class="from-user">{{ truncateName(activity.fromUserName) }}</span>
                <span class="action">{{ getActionText(activity.transactionType) }}</span>
                <span class="to-user">{{ truncateName(activity.toUserName) }}</span>
                <span class="amount" :class="getAmountClass(activity.transactionType)">
                  ¥{{ activity.amount }}
                </span>
              </div>
            </div>
            
            <!-- 状态消息 -->
            <div v-else-if="activity.type === 'status'" class="status-content">
              <!-- 加入房间消息特殊样式 -->
              <div v-if="activity.action === 'join'" class="join-room-text">
                {{ truncateName(activity.userName) }} 加入了房间
              </div>
              <!-- 其他状态消息 -->
              <div v-else class="status-info">
                <span class="activity-time">
                  {{ formatDetailTime(activity.createdAt) }}
                </span>
                <span class="user-name">{{ truncateName(activity.userName) }}</span>
                <span class="status-text">{{ activity.message }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-activity">
          房间还没有任何动态记录
        </div>
      </div>
      

    </div>
    
    <!-- 分享弹窗 -->
    <el-dialog
      v-model="shareDialogVisible"
      title="分享房间"
      width="85%"
      :max-width="300"
      center
      :close-on-click-modal="false"
      :show-close="false"
      class="custom-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">分享房间</span>
          <button class="dialog-close-btn" @click="shareDialogVisible = false">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="share-dialog-content">
        <div class="qr-code-section">
          <div class="qr-code" ref="qrCodeRef">
            <!-- 这里可以集成二维码生成库 -->
            <div class="qr-placeholder">
              <span>房间二维码</span>
              <small>{{ roomUrl }}</small>
            </div>
          </div>
        </div>
        <div class="share-info">
          <p>房间号: <strong>{{ roomId }}</strong></p>
          <p>扫描二维码或分享房间号给好友</p>
        </div>
        
        <div class="share-buttons">
          <el-button @click="copyRoomCode" type="info" plain size="small">
            复制房间号
          </el-button>
          <el-button @click="copyRoomLink" type="success" plain size="small">
            复制链接
          </el-button>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="shareRoom" size="large" class="confirm-btn">
            {{ canShare ? '系统分享' : '复制链接' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 修改昵称弹窗 -->
    <el-dialog
      v-model="editNameDialogVisible"
      title="修改昵称"
      width="85%"
      :max-width="300"
      center
      :show-close="false"
      class="custom-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">修改昵称</span>
          <button class="dialog-close-btn" @click="editNameDialogVisible = false">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="edit-name-dialog-content">
        <el-input
          v-model="editNameForm.nickname"
          placeholder="请输入新昵称"
          size="large"
          maxlength="10"
          show-word-limit
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            type="primary" 
            @click="updateNickname" 
            size="large"
            :disabled="!editNameForm.nickname.trim()"
            class="confirm-btn"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 支出分数弹窗 -->
    <el-dialog
      v-model="expenseDialogVisible"
      title="支出分数"
      width="85%"
      :max-width="320"
      center
      :close-on-click-modal="false"
      :show-close="false"
      class="custom-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">支出分数</span>
          <button class="dialog-close-btn" @click="expenseDialogVisible = false">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="expense-dialog-content">
        <div class="user-selection">
          <div class="user-avatar-section">
            <div class="user-info">
              <UserAvatar 
                :nickname="expenseForm.fromUser?.nickname" 
                :size="40"
              />
              <div class="name">{{ truncateName(expenseForm.fromUser?.nickname) }}</div>
            </div>
            <div class="arrow">→</div>
            <div class="user-info">
              <UserAvatar 
                :nickname="expenseForm.toUser?.nickname" 
                :size="40"
              />
              <div class="name">{{ truncateName(expenseForm.toUser?.nickname) }}</div>
            </div>
          </div>
        </div>
        
        <div class="expense-form">
          <div class="form-item">
            <el-input
              v-model="expenseForm.amount"
              placeholder="输入支出分数"
              size="large"
              type="number"
              class="amount-input"
            />
          </div>
          
          <div class="form-item">
            <el-button 
              type="primary" 
              size="large"
              class="submit-btn"
              @click="addExpense"
              :disabled="!expenseForm.amount"
            >
              支出
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 添加用户弹窗 -->
    <el-dialog
      v-model="addUserDialogVisible"
      title="设置昵称"
      width="85%"
      :max-width="320"
      center
      :close-on-click-modal="false"
      :show-close="false"
      class="custom-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">设置昵称</span>
          <button class="dialog-close-btn" @click="addUserDialogVisible = false">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>
      <div class="add-user-dialog-content">
        <div class="avatar-preview">
          <UserAvatar :nickname="newUserName" :size="60" />
          <p class="avatar-tip">根据昵称自动生成头像</p>
        </div>
        
        <el-input
          v-model="newUserName"
          placeholder="请输入你在房间内的昵称"
          size="large"
          maxlength="10"
          show-word-limit
          clearable
        />
        
        <div class="dialog-tips">
          <p>• 昵称不能为空</p>
          <p>• 昵称不能与房间内其他人重复</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            type="primary" 
            @click="addUser" 
            size="large"
            :disabled="!newUserName.trim()"
            class="confirm-btn"
          >
            确认加入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 加入房间昵称设置弹窗 -->
    <el-dialog
      v-model="joinRoomDialogVisible"
      title="设置昵称"
      width="85%"
      :max-width="320"
      center
      :close-on-click-modal="false"
      :show-close="false"
      class="custom-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">设置昵称</span>
        </div>
      </template>
      <div class="join-room-dialog-content">
        <div class="avatar-preview">
          <UserAvatar :nickname="joinRoomNickname" :size="60" />
          <p class="avatar-tip">根据昵称自动生成头像</p>
        </div>
        
        <el-input
          v-model="joinRoomNickname"
          placeholder="请输入你在房间内的昵称"
          size="large"
          maxlength="10"
          show-word-limit
          clearable
        />
        
        <div class="dialog-tips">
          <p>• 昵称不能为空</p>
          <p>• 昵称不能与房间内其他人重复</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            type="primary" 
            @click="confirmJoinRoom" 
            size="large"
            :disabled="!joinRoomNickname.trim()"
            class="confirm-btn"
          >
            确认加入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 直接加入房间昵称设置弹窗 -->
    <NicknameDialog 
      v-model="directJoinDialogVisible"
      title="加入房间"
      placeholder="请输入你在房间内的昵称"
      confirm-text="确认加入"
      loading-text="加入中..."
      :loading="false"
      :show-close="false"
      @confirm="handleDirectJoinConfirm"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElDialog, ElInput, ElButton, ElMessageBox } from 'element-plus';
import Toast from '@/utils/toast.js';
import PageNavigation from '@/components/PageNavigation.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import NicknameDialog from '@/components/NicknameDialog.vue';
import { getRoomInfo as apiGetRoomInfo, getRoomRecords as apiGetRoomRecords, getRoomActivities as apiGetRoomActivities, updateNickname as apiUpdateNickname, addExpense as apiAddExpense, joinRoom as apiJoinRoom } from '@/api/room';
import { generateAvatar, getUserSession, RoomUserSession, SSEManager } from '@/utils/userUtils';

const route = useRoute();
const router = useRouter();

// 房间信息
const roomId = computed(() => route.params.roomId);
const isOwner = computed(() => route.query.isOwner === 'true');
const roomUrl = computed(() => `${window.location.origin}/room/${roomId.value}`);
const canShare = computed(() => navigator.share && typeof navigator.share === 'function');
const currentUserId = ref(null); // 当前用户的RoomUser记录ID，动态设置
const userSession = ref(null); // 当前用户会话信息

// 用户列表
const users = ref([]);

// 交易记录
const records = ref([]);

// 房间活动列表（从后端获取的整合数据）
const activities = ref([]);

// 排序后的用户列表（房主第一位，其他按加入时间排序）
const sortedUsers = computed(() => {
  if (!Array.isArray(users.value)) return [];
  
  const sortedList = [...users.value];
  sortedList.sort((a, b) => {
    // 房主优先
    if (roomInfo.value && a.userId === roomInfo.value.ownerId) return -1;
    if (roomInfo.value && b.userId === roomInfo.value.ownerId) return 1;
    
    // 其他按加入时间排序
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  
  return sortedList;
});

// 活动列表（处理后端返回的活动数据）
const activityList = computed(() => {
  if (!Array.isArray(activities.value)) return [];
  
  const currentUserNickname = users.value.find(u => u.id === currentUserId.value)?.nickname;
  
  return activities.value.map(activity => {
    if (activity.type === 'transaction') {
      // 交易记录
      return {
        ...activity,
        isRelatedToCurrentUser: activity.fromUserName === currentUserNickname || 
                               activity.toUserName === currentUserNickname
      };
    } else if (activity.type === 'user_joined') {
      // 用户加入记录
      return {
        ...activity,
        type: 'status',
        isRelatedToCurrentUser: activity.userName === currentUserNickname
      };
    }
    return activity;
  });
});

// 房间详细信息
const roomInfo = ref(null);

// 弹窗状态
const shareDialogVisible = ref(false);
const expenseDialogVisible = ref(false);
const addUserDialogVisible = ref(false);
const editNameDialogVisible = ref(false);
const joinRoomDialogVisible = ref(false);
const directJoinDialogVisible = ref(false);

// 表单数据
const expenseForm = reactive({
  fromUser: null,
  toUser: null,
  amount: ''
});

const editNameForm = reactive({
  userId: null,
  nickname: ''
});

const newUserName = ref('');
const joinRoomNickname = ref('');

// 用户列表滚动容器引用
const usersScrollContainer = ref(null);

// 拖拽状态
const dragState = reactive({
  isDragging: false,
  startX: 0,
  scrollLeft: 0
});

// 开始拖拽
const startDrag = (e) => {
  dragState.isDragging = true;
  dragState.startX = e.pageX - usersScrollContainer.value.offsetLeft;
  dragState.scrollLeft = usersScrollContainer.value.scrollLeft;
  usersScrollContainer.value.style.cursor = 'grabbing';
};

// 拖拽中
const onDrag = (e) => {
  if(!dragState.isDragging) return;
  e.preventDefault();
  const x = e.pageX - usersScrollContainer.value.offsetLeft;
  const walk = (x - dragState.startX) * 2;
  usersScrollContainer.value.scrollLeft = dragState.scrollLeft - walk;
};

// 结束拖拽
const endDrag = () => {
  dragState.isDragging = false;
  usersScrollContainer.value.style.cursor = 'grab';
};

// 触摸开始
const startTouch = (e) => {
  dragState.isDragging = true;
  dragState.startX = e.touches[0].pageX - usersScrollContainer.value.offsetLeft;
  dragState.scrollLeft = usersScrollContainer.value.scrollLeft;
};

// 触摸移动
const onTouch = (e) => {
  if(!dragState.isDragging) return;
  const x = e.touches[0].pageX - usersScrollContainer.value.offsetLeft;
  const walk = (x - dragState.startX) * 2;
  usersScrollContainer.value.scrollLeft = dragState.scrollLeft - walk;
};

// 触摸结束
const endTouch = () => {
  dragState.isDragging = false;
};

// 显示分享弹窗
const showShareDialog = () => {
  shareDialogVisible.value = true;
};

// 分享房间
const shareRoom = () => {
  if(canShare.value) {
    navigator.share({
      title: '打牌记账房间',
      text: `房间号: ${roomId.value}`,
      url: roomUrl.value
    }).then(() => {
      shareDialogVisible.value = false;
    }).catch(err => {
      console.log('分享失败:', err);
      copyRoomLink();
    });
  } else {
    copyRoomLink();
  }
};

// 复制房间号
const copyRoomCode = async () => {
  try {
    await navigator.clipboard.writeText(roomId.value);
    Toast.success('房间号已复制到剪贴板');
  } catch(err) {
    // 降级处理
    const textArea = document.createElement('textarea');
    textArea.value = roomId.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    Toast.success('房间号已复制到剪贴板');
  }
};

// 复制房间链接
const copyRoomLink = async () => {
  try {
    await navigator.clipboard.writeText(roomUrl.value);
    Toast.success('房间链接已复制到剪贴板');
  } catch(err) {
    // 降级处理
    const textArea = document.createElement('textarea');
    textArea.value = roomUrl.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    Toast.success('房间链接已复制到剪贴板');
  }
  shareDialogVisible.value = false;
};

// 处理用户点击
const handleUserClick = (user) => {
  if(user.id === currentUserId.value) {
    // 点击自己头像，修改昵称
    editNameForm.userId = user.userId; // 使用真实的userId而不是RoomUser记录ID
    editNameForm.nickname = user.nickname;
    editNameDialogVisible.value = true;
  } else {
    // 点击别人头像，支出分数
    // 确保users.value是数组
    if(Array.isArray(users.value)) {
      expenseForm.fromUser = users.value.find(u => u.id === currentUserId.value);
      expenseForm.toUser = user;
      expenseForm.amount = '';
      expenseDialogVisible.value = true;
    } else {
      Toast.warning('用户数据加载中，请稍后再试');
    }
  }
};

// 更新昵称
const updateNickname = async () => {
  if(!editNameForm.nickname.trim()) {
    Toast.warning('请输入昵称');
    return;
  }
  
  try {
    // 保存旧昵称用于更新记录
    const oldNickname = users.value.find(u => u.userId === editNameForm.userId)?.nickname;
    
    // 调用API更新昵称
    const response = await apiUpdateNickname({
      roomCode: roomId.value,
      userId: editNameForm.userId,
      nickname: editNameForm.nickname.trim()
    });
    
    if(response.result === 1 && response.data.result === 1) {
      Toast.success(response.data.message || '昵称更新成功');
      editNameDialogVisible.value = false;
      
      // 后端会通过SSE广播昵称更新事件，前端会自动接收并更新数据
      // 这里直接重新加载数据确保数据同步
      await loadRoomData();
    } else {
      Toast.error(response.data?.error_msg || '更新昵称失败');
    }
  } catch(error) {
    Toast.error('网络错误，更新昵称失败');
    console.error('更新昵称失败:', error);
  }
};

// 显示记账弹窗
const showExpenseDialog = () => {
  // 确保users.value是数组
  if(!Array.isArray(users.value)) {
    Toast.warning('用户数据加载中，请稍后再试');
    return;
  }
  
  // 从底部导航点击时，选择第一个非当前用户
  const otherUsers = users.value.filter(u => u.id !== currentUserId.value);
  if(otherUsers.length > 0) {
    expenseForm.fromUser = users.value.find(u => u.id === currentUserId.value);
    expenseForm.toUser = otherUsers[0];
    expenseForm.amount = '';
    expenseDialogVisible.value = true;
  } else {
    Toast.warning('房间中需要至少两个人才能记账');
  }
};

// 添加记录
const addExpense = async () => {
  const amount = parseFloat(expenseForm.amount);
  if(isNaN(amount) || amount <= 0) {
    Toast.warning('请输入有效金额');
    return;
  }
  
  if(!expenseForm.fromUser || !expenseForm.toUser) {
    Toast.warning('请选择支付用户');
    return;
  }
  
  try {
    // 调用API添加记录
    const response = await apiAddExpense({
      roomCode: roomId.value,
      fromUserId: expenseForm.fromUser.userId, // 使用真实的userId
      toUserId: expenseForm.toUser.userId, // 使用真实的userId
      amount: amount,
      operatorId: userSession.value.userId.hashCode() // 使用真实的userId
    });
    
    if(response.result === 1 && response.data.result === 1) {
      Toast.success(response.data.message || `${truncateName(expenseForm.fromUser.nickname)} 支付给 ${truncateName(expenseForm.toUser.nickname)} ¥${amount}`);
      expenseDialogVisible.value = false;
      
      // 等待API成功返回后重新加载数据
      await loadRoomData();
    } else {
      Toast.error(response.data?.error_msg || '添加记录失败');
    }
  } catch(error) {
    Toast.error('网络错误，添加记录失败');
    console.error('添加记录失败:', error);
  }
};

// 添加好友（复制房间链接）
const showAddUserDialog = async () => {
  try {
    await navigator.clipboard.writeText(roomUrl.value);
    Toast.success('房间链接已复制到剪贴板，分享给好友即可加入房间！');
  } catch(err) {
    // 降级处理
    const textArea = document.createElement('textarea');
    textArea.value = roomUrl.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    Toast.success('房间链接已复制到剪贴板，分享给好友即可加入房间！');
  }
};

// 添加用户
const addUser = async () => {
  if(!newUserName.value.trim()) {
    Toast.warning('请输入用户昵称');
    return;
  }
  
  try {
    // 调用API添加用户
    const response = await apiJoinRoom({
      roomCode: roomId.value,
      userId: Date.now(), // 新用户ID，实际应该从用户系统获取
      nickname: newUserName.value.trim(),
      avatar: '/images/icon/logo.png'
    });
    
    if(response.result === 1 && response.data.result === 1) {
      Toast.success(response.data.message || `已添加好友 ${truncateName(newUserName.value.trim())}`);
      addUserDialogVisible.value = false;
      
      // 等待API成功返回后重新加载数据
      await loadRoomData();
    } else {
      Toast.error(response.data?.error_msg || '添加用户失败');
    }
  } catch(error) {
    Toast.error('网络错误，添加用户失败');
    console.error('添加用户失败:', error);
  }
};

// 加载房间数据
const loadRoomData = async () => {
  try {
    // 获取房间信息（包含用户列表和交易记录）
    const roomResponse = await apiGetRoomInfo(roomId.value);
    if(roomResponse.data && roomResponse.data.result === 1) {
      const roomData = roomResponse.data.data;
      roomInfo.value = roomData;
      
      // 从房间信息中提取用户列表
      if(roomData.roomUsers && Array.isArray(roomData.roomUsers)) {
        users.value = roomData.roomUsers.filter(user => user.status === 1); // 只取在房间内的用户
        
        // 生成用户头像（如果没有的话）
        users.value.forEach(user => {
          if(!user.avatar || user.avatar === '/images/icon/logo.png' || user.avatar === '') {
            user.avatar = generateAvatar(user.nickname);
          }
        });
        
        // 设置当前用户的RoomUser记录ID
        const currentUserHashId = userSession.value?.userId?.hashCode();
        const currentUser = users.value.find(u => u.userId === currentUserHashId);
        if(currentUser) {
          currentUserId.value = currentUser.id;
        }
      } else {
        users.value = [];
      }
    } else {
      // 房间不存在的情况
      Toast.error(roomResponse.data?.error_msg || '房间不存在或已关闭');
      setTimeout(() => {
        router.push('/card-game');
      }, 2000);
      return;
    }
    
    // 获取房间活动（包含交易记录和用户加入记录）
    const activitiesResponse = await apiGetRoomActivities(roomId.value);
    if(activitiesResponse.data && activitiesResponse.data.result === 1) {
      activities.value = Array.isArray(activitiesResponse.data.data) ? activitiesResponse.data.data : [];
      // 提取交易记录用于兼容性
      records.value = activities.value.filter(item => item.type === 'transaction').map(item => item.data || item);
    } else {
      activities.value = []; // 确保在失败时也保持数组结构
      records.value = [];
    }
    
  } catch(error) {
    console.error('加载房间数据失败:', error);
    Toast.error('加载房间数据失败');
  }
};

// 格式化时间
const formatTime = (timeString) => {
  const date = new Date(timeString);
  const now = new Date();
  const diff = now - date;
  
  if(diff < 60000) { // 1分钟内
    return '刚刚';
  } else if(diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if(diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return date.toLocaleDateString();
  }
};

// 格式化详细时间
const formatDetailTime = (time) => {
  const targetTime = new Date(time);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(targetTime.getFullYear(), targetTime.getMonth(), targetTime.getDate());
  
  const timeStr = targetTime.toLocaleTimeString('zh-CN', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  if(targetDate.getTime() === today.getTime()) {
    return timeStr; // 今天只显示时间
  } else {
    const dateStr = targetTime.toLocaleDateString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit' 
    });
    return `${dateStr} ${timeStr}`;
  }
};

// 获取操作文本
const getActionText = (type) => {
  switch(type) {
    case'pay': return '付给';
    case'win': return '赢了';
    case'lose': return '输给';
    default: return '操作';
  }
};

// 获取金额样式类
const getAmountClass = (type) => {
  switch(type) {
    case'pay': return 'amount-pay';
    case'win': return 'amount-win';
    case'lose': return 'amount-lose';
    default: return '';
  }
};

// 截断用户名，最多显示8个字符
const truncateName = (name) => {
  if (!name) return '';
  if (name.length <= 8) return name;
  return name.substring(0, 8) + '...';
};

// 加入房间逻辑
const joinRoomWithNickname = async (nickname) => {
  if(!nickname || !nickname.trim()) {
    Toast.warning('请输入昵称');
    return false;
  }
  
  try {
    // 获取用户会话信息
    userSession.value = getUserSession();
    
    // 调用API加入房间
    const response = await apiJoinRoom({
      roomCode: roomId.value,
      userId: userSession.value.userId.hashCode(),
      nickname: nickname.trim()
    });
    
    if(response.result === 1 && response.data.result === 1) {
      // 保存房间用户信息
      RoomUserSession.saveRoomUser(roomId.value, {
        nickname: nickname.trim(),
        userId: userSession.value.userId,
        joinedAt: new Date().toISOString()
      });
      
      Toast.success('成功加入房间！');
      return true;
    } else {
      Toast.error(response.data?.error_msg || '加入房间失败');
      return false;
    }
  } catch(error) {
    console.error('加入房间失败:', error);
    Toast.error('网络错误，加入房间失败');
    return false;
  }
};

// 建立SSE连接
const connectSSE = () => {
  try {
    SSEManager.connect(roomId.value, 
      // 消息处理
      (data) => {
        handleSSEMessage(data);
      },
      // 错误处理
      (error) => {
        console.warn('SSE连接出现问题:', error);
      }
    );
  } catch(error) {
    console.warn('SSE连接失败，将使用轮询模式:', error);
  }
};

// 页面加载时初始化数据
onMounted(async () => {
  // 检查房间ID是否存在
  if(!roomId.value) {
    Toast.error('房间ID不能为空');
    router.push('/card-game');
    return;
  }
  
  // 获取用户会话信息
  userSession.value = getUserSession();
  
  // 检查用户是否已经在房间中
  const isFirstTime = RoomUserSession.isFirstTimeEnter(roomId.value);
  const roomUserData = RoomUserSession.getRoomUser(roomId.value);
  
  if(isFirstTime || !roomUserData || !roomUserData.nickname) {
    // 第一次进入或没有昵称信息，显示昵称输入弹窗
    directJoinDialogVisible.value = true;
  } else {
    // 非第一次进入，直接加载数据
    await loadRoomData();
    // 建立SSE连接
    connectSSE();
  }
});

// SSE连接断开
onUnmounted(() => {
  SSEManager.disconnect(roomId.value);
});

// 处理SSE消息
const handleSSEMessage = (data) => {
  switch(data.type) {
    case'nickname_updated':
      // 有用户更新了昵称，刷新数据
      loadRoomData();
      Toast.info(`${truncateName(data.data.oldNickname)} 改名为 ${truncateName(data.data.newNickname)}`);
      break;
    case'user_joined':
      // 有新用户加入
      loadRoomData();
      Toast.info(`${truncateName(data.data.nickname)} 加入了房间`);
      break;
    case'expense_added':
      // 有新的交易记录
      loadRoomData();
      break;
    case'user_left':
      // 有用户离开
      loadRoomData();
      Toast.info(`${truncateName(data.data.nickname)} 离开了房间`);
      break;
    case'heartbeat':
      // 心跳消息，保持连接
      break;
    default:
      console.log('收到未知SSE消息:', data);
  }
};

// 处理直接加入房间昵称确认
const handleDirectJoinConfirm = async (nickname) => {
  const success = await joinRoomWithNickname(nickname);
  if(success) {
    directJoinDialogVisible.value = false;
    await loadRoomData();
    // 建立SSE连接
    connectSSE();
  } else {
    // 加入失败，关闭弹窗并返回主页
    directJoinDialogVisible.value = false;
    router.push('/card-game');
  }
};

// 添加String.prototype.hashCode如果不存在
if(!String.prototype.hashCode) {
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
}
</script>

<style scoped>
.room-page {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 90px 0.5rem 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.room-content {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 1.5rem;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.users-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: visible;
  margin-bottom: 1rem;
}

.room-tips {
  text-align: center;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.3;
  flex-shrink: 0;
  margin-bottom: 1rem;
}

.users-scroll-container {
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
  -webkit-overflow-scrolling: touch; /* 移动端平滑滚动 */
  cursor: grab;
}

.users-scroll-container:active {
  cursor: grabbing;
}

.users-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.users-horizontal-list {
  display: flex;
  gap: 0.8rem;
  padding: 0.7rem 0.5rem 0.5rem 0.5rem;
  min-width: max-content;
  width: fit-content;
  overflow: visible;
}

.user-card,
.add-user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 75px;
  min-width: 75px;
  max-width: 75px;
  flex-shrink: 0;
  overflow: visible;
}

/* 当用户数量超过4个时，缩小用户卡片 */
.users-horizontal-list:has(.user-card:nth-child(5)) .user-card {
  width: 65px;
  min-width: 65px;
  max-width: 65px;
  padding: 0.5rem 0.4rem;
}

.users-horizontal-list:has(.user-card:nth-child(5)) .add-user-card-small {
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  padding: 0.3rem 0.3rem;
}

.users-horizontal-list:has(.user-card:nth-child(5)) .user-avatar-wrapper {
  margin-bottom: 0.3rem;
}

.users-horizontal-list:has(.user-card:nth-child(5)) .user-name {
  font-size: 0.7rem;
  max-width: 55px;
}

.users-horizontal-list:has(.user-card:nth-child(5)) .user-balance {
  font-size: 0.65rem;
}

.users-horizontal-list:has(.user-card:nth-child(5)) .add-icon-small {
  font-size: 1.2rem;
}

.users-horizontal-list:has(.user-card:nth-child(5)) .add-text-small {
  font-size: 0.6rem;
}

.user-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  position: relative;
  overflow: visible;
}

.user-card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-avatar-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.user-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff6b6b;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  line-height: 1.2;
  pointer-events: none;
}





.user-name {
  font-size: 0.75rem;
  color: #fff;
  margin-bottom: 0.2rem;
  text-align: center;
  width: 100%;
  max-width: 65px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.1;
  display: block;
}

.user-balance {
  font-size: 0.7rem;
  font-weight: bold;
  text-align: center;
}

.user-balance.positive {
  color: #ff6b6b; /* 赚钱为红色 */
}

.user-balance.negative {
  color: #4ecdc4; /* 负债为绿色 */
}

.add-user-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  justify-content: center;
}

.add-user-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.add-icon {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.add-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.add-user-card-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 50px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.add-user-card-small:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.add-icon-small {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3rem;
}

.add-text-small {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.activity-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  height: 100%;
}

.activity-header {
  margin-bottom: 1rem;
}

.activity-title {
  color: #fff;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  max-height: 100%;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
}

.activity-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.activity-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
  border-left: 3px solid transparent;
  flex-shrink: 0;
  margin-bottom: 0.3rem;
}

.activity-item.transaction {
  border-left-color: #4ecdc4;
}

.activity-item.status {
  border-left-color: #ffd93d;
}

.activity-item.join-room {
  background: transparent;
  border: none;
  border-left: none;
  padding: 0.3rem 0;
  min-height: auto;
  text-align: center;
}

.activity-item.related-to-me {
  /* 移除特殊样式，保持与其他消息一致 */
}

.activity-item:not(.related-to-me) {
  /* 移除透明度差异，保持与其他消息一致 */
}

.transaction-content,
.status-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.transaction-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #fff;
  font-size: 0.8rem;
}

.status-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #fff;
  font-size: 0.8rem;
  text-align: center;
}

.join-room-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  text-align: center;
  width: 100%;
}

.from-user,
.to-user,
.user-name {
  font-weight: 600;
  max-width: 8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.action,
.status-text {
  color: rgba(255, 255, 255, 0.7);
}

.amount {
  margin-left: auto;
  font-weight: bold;
}

.amount-pay {
  color: #4ecdc4; /* 支付为绿色（负债） */
}

.amount-win {
  color: #ff6b6b; /* 赢钱为红色（赚钱） */
}

.amount-lose {
  color: #4ecdc4; /* 输钱为绿色（负债） */
}

.activity-time {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  margin-right: 0.8rem;
  flex-shrink: 0;
  min-width: 80px;
}

.no-activity {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  padding: 2rem;
}

.user-selection {
  margin-bottom: 1.5rem;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.user-info .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ddd;
}

.user-info .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info .name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
  max-width: 8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.arrow {
  font-size: 1.5rem;
  color: #666;
}

.amount-input {
  text-align: center;
  font-size: 1.2rem;
}

.submit-btn {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.8rem;
}

.room-tips {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}





.share-dialog-content {
  text-align: center;
}

.qr-code-section {
  margin-bottom: 1.5rem;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border: 2px solid #eee;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
}

.qr-placeholder {
  text-align: center;
  color: #666;
}

.qr-placeholder small {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.7rem;
  word-break: break-all;
}

.share-info p {
  margin: 0.5rem 0;
  color: #666;
}

.share-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}

.expense-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.expense-type-buttons {
  display: flex;
  gap: 1rem;
}

.type-btn {
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.win-btn {
  color: #4ecdc4;
  border-color: #4ecdc4;
}

.win-btn.active {
  background: #4ecdc4;
  color: #fff;
}

.lose-btn {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.lose-btn.active {
  background: #ff6b6b;
  color: #fff;
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
    padding: 24px;
  }
  
  .el-dialog__footer {
    padding: 16px 24px 24px;
    border-top: 1px solid #eee;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 24px;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .room-page {
    padding: 70px 0.25rem 20px;
  }
  
  .room-content {
    padding: 0 0.75rem;
    height: 100%;
  }
  
  .users-section {
    padding: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  .activity-section {
    padding: 0.8rem;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  
  .users-horizontal-list {
    gap: 0.6rem;
  }
  
  .user-card,
  .add-user-card {
    padding: 0.5rem 0.4rem;
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }
  
  .user-name {
    font-size: 0.7rem;
    max-width: 50px;
  }
  
  .user-balance {
    font-size: 0.65rem;
  }
  
  .room-tips {
    margin-bottom: 0.8rem;
  }
  
  .activity-item {
    padding: 0.5rem;
  }
  
  .transaction-info,
  .status-info {
    font-size: 0.75rem;
    gap: 0.3rem;
  }
}

/* 添加用户弹窗样式 */
.add-user-dialog-content {
  .avatar-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 12px;
    
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

/* 小屏幕设备适配 */
@media (max-width: 480px) {
  .room-page {
    padding: 70px 0.125rem 20px;
  }
  
  .room-content {
    max-width: none;
    padding: 0 0.5rem;
    height: 100%;
  }
  
  .users-section {
    padding: 0.6rem;
    border-radius: 12px;
    margin-bottom: 0.6rem;
  }
  
  .activity-section {
    padding: 0.6rem;
    border-radius: 12px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  
  .room-tips {
    margin-bottom: 0.6rem;
  }
}
</style>