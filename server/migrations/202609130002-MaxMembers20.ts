import { MigrationInterface, QueryRunner } from 'typeorm';

export class MaxMembers2026091300020 implements MigrationInterface {
  name = 'MaxMembers2026091300020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE rooms_v2 DROP CHECK ck_v2_rooms_max');
    await queryRunner.query('ALTER TABLE rooms_v2 MODIFY max_members TINYINT UNSIGNED NOT NULL DEFAULT 20');
    await queryRunner.query('ALTER TABLE rooms_v2 ADD CONSTRAINT ck_v2_rooms_max CHECK (max_members BETWEEN 2 AND 20)');
    await queryRunner.query('UPDATE rooms_v2 SET max_members = 20 WHERE max_members = 10');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE rooms_v2 DROP CHECK ck_v2_rooms_max');
    await queryRunner.query('UPDATE rooms_v2 SET max_members = 10 WHERE max_members > 10');
    await queryRunner.query('ALTER TABLE rooms_v2 MODIFY max_members TINYINT UNSIGNED NOT NULL DEFAULT 10');
    await queryRunner.query('ALTER TABLE rooms_v2 ADD CONSTRAINT ck_v2_rooms_max CHECK (max_members BETWEEN 2 AND 10)');
  }
}
