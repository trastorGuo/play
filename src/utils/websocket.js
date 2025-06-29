import { io } from 'socket.io-client';
import Toast from './toast';

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.eventHandlers = new Map();
        this.currentRoom = null;
        this.userInfo = null;
    }

    // 连接WebSocket
    connect(serverUrl = null) {
        if (this.socket && this.isConnected) {
            return Promise.resolve();
        }

        const url = serverUrl || window.location.origin;
        
        return new Promise((resolve, reject) => {
            try {
                this.socket = io(url, {
                    transports: ['websocket', 'polling'],
                    timeout: 20000,
                    forceNew: true,
                    reconnection: true,
                    reconnectionAttempts: this.maxReconnectAttempts,
                    reconnectionDelay: this.reconnectDelay
                });

                // 连接成功
                this.socket.on('connect', () => {
                    console.log('WebSocket连接成功');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    resolve();
                });

                // 连接失败
                this.socket.on('connect_error', (error) => {
                    console.error('WebSocket连接失败:', error);
                    this.isConnected = false;
                    if (this.reconnectAttempts === 0) {
                        reject(error);
                    }
                });

                // 断开连接
                this.socket.on('disconnect', (reason) => {
                    console.log('WebSocket断开连接:', reason);
                    this.isConnected = false;
                    
                    // 自动重连
                    if (reason === 'io server disconnect') {
                        // 服务器主动断开，需要手动重连
                        this.reconnect();
                    }
                });

                // 重连成功
                this.socket.on('reconnect', () => {
                    console.log('WebSocket重连成功');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    
                    // 重新加入房间
                    if (this.currentRoom && this.userInfo) {
                        this.joinRoom(this.currentRoom, this.userInfo.userId, this.userInfo.nickname);
                    }
                });

                // 重连失败
                this.socket.on('reconnect_failed', () => {
                    console.error('WebSocket重连失败');
                    Toast.error('连接已断开，请刷新页面重试');
                });

                // 设置事件监听器
                this.setupEventListeners();

            } catch (error) {
                console.error('创建WebSocket连接失败:', error);
                reject(error);
            }
        });
    }

    // 设置事件监听器
    setupEventListeners() {
        if (!this.socket) return;

        // 加入房间成功
        this.socket.on('roomJoined', (data) => {
            console.log('成功加入房间:', data);
            this.currentRoom = data.roomCode;
            this.emit('roomJoined', data);
        });

        // 用户加入房间
        this.socket.on('userJoined', (data) => {
            console.log('新用户加入:', data);
            this.emit('userJoined', data);
        });

        // 用户离开房间
        this.socket.on('userLeft', (data) => {
            console.log('用户离开:', data);
            this.emit('userLeft', data);
        });

        // 收到新的支付记录
        this.socket.on('expenseAdded', (data) => {
            console.log('新的支付记录:', data);
            this.emit('expenseAdded', data);
        });

        // 昵称更新
        this.socket.on('nicknameUpdated', (data) => {
            console.log('用户昵称更新:', data);
            this.emit('nicknameUpdated', data);
        });

        // 错误处理
        this.socket.on('error', (data) => {
            console.error('WebSocket错误:', data);
            Toast.error(data.message || '连接出现错误');
        });

        // 房间数据更新
        this.socket.on('roomDataUpdated', (data) => {
            console.log('房间数据更新:', data);
            this.emit('roomDataUpdated', data);
        });
    }

    // 加入房间
    joinRoom(roomCode, userId, nickname) {
        if (!this.socket || !this.isConnected) {
            console.error('WebSocket未连接');
            return false;
        }

        this.currentRoom = roomCode;
        this.userInfo = { userId, nickname };

        this.socket.emit('joinRoom', {
            roomCode,
            userId: String(userId),
            nickname
        });

        return true;
    }

    // 离开房间
    leaveRoom(roomCode = null) {
        if (!this.socket || !this.isConnected) {
            return;
        }

        const targetRoom = roomCode || this.currentRoom;
        if (targetRoom) {
            this.socket.emit('leaveRoom', {
                roomCode: targetRoom
            });
        }

        this.currentRoom = null;
        this.userInfo = null;
    }

    // 断开连接
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.currentRoom = null;
            this.userInfo = null;
            this.eventHandlers.clear();
        }
    }

    // 重连
    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('达到最大重连次数，停止重连');
            Toast.error('连接已断开，请刷新页面重试');
        }
    }

    // 添加事件监听器
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    // 移除事件监听器
    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    // 触发事件
    emit(event, data) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error('事件处理器执行错误:', error);
                }
            });
        }
    }

    // 获取连接状态
    isSocketConnected() {
        return this.isConnected && this.socket && this.socket.connected;
    }

    // 获取当前房间
    getCurrentRoom() {
        return this.currentRoom;
    }

    // 获取用户信息
    getUserInfo() {
        return this.userInfo;
    }
}

// 创建全局实例
const wsManager = new WebSocketManager();

export default wsManager; 