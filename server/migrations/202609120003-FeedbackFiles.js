"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackFiles2026091200030 = void 0;
class FeedbackFiles2026091200030 {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FeedbackFiles2026091200030'
        });
    }
    async up(q) {
        await q.query(`CREATE TABLE feedback_files_v2 (id CHAR(36) NOT NULL, user_id BIGINT UNSIGNED NOT NULL, storage_key VARCHAR(255) NOT NULL, original_name VARCHAR(255) NOT NULL, mime_type VARCHAR(64) NOT NULL, size_bytes INT UNSIGNED NOT NULL, sha256 CHAR(64) NOT NULL, created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), PRIMARY KEY(id), KEY idx_feedback_files_user(user_id), CONSTRAINT fk_v2_feedback_files_user FOREIGN KEY(user_id) REFERENCES users_v2(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await q.query(`ALTER TABLE feedback_v2 ADD CONSTRAINT fk_v2_feedback_image FOREIGN KEY(image_file_id) REFERENCES feedback_files_v2(id)`);
    }
    async down(q) {
        await q.query('ALTER TABLE feedback_v2 DROP FOREIGN KEY fk_v2_feedback_image');
        await q.query('DROP TABLE IF EXISTS feedback_files_v2');
    }
}
exports.FeedbackFiles2026091200030 = FeedbackFiles2026091200030;
//# sourceMappingURL=202609120003-FeedbackFiles.js.map