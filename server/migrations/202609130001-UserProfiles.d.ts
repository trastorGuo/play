import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UserProfiles2026091300010 implements MigrationInterface {
    name: string;
    up(q: QueryRunner): Promise<void>;
    down(q: QueryRunner): Promise<void>;
}
