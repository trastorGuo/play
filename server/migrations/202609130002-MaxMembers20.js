"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxMembers2026091300020 = void 0;
class MaxMembers2026091300020 {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'MaxMembers2026091300020'
        });
    }
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE rooms_v2 DROP CHECK ck_v2_rooms_max');
        await queryRunner.query('ALTER TABLE rooms_v2 MODIFY max_members TINYINT UNSIGNED NOT NULL DEFAULT 20');
        await queryRunner.query('ALTER TABLE rooms_v2 ADD CONSTRAINT ck_v2_rooms_max CHECK (max_members BETWEEN 2 AND 20)');
        await queryRunner.query('UPDATE rooms_v2 SET max_members = 20 WHERE max_members = 10');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE rooms_v2 DROP CHECK ck_v2_rooms_max');
        await queryRunner.query('UPDATE rooms_v2 SET max_members = 10 WHERE max_members > 10');
        await queryRunner.query('ALTER TABLE rooms_v2 MODIFY max_members TINYINT UNSIGNED NOT NULL DEFAULT 10');
        await queryRunner.query('ALTER TABLE rooms_v2 ADD CONSTRAINT ck_v2_rooms_max CHECK (max_members BETWEEN 2 AND 10)');
    }
}
exports.MaxMembers2026091300020 = MaxMembers2026091300020;
//# sourceMappingURL=202609130002-MaxMembers20.js.map