import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Room } from './room';

@Entity('expense_records')
export class ExpenseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '房间ID' })
  roomId: number;

  @Column({ type: 'int', comment: '付款用户ID' })
  fromUserId: number;

  @Column({ type: 'varchar', length: 50, comment: '付款用户昵称' })
  fromUserName: string;

  @Column({ type: 'int', comment: '收款用户ID' })
  toUserId: number;

  @Column({ type: 'varchar', length: 50, comment: '收款用户昵称' })
  toUserName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '金额' })
  amount: number;

  @Column({ type: 'varchar', length: 20, comment: '类型：win-赢钱，lose-输钱，pay-支付，receive-收款' })
  type: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '备注' })
  note: string;

  @Column({ type: 'varchar', length: 50, comment: '操作用户昵称' })
  operatorName: string;

  @CreateDateColumn({ comment: '记录时间' })
  createdAt: Date;

  // 关联房间
  @ManyToOne(() => Room, room => room.expenseRecords)
  @JoinColumn({ name: 'roomId' })
  room: Room;
} 