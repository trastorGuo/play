/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: trastor
 * @LastEditTime: 2022-09-18 21:04:48
 */
import { Module } from '@nestjs/common';
import { TestController } from '../../controller/test/test';
import { TestService } from '../../service/test/test';
import { User } from '../../entity/bookkeeping/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TestController],
  providers: [TestService]
})
export class TestModule {}
