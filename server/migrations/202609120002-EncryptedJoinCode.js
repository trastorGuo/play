"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptedJoinCode2026091200020 = void 0;
class EncryptedJoinCode2026091200020 {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'EncryptedJoinCode2026091200020'
        });
    }
    async up(q) {
        await q.query('ALTER TABLE rooms_v2 ADD COLUMN join_code_ciphertext VARBINARY(32) NULL AFTER join_code_hash, ADD COLUMN join_code_iv BINARY(12) NULL AFTER join_code_ciphertext, ADD COLUMN join_code_tag BINARY(16) NULL AFTER join_code_iv');
    }
    async down(q) {
        await q.query('ALTER TABLE rooms_v2 DROP COLUMN join_code_tag, DROP COLUMN join_code_iv, DROP COLUMN join_code_ciphertext');
    }
}
exports.EncryptedJoinCode2026091200020 = EncryptedJoinCode2026091200020;
//# sourceMappingURL=202609120002-EncryptedJoinCode.js.map