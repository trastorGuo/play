import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class V2Schema2026091200010 implements MigrationInterface {
    name: string;
    up(q: QueryRunner): Promise<void>;
    down(q: QueryRunner): Promise<void>;
}
