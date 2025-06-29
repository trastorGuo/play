import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Room } from './room';

@Entity('room_users')
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '房间ID' })
  roomId: number;

  @Column({ type: 'int', comment: '用户ID' })
  userId: number;

  @Column({ type: 'varchar', length: 50, comment: '用户昵称' })
  nickname: string;

  // 头像不存储在数据库中，前端根据nickname生成

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '当前余额' })
  balance: number;

  @Column({ type: 'int', default: 1, comment: '状态：1-在房间，0-已离开' })
  status: number;



  @CreateDateColumn({ comment: '加入时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  // 关联房间
  @ManyToOne(() => Room, room => room.roomUsers)
  @JoinColumn({ name: 'roomId' })
  room: Room;
} 