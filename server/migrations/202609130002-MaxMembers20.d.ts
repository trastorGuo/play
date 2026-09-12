import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class MaxMembers2026091300020 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
