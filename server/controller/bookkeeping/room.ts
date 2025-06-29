/*
 * @Description: 房间
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 23:14:08
 */
import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RoomService } from '../../service/bookkeeping/room';

@Controller('api/room')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }

    // 创建房间
    @Post('create')
    async createRoom(@Body() body: {
        name?: string;
        ownerId: number;
        ownerName: string;
    }) {
        try {
            // 验证必需参数
            if(!body.ownerId || !body.ownerName) {
                return {
                    result: 0,
                    error_msg: '缺少必需参数：ownerId和ownerName'
                };
            }

            // 如果没有提供name，则使用默认名称
            const roomData = {
                name: body.name || `${body.ownerName}的房间`,
                ownerId: body.ownerId,
                ownerName: body.ownerName
            };
            const room = await this.roomService.createRoom(roomData);
            return {
                result: 1,
                data: room,
                message: '房间创建成功'
            };
        } catch(error: any) {
            console.error('创建房间失败:', error);
            return {
                result: 0,
                error_msg: error.message || '创建房间失败'
            };
        }
    }

    // 查询房间信息
    @Get('info/:roomCode')
    async getRoomInfo(@Param('roomCode') roomCode: string) {
        try {
            const room = await this.roomService.getRoomInfo(roomCode);
            return {
                result: 1,
                data: room
            };
        } catch(error: any) {
            return {
                result: 0,
                error_msg: error.message || '查询房间失败'
            };
        }
    }



    // 获取房间记录
    @Get('records/:roomCode')
    async getRoomRecords(@Param('roomCode') roomCode: string) {
        try {
            const room = await this.roomService.getRoomInfo(roomCode);
            const records = await this.roomService.getRoomRecords(room.id);
            return {
                result: 1,
                data: records
            };
        } catch(error: any) {
            return {
                result: 0,
                error_msg: error.message || '获取记录失败'
            };
        }
    }

    // 加入房间
    @Post('join')
    async joinRoom(@Body() body: {
        roomCode: string;
        userId: number;
        nickname: string;
    }) {
        try {
            const roomUser = await this.roomService.addUserToRoom(body.roomCode, {
                userId: body.userId,
                nickname: body.nickname
            });
            return {
                result: 1,
                data: roomUser,
                message: '加入房间成功'
            };
        } catch(error: any) {
            return {
                result: 0,
                error_msg: error.message || '加入房间失败'
            };
        }
    }



    // 更新昵称
    @Post('updateNickname')
    async updateUserNickname(@Body() body: {
        roomCode: string;
        userId: number;
        nickname: string;
    }) {
        try {
            const room = await this.roomService.getRoomInfo(body.roomCode);
            const roomUser = await this.roomService.updateUserNickname(
                room.id,
                body.userId,
                body.nickname
            );
            return {
                result: 1,
                data: roomUser,
                message: '昵称更新成功'
            };
        } catch(error: any) {
            return {
                result: 0,
                error_msg: error.message || '更新昵称失败'
            };
        }
    }

    // 添加支出记录
    @Post('addExpense')
    async addExpenseRecord(@Body() body: {
        roomCode: string;
        fromUserId: number;
        toUserId: number;
        amount: number;
        operatorId: number;
    }) {
        try {
            const room = await this.roomService.getRoomInfo(body.roomCode);
            
            // 获取用户信息
            const users = await this.roomService.getRoomUsers(room.id);
            const fromUser = users.find(u => u.userId === body.fromUserId);
            const toUser = users.find(u => u.userId === body.toUserId);
            const operator = users.find(u => u.userId === body.operatorId);
            
            if(!fromUser || !toUser || !operator) {
                throw new Error('用户不存在');
            }
            
            const recordData = {
                fromUserId: body.fromUserId,
                fromUserName: fromUser.nickname,
                toUserId: body.toUserId,
                toUserName: toUser.nickname,
                amount: body.amount,
                type: 'pay',
                operatorName: operator.nickname
            };
            
            const record = await this.roomService.addExpenseRecord(room.id, recordData);
            return {
                result: 1,
                data: record,
                message: '记录添加成功'
            };
        } catch(error: any) {
            return {
                result: 0,
                error_msg: error.message || '添加记录失败'
            };
        }
    }

    // 离开房间
    @Post('leave')
    async leaveRoom(@Body() body: {
        roomCode: string;
        userId: number;
    }) {
        try {
            const room = await this.roomService.getRoomInfo(body.roomCode);
            await this.roomService.leaveRoom(room.id, body.userId);
            return {
                result: 1,
                message: '离开房间成功'
            };
        } catch(error: any) {
            return {
                result: 0,
                error_msg: error.message || '离开房间失败'
            };
        }
    }

    // SSE事件流端点
    @Get(':roomCode/events')
    async subscribeToRoomEvents(
        @Param('roomCode') roomCode: string,
        @Res() response: Response
    ) {
        try {
            // 验证房间是否存在
            await this.roomService.getRoomInfo(roomCode);
            
            // 处理SSE连接
            this.roomService.handleSSEConnection(roomCode, response);
        } catch(error: any) {
            response.status(404).json({
                result: 0,
                error_msg: error.message || '房间不存在'
            });
        }
    }
}
