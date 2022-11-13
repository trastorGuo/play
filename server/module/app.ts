/*
 * @Description: 根module
 * @Date: 2022-08-20 16:53:01
 * @Author: trastor
 * @LastEditTime: 2022-09-18 22:25:09
 */
import { Module } from '@nestjs/common';
import { TestModule }  from './test/test';
import { RoomModule }  from './bookkeeping/room';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TestModule,
        RoomModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '45.40.200.146',
            port: 3306,
            username: 'trastor',
            password: 'ab1997gz0314',
            database: 'play',
            entities: [__dirname + '/**/*.ts'],
            autoLoadEntities: true,
            synchronize: true
        })
    ]
})
export class AppModule {}
