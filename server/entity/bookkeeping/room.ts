/*
 * @Description: 用户实体
 * @Date: 2022-08-21 22:30:07
 * @Author: trastor
 * @LastEditTime: 2022-09-18 23:02:09
 */
import { Base } from '../base.entity';
import { Entity, Column } from 'typeorm';

@Entity('room')
export class Room extends Base {
    /**
     * 房间状态
     * 已创建、进行中、已完成
     */
    @Column({
        default: "created",
        select: false,
        name: 'status'
    })
    status?: "created" | "processing" | "finished";
}

