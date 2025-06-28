import multiavatar from '@multiavatar/multiavatar';

// 生成唯一用户ID
export const generateUserId = () => {
  // 基于时间戳 + 随机数 + 浏览器指纹
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const userAgent = navigator.userAgent;
  const screenInfo = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // 创建浏览器指纹
  const fingerprint = btoa(`${userAgent}-${screenInfo}-${timezone}`).substr(0, 8);
  
  return `${timestamp}_${random}_${fingerprint}`;
};

// 获取或创建用户ID
export const getUserId = () => {
  let userId = localStorage.getItem('card_game_user_id');
  
  if(!userId) {
    userId = generateUserId();
    localStorage.setItem('card_game_user_id', userId);
    
    // 同时保存到 sessionStorage 作为会话标识
    sessionStorage.setItem('card_game_session_id', `session_${Date.now()}`);
  }
  
  return userId;
};

// 获取用户会话信息
export const getUserSession = () => {
  const userId = getUserId();
  const sessionId = sessionStorage.getItem('card_game_session_id');
  const lastActiveTime = localStorage.getItem('card_game_last_active');
  
  // 更新最后活跃时间
  localStorage.setItem('card_game_last_active', Date.now().toString());
  
  return {
    userId,
    sessionId,
    lastActiveTime: lastActiveTime ? parseInt(lastActiveTime) : Date.now(),
    isNewSession: !sessionId
  };
};

// 根据昵称生成头像
export const generateAvatar = (nickname) => {
  if(!nickname || nickname.trim() === '') {
    return generateDefaultAvatar();
  }
  
  try {
    // 生成头像ID，而不是完整的SVG数据
    // 使用昵称的hash值作为头像标识
    const hash = nickname.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // 返回头像标识符，前端将使用此标识符生成头像
    return `avatar_${hash % 1000}_${nickname.length}`;
  } catch(error) {
    console.error('生成头像失败:', error);
    return generateDefaultAvatar();
  }
};

// 生成默认头像
const generateDefaultAvatar = () => {
  const timestamp = Date.now();
  return `avatar_${timestamp % 1000}_0`;
};

// 验证用户是否为同一用户（用于重新进入房间时的身份验证）
export const validateUserIdentity = (storedUserInfo, currentUserInfo) => {
  if(!storedUserInfo || !currentUserInfo) return false;
  
  // 检查多个维度来确认用户身份
  const checks = [
    storedUserInfo.userId === currentUserInfo.userId,
    storedUserInfo.fingerprint === currentUserInfo.fingerprint,
    // 允许一定的时间差（比如7天内）
    (Date.now() - storedUserInfo.lastActiveTime) < 7 * 24 * 60 * 60 * 1000
  ];
  
  return checks.filter(Boolean).length >= 2; // 至少匹配2个条件
};

// 清理用户数据（退出应用时调用）
export const clearUserData = () => {
  localStorage.removeItem('card_game_user_id');
  sessionStorage.removeItem('card_game_session_id');
  localStorage.removeItem('card_game_last_active');
};

// 检查昵称是否有效
export const validateNickname = (nickname) => {
  if(!nickname || typeof nickname !== 'string') {
    return { valid: false, message: '昵称不能为空' };
  }
  
  const trimmed = nickname.trim();
  if(trimmed.length === 0) {
    return { valid: false, message: '昵称不能为空' };
  }
  
  if(trimmed.length > 10) {
    return { valid: false, message: '昵称不能超过10个字符' };
  }
  
  // 检查特殊字符
  const validPattern = /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/;
  if(!validPattern.test(trimmed)) {
    return { valid: false, message: '昵称只能包含中文、英文、数字、下划线和短横线' };
  }
  
  return { valid: true, message: '' };
};

// 房间用户会话管理
export const RoomUserSession = {
  // 保存用户在房间中的信息
  saveRoomUser(roomId, userInfo) {
    const key = `room_${roomId}_user_${getUserId()}`;
    const data = {
      ...userInfo,
      lastEnterTime: Date.now(),
      userId: getUserId(),
      fingerprint: this.generateFingerprint()
    };
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  },

  // 获取用户在房间中的历史信息
  getRoomUser(roomId) {
    const key = `room_${roomId}_user_${getUserId()}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // 检查用户是否第一次进入房间
  isFirstTimeEnter(roomId) {
    const userData = this.getRoomUser(roomId);
    return !userData || !userData.nickname;
  },

  // 更新用户在房间中的昵称
  updateRoomUserNickname(roomId, newNickname) {
    const userData = this.getRoomUser(roomId);
    if(userData) {
      userData.nickname = newNickname;
      userData.lastUpdateTime = Date.now();
      const key = `room_${roomId}_user_${getUserId()}`;
      localStorage.setItem(key, JSON.stringify(userData));
    }
  },

  // 生成浏览器指纹
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substr(0, 16);
  },

  // 清理房间用户数据
  clearRoomUser(roomId) {
    const key = `room_${roomId}_user_${getUserId()}`;
    localStorage.removeItem(key);
  }
};

// SSE连接管理
export const SSEManager = {
  connections: new Map(),

  // 创建SSE连接
  connect(roomId, onMessage, onError) {
    const url = `/api/room/${roomId}/events`;
    const eventSource = new EventSource(url);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch(error) {
        console.error('解析SSE消息失败:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error);
      if(onError) onError(error);
      
      // 自动重连
      setTimeout(() => {
        if(eventSource.readyState === EventSource.CLOSED) {
          this.connect(roomId, onMessage, onError);
        }
      }, 3000);
    };

    this.connections.set(roomId, eventSource);
    return eventSource;
  },

  // 断开SSE连接
  disconnect(roomId) {
    const connection = this.connections.get(roomId);
    if(connection) {
      connection.close();
      this.connections.delete(roomId);
    }
  },

  // 断开所有连接
  disconnectAll() {
    this.connections.forEach((connection) => {
      connection.close();
    });
    this.connections.clear();
  }
};
