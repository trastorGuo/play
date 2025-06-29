import { post, get } from '@/common/lib/axios';

// 创建房间
export const createRoom = (data) => {
  return post('/api/room/create', data);
};

// 查询房间信息
export const getRoomInfo = (roomCode) => {
  return get(`/api/room/info/${roomCode}`);
};

// 加入房间
export const joinRoom = (data) => {
  return post('/api/room/join', data);
};



// 获取房间记录
export const getRoomRecords = (roomCode) => {
  return get(`/api/room/records/${roomCode}`);
};

// 更新昵称
export const updateNickname = (data) => {
  return post('/api/room/updateNickname', data);
};

// 添加支出记录
export const addExpense = (data) => {
  return post('/api/room/addExpense', data);
};

// 离开房间
export const leaveRoom = (roomCode, userId) => {
  return post(`/api/room/leave`, { roomCode, userId });
}; 