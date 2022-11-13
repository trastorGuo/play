/*
 * @Description: 
 * @Date: 2022-08-20 14:12:09
 * @Author: 
 * @LastEditTime: 2022-09-18 23:08:26
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../../entity/bookkeeping/room';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private usersRepository: Repository<Room>
    ) {}

    async create(user: string) {
        const room: Room = {
            creator: user
        };
        return await this.usersRepository.save(room);
    }

    async findOne(id: string) {
        return await this.usersRepository.findOne({ where: { id: parseInt(id, 10) } });
    }
}