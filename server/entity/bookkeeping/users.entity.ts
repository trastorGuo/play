/*
 * @Description: 用户实体
 * @Date: 2022-08-21 22:30:07
 * @Author: trastor
 * @LastEditTime: 2022-08-21 22:55:53
 */
import { Base } from '../base.entity';
import { Entity, Column } from 'typeorm';

@Entity('user')
export class User extends Base {
  @Column({ name: 'user_name' })
  userName: string;

  @Column()
  password: string;

  @Column()
  gender: number;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column({ name: 'dept_id' })
  deptId: string;

  @Column({ default: 0 })
  status: number;
}