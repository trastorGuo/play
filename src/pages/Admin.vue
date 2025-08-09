<template>
  <!-- 顶部导航 -->
  <PageNavigation 
    title="房间管理" 
    subtitle="查看历史房间和输赢统计"
    back-path="/card-game"
  />
  
  <div class="admin-page dark-theme">
    <div class="admin-content">
      <!-- 搜索过滤区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索房间号、房间名称或房主"
            size="large"
            clearable
            class="search-input"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filters.status"
            placeholder="房间状态"
            size="large"
            clearable
            class="status-select"
            @change="handleFilterChange"
          >
            <el-option label="全部" :value="undefined" />
            <el-option label="活跃" :value="1" />
            <el-option label="已关闭" :value="0" />
          </el-select>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-number">{{ totalRooms }}</div>
          <div class="stat-label">总房间数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activeRooms }}</div>
          <div class="stat-label">活跃房间</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">¥{{ totalAmount }}</div>
          <div class="stat-label">总交易金额</div>
        </div>
      </div>

      <!-- 房间列表 -->
      <div class="rooms-section">
        <div class="section-header">
          <h3>房间列表</h3>
          <div class="pagination-info" v-if="roomList.length > 0">
            共 {{ pagination.total }} 个房间
          </div>
        </div>
        
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <div v-else-if="roomList.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <div class="empty-text">暂无房间数据</div>
        </div>
        
        <div v-else class="rooms-list">
          <div 
            v-for="room in roomList" 
            :key="room.id"
            class="room-card"
            @click="handleRoomClick(room)"
          >
            <div class="room-header">
              <div class="room-title">
                <span class="room-name">{{ room.name }}</span>
                <span class="room-code">#{{ room.roomCode }}</span>
              </div>
              <div class="room-status" :class="{ active: room.status === 1, inactive: room.status === 0 }">
                {{ room.status === 1 ? '活跃' : '已关闭' }}
              </div>
            </div>
            
            <div class="room-info">
              <div class="info-item">
                <span class="label">房主：</span>
                <span class="value">{{ room.ownerName }}</span>
              </div>
              <div class="info-item">
                <span class="label">用户：</span>
                <span class="value">{{ room.activeUsers }}/{{ room.totalUsers }}</span>
              </div>
              <div class="info-item">
                <span class="label">交易：</span>
                <span class="value">{{ room.totalTransactions }}笔</span>
              </div>
              <div class="info-item">
                <span class="label">金额：</span>
                <span class="value amount">¥{{ room.totalAmount }}</span>
              </div>
            </div>
            
            <div class="room-time">
              <div class="created-time">创建：{{ formatTime(room.createdAt) }}</div>
              <div class="last-activity">最后活动：{{ formatTime(room.lastActivityTime) }}</div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="pagination.totalPages > 1" class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            :page-size="pagination.limit"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 房间详情弹窗 -->
    <el-dialog
      v-model="roomDetailVisible"
      :title="`房间详情 - ${selectedRoom?.name || ''}`"
      width="90%"
      :max-width="800"
      center
      :close-on-click-modal="false"
      class="room-detail-dialog"
    >
      <div v-if="roomDetailLoading" class="loading-container">
        <el-skeleton :rows="8" animated />
      </div>
      
      <div v-else-if="roomStats" class="room-detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">房间号：</span>
              <span class="value">{{ roomStats.basicInfo.roomCode }}</span>
            </div>
            <div class="detail-item">
              <span class="label">房间名称：</span>
              <span class="value">{{ roomStats.basicInfo.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">房主：</span>
              <span class="value">{{ roomStats.basicInfo.ownerName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">状态：</span>
              <span class="value" :class="{ active: roomStats.basicInfo.status === 1, inactive: roomStats.basicInfo.status === 0 }">
                {{ roomStats.basicInfo.status === 1 ? '活跃' : '已关闭' }}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDetailTime(roomStats.basicInfo.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">运行天数：</span>
              <span class="value">{{ roomStats.timeStats.roomDuration }}天</span>
            </div>
          </div>
        </div>

        <!-- 用户统计 -->
        <div class="detail-section">
          <h4>用户统计</h4>
          <div class="user-stats">
            <div class="stats-summary">
              <span>总用户：{{ roomStats.userStats.totalUsers }}</span>
              <span>活跃：{{ roomStats.userStats.activeUsers }}</span>
              <span>已离开：{{ roomStats.userStats.inactiveUsers }}</span>
            </div>
            <div class="user-list">
              <div 
                v-for="user in roomStats.userStats.userList" 
                :key="user.id"
                class="user-item"
              >
                <UserAvatar :nickname="user.nickname" :size="32" />
                <div class="user-info">
                  <div class="user-name">
                    {{ user.nickname }}
                    <span v-if="user.isOwner" class="owner-badge">房主</span>
                  </div>
                  <div class="user-balance" :class="{ positive: user.balance >= 0, negative: user.balance < 0 }">
                    ¥{{ user.balance }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 交易统计 -->
        <div class="detail-section">
          <h4>交易统计</h4>
          <div class="transaction-stats">
            <div class="stats-summary">
              <span>总交易：{{ roomStats.transactionStats.totalTransactions }}笔</span>
              <span>总金额：¥{{ roomStats.transactionStats.totalAmount }}</span>
              <span>平均金额：¥{{ roomStats.transactionStats.averageTransactionAmount }}</span>
            </div>
            
            <!-- 用户输赢统计 -->
            <div class="user-transaction-stats" v-if="roomStats.transactionStats.userStats.length > 0">
              <h5>用户输赢统计</h5>
              <div class="transaction-user-list">
                <div 
                  v-for="userStat in roomStats.transactionStats.userStats" 
                  :key="userStat.nickname"
                  class="transaction-user-item"
                >
                  <div class="user-name">{{ userStat.nickname }}</div>
                  <div class="transaction-amounts">
                    <div class="amount-item">
                      <span class="label">支付：</span>
                      <span class="value pay">¥{{ userStat.totalPaid }}</span>
                    </div>
                    <div class="amount-item">
                      <span class="label">收入：</span>
                      <span class="value receive">¥{{ userStat.totalReceived }}</span>
                    </div>
                    <div class="amount-item">
                      <span class="label">净值：</span>
                      <span class="value net" :class="{ positive: userStat.netAmount >= 0, negative: userStat.netAmount < 0 }">
                        ¥{{ userStat.netAmount }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 最近交易 -->
            <div class="recent-transactions" v-if="roomStats.transactionStats.recentTransactions.length > 0">
              <h5>最近交易</h5>
              <div class="transaction-list">
                <div 
                  v-for="transaction in roomStats.transactionStats.recentTransactions" 
                  :key="transaction.id"
                  class="transaction-item"
                >
                  <div class="transaction-info">
                    <span class="from-user">{{ transaction.fromUserName }}</span>
                    <span class="action">付给</span>
                    <span class="to-user">{{ transaction.toUserName }}</span>
                    <span class="amount">¥{{ transaction.amount }}</span>
                  </div>
                  <div class="transaction-time">{{ formatTime(transaction.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roomDetailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElDialog, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElSkeleton, ElIcon } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import Toast from '@/utils/toast.js';
import PageNavigation from '@/components/PageNavigation.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { getAdminRoomsHistory, getAdminRoomStats } from '@/api/room';

// 状态管理
const loading = ref(false);
const roomDetailLoading = ref(false);
const roomDetailVisible = ref(false);
const selectedRoom = ref(null);
const roomStats = ref(null);

// 筛选条件
const filters = reactive({
  keyword: '',
  status: undefined
});

// 房间列表
const roomList = ref([]);

// 分页信息
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
});

// 计算属性 - 统计数据
const totalRooms = computed(() => roomList.value.length);
const activeRooms = computed(() => roomList.value.filter(room => room.status === 1).length);
const totalUsers = computed(() => roomList.value.reduce((sum, room) => sum + room.totalUsers, 0));
const totalAmount = computed(() => roomList.value.reduce((sum, room) => sum + room.totalAmount, 0).toFixed(2));

// 加载房间列表
const loadRoomList = async () => {
  try {
    loading.value = true;
    
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    };
    
    // 清理空值
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });
    
    const response = await getAdminRoomsHistory(params);
    
    if (response.data && response.data.result === 1) {
      const data = response.data.data;
      roomList.value = data.rooms;
      pagination.total = data.total;
      pagination.totalPages = data.totalPages;
    } else {
      Toast.error(response.data?.error_msg || '获取房间列表失败');
    }
  } catch (error) {
    console.error('加载房间列表失败:', error);
    Toast.error('网络错误，加载房间列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索处理（防抖）
let searchTimer = null;
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    pagination.page = 1;
    loadRoomList();
  }, 500);
};

// 筛选变化处理
const handleFilterChange = () => {
  pagination.page = 1;
  loadRoomList();
};

// 分页变化处理
const handlePageChange = (page) => {
  pagination.page = page;
  loadRoomList();
};

// 点击房间卡片
const handleRoomClick = async (room) => {
  selectedRoom.value = room;
  roomDetailVisible.value = true;
  roomStats.value = null;
  
  try {
    roomDetailLoading.value = true;
    
    const response = await getAdminRoomStats(room.roomCode);
    
    if (response.data && response.data.result === 1) {
      roomStats.value = response.data.data;
    } else {
      Toast.error(response.data?.error_msg || '获取房间统计失败');
    }
  } catch (error) {
    console.error('获取房间统计失败:', error);
    Toast.error('网络错误，获取房间统计失败');
  } finally {
    roomDetailLoading.value = false;
  }
};

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (targetDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' +
           date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  }
};

// 格式化详细时间
const formatDetailTime = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString('zh-CN') + ' ' + 
         date.toLocaleTimeString('zh-CN', { hour12: false });
};

// 生命周期
onMounted(() => {
  loadRoomList();
});
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px 20px;
  
  .admin-content {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.filter-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .filter-row {
    display: flex;
    gap: 16px;
    align-items: center;
    
    .search-input {
      flex: 1;
      max-width: 400px;
    }
    
    .status-select {
      width: 150px;
    }
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  
  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8px;
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }
  }
}

.rooms-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      color: #fff;
      margin: 0;
      font-size: 1.2rem;
    }
    
    .pagination-info {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }
  }
}

.loading-container {
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
  }
  
  .empty-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
  }
}

.rooms-list {
  display: grid;
  gap: 16px;
  
  .room-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .room-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .room-title {
        .room-name {
          color: #fff;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .room-code {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-left: 8px;
        }
      }
      
      .room-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        
        &.active {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        
        &.inactive {
          background: rgba(158, 158, 158, 0.2);
          color: #9e9e9e;
        }
      }
    }
    
    .room-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
      
      .info-item {
        .label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
        }
        
        .value {
          color: #fff;
          font-weight: 500;
          
          &.amount {
            color: #81c784;
          }
        }
      }
    }
    
    .room-time {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      
      .created-time {
        margin-bottom: 4px;
      }
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

// 房间详情弹窗样式
:deep(.room-detail-dialog) {
  .el-dialog {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.room-detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    h4 {
      color: #333;
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      font-weight: 600;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 8px;
    }
    
    h5 {
      color: #555;
      margin: 16px 0 12px 0;
      font-size: 1rem;
      font-weight: 500;
    }
  }
  
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 12px;
  }
  
  .detail-item {
    .label {
      color: #666;
      font-weight: 500;
    }
    
    .value {
      color: #333;
      margin-left: 8px;
      
      &.active {
        color: #4caf50;
      }
      
      &.inactive {
        color: #9e9e9e;
      }
    }
  }
  
  .user-stats {
    .stats-summary {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .user-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      
      .user-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: #f9f9f9;
        border-radius: 8px;
        
        .user-info {
          flex: 1;
          
          .user-name {
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
            
            .owner-badge {
              background: #ff9800;
              color: white;
              font-size: 0.7rem;
              padding: 2px 6px;
              border-radius: 10px;
              margin-left: 6px;
            }
          }
          
          .user-balance {
            font-size: 0.9rem;
            font-weight: 500;
            
            &.positive {
              color: #4caf50;
            }
            
            &.negative {
              color: #f44336;
            }
          }
        }
      }
    }
  }
  
  .transaction-stats {
    .stats-summary {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .user-transaction-stats {
      margin-bottom: 20px;
      
      .transaction-user-list {
        .transaction-user-item {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          
          .user-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }
          
          .transaction-amounts {
            display: flex;
            gap: 16px;
            
            .amount-item {
              .label {
                color: #666;
                font-size: 0.8rem;
              }
              
              .value {
                margin-left: 4px;
                font-weight: 500;
                
                &.pay {
                  color: #f44336;
                }
                
                &.receive {
                  color: #4caf50;
                }
                
                &.net {
                  &.positive {
                    color: #4caf50;
                  }
                  
                  &.negative {
                    color: #f44336;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    .recent-transactions {
      .transaction-list {
        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f9f9f9;
          border-radius: 6px;
          margin-bottom: 6px;
          
          .transaction-info {
            .from-user, .to-user {
              font-weight: 500;
              color: #333;
            }
            
            .action {
              color: #666;
              margin: 0 8px;
            }
            
            .amount {
              color: #4caf50;
              font-weight: 600;
            }
          }
          
          .transaction-time {
            font-size: 0.8rem;
            color: #999;
          }
        }
      }
    }
  }
}

.dialog-footer {
  text-align: center;
}

// 响应式设计
@media (max-width: 768px) {
  .admin-page {
    padding: 70px 16px 16px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 12px;
    
    .search-input {
      max-width: none;
    }
    
    .status-select {
      width: 100%;
    }
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .room-info {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .user-list {
    grid-template-columns: 1fr;
  }
  
  .transaction-amounts {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 