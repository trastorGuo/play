/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: trastor
 * @LastEditTime: 2022-09-18 21:24:36
 */
import { Module } from '@nestjs/common';
import { RoomController } from '../../controller/bookkeeping/room';
import { RoomService } from '../../service/bookkeeping/room';
import { Room } from '../../entity/bookkeeping/room';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
