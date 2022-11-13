/*
 * @Description: 房间
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 23:14:08
 */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RoomService } from '../../service/bookkeeping/room';

@Controller("room")
export class RoomController {
    constructor(private readonly roomService: RoomService) { }

    @Get()
    async getRoomData(@Query() param: any) {
        return await this.roomService.findOne(param.roomId);
    }

    /*
     * 创建一个房间，房间号自增
     * @param param { userId: number }
     * @returns 
     */
    @Post("create")
    async created(@Body() param: any) {
        return this.roomService.create(param.params.userId);
    }
}
