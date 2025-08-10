/*
 * @Description: 根module
 * @Date: 2022-08-20 16:53:01
 * @Author: trastor
 * @LastEditTime: 2022-09-18 22:25:09
 */
import { Module } from '@nestjs/common';
import { RoomModule }  from './bookkeeping/room';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entity/bookkeeping/room';
import { RoomUser } from '../entity/bookkeeping/roomUser.entity';
import { ExpenseRecord } from '../entity/bookkeeping/expenseRecord.entity';
import { RedisService } from '../service/redis.service';
import { AppController } from '../controller/app.controller';
import * as dotenv from 'dotenv';

// 确保环境变量在模块配置前加载
dotenv.config();

@Module({
    imports: [
        RoomModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'play',
            entities: [Room, RoomUser, ExpenseRecord],
            autoLoadEntities: true,
            synchronize: true
        })
    ],
    controllers: [AppController],
    providers: [RedisService],
    exports: [RedisService]
})
export class AppModule {}
