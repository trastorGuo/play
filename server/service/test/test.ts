/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 21:56:05
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/bookkeeping/users.entity';
import { Repository } from 'typeorm';
import { exception } from '../../utils/exception';

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    getHello(): string {
        exception({ code: 101, content: "id 不存在" });
        return 'Hello World!';
    }

    async findOne(id: string) {
        return await this.usersRepository.findOne({ where: { id: parseInt(id, 10) } });
    }
}