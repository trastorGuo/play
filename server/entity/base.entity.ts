/*
 * @Description: base 实体
 * @Date: 2022-08-21 22:54:22
 * @Author: 
 * @LastEditTime: 2022-09-18 23:01:02
 */
import {
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn
} from 'typeorm';

export abstract class Base {
    /**
     * 主键id
     */
    @PrimaryGeneratedColumn()
    id?: number;

    /**
     * 创建时间
     */
    @CreateDateColumn({ name: 'create_time' })
    createTime?: Date;

    /**
     * 创建人
     */
    @Column()
    creator: string;

    /**
     * 更新时间
     */
    @UpdateDateColumn({ name: 'update_time' })
    updateTime?: Date;

    /**
     * 更新人
     */
    @Column({ nullable: true })
    updater?: string;

    /**
     * 逻辑删除
     */
    @Column({
        default: 0,
        select: false,
        name: 'del_flag'
    })
    delFlag?: number;
}