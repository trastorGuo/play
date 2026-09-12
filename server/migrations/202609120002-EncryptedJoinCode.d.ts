import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class EncryptedJoinCode2026091200020 implements MigrationInterface {
    name: string;
    up(q: QueryRunner): Promise<void>;
    down(q: QueryRunner): Promise<void>;
}
