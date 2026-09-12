import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfiles2026091300010 implements MigrationInterface {
  name = 'UserProfiles2026091300010';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE profile_avatars_v2 (id CHAR(36) NOT NULL, user_id BIGINT UNSIGNED NOT NULL, storage_key VARCHAR(255) NOT NULL, mime_type VARCHAR(64) NOT NULL, size_bytes INT UNSIGNED NOT NULL, sha256 CHAR(64) NOT NULL, created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), PRIMARY KEY(id), KEY idx_profile_avatars_user(user_id), CONSTRAINT fk_v2_profile_avatars_user FOREIGN KEY(user_id) REFERENCES users_v2(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await q.query(`ALTER TABLE users_v2 ADD COLUMN avatar_file_id CHAR(36) NULL AFTER display_name, ADD KEY idx_users_v2_avatar_file(avatar_file_id), ADD CONSTRAINT fk_v2_users_avatar FOREIGN KEY(avatar_file_id) REFERENCES profile_avatars_v2(id) ON DELETE SET NULL`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE users_v2 DROP FOREIGN KEY fk_v2_users_avatar, DROP INDEX idx_users_v2_avatar_file, DROP COLUMN avatar_file_id');
    await q.query('DROP TABLE IF EXISTS profile_avatars_v2');
  }
}
