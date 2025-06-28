/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: trastor
 * @LastEditTime: 2022-09-18 21:24:36
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../../entity/bookkeeping/room';
import { RoomUser } from '../../entity/bookkeeping/roomUser.entity';
import { ExpenseRecord } from '../../entity/bookkeeping/expenseRecord.entity';
import { RoomController } from '../../controller/bookkeeping/room';
import { RoomService } from '../../service/bookkeeping/room';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomUser, ExpenseRecord])],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
