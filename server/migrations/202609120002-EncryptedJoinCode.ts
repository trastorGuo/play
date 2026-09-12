import { MigrationInterface, QueryRunner } from 'typeorm';

export class EncryptedJoinCode2026091200020 implements MigrationInterface {
  name = 'EncryptedJoinCode2026091200020';
  async up(q: QueryRunner) {
    await q.query('ALTER TABLE rooms_v2 ADD COLUMN join_code_ciphertext VARBINARY(32) NULL AFTER join_code_hash, ADD COLUMN join_code_iv BINARY(12) NULL AFTER join_code_ciphertext, ADD COLUMN join_code_tag BINARY(16) NULL AFTER join_code_iv');
  }
  async down(q: QueryRunner) {
    await q.query('ALTER TABLE rooms_v2 DROP COLUMN join_code_tag, DROP COLUMN join_code_iv, DROP COLUMN join_code_ciphertext');
  }
}
