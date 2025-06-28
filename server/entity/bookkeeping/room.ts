/*
 * @Description: 用户实体
 * @Date: 2022-08-21 22:30:07
 * @Author: trastor
 * @LastEditTime: 2022-09-18 23:02:09
 */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoomUser } from './roomUser.entity';
import { ExpenseRecord } from './expenseRecord.entity';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true, comment: '房间号' })
    roomCode: string;

    @Column({ type: 'varchar', length: 50, comment: '房间名称' })
    name: string;

    @Column({ type: 'int', nullable: false, comment: '房主用户ID' })
    ownerId: number;

    @Column({ type: 'varchar', length: 50, nullable: false, comment: '房主名称' })
    ownerName: string;

    @Column({ type: 'int', default: 1, comment: '房间状态：1-活跃，0-已关闭' })
    status: number;

    @Column({ type: 'int', default: 0, comment: '当前人数' })
    currentUsers: number;

    @Column({ type: 'int', default: 10, comment: '最大人数' })
    maxUsers: number;

    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;

    @UpdateDateColumn({ comment: '更新时间' })
    updatedAt: Date;

    // 关联房间用户
    @OneToMany(() => RoomUser, roomUser => roomUser.room)
    roomUsers: RoomUser[];

    // 关联支出记录
    @OneToMany(() => ExpenseRecord, expenseRecord => expenseRecord.room)
    expenseRecords: ExpenseRecord[];
}

