-- MySQL 8.0+ schema draft for API v2.
-- Execute through a reviewed migration framework, not directly in production.

CREATE TABLE users_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  wechat_openid_hash CHAR(64) NOT NULL,
  unionid_hash CHAR(64) NULL,
  display_name VARCHAR(40) NULL,
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1 active, 0 disabled, -1 deleted',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_openid_hash (wechat_openid_hash),
  KEY idx_users_unionid_hash (unionid_hash),
  KEY idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE refresh_tokens_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  revoked_at DATETIME(3) NULL,
  replaced_by_id BIGINT UNSIGNED NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_refresh_token_hash (token_hash),
  KEY idx_refresh_user_expiry (user_id, expires_at),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users_v2(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE rooms_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_code CHAR(6) NOT NULL,
  name VARCHAR(20) NOT NULL,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  max_members TINYINT UNSIGNED NOT NULL DEFAULT 10,
  version BIGINT UNSIGNED NOT NULL DEFAULT 1,
  closed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_rooms_code (room_code),
  KEY idx_rooms_owner_updated (owner_user_id, updated_at),
  KEY idx_rooms_status_updated (status, updated_at),
  CONSTRAINT fk_rooms_owner FOREIGN KEY (owner_user_id) REFERENCES users_v2(id),
  CONSTRAINT ck_rooms_status CHECK (status IN ('active', 'closed', 'archived')),
  CONSTRAINT ck_rooms_max_members CHECK (max_members BETWEEN 2 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE room_members_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL COMMENT 'NULL only for unclaimed legacy members',
  legacy_room_user_id BIGINT NULL,
  nickname VARCHAR(10) NOT NULL,
  nickname_normalized VARCHAR(32) NOT NULL,
  balance_minor BIGINT NOT NULL DEFAULT 0,
  role VARCHAR(16) NOT NULL DEFAULT 'member',
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  joined_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  left_at DATETIME(3) NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_room_user (room_id, user_id),
  UNIQUE KEY uk_legacy_room_user (legacy_room_user_id),
  KEY idx_members_room_status (room_id, status),
  KEY idx_members_user_updated (user_id, updated_at),
  CONSTRAINT fk_members_room FOREIGN KEY (room_id) REFERENCES rooms_v2(id),
  CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users_v2(id),
  CONSTRAINT ck_members_role CHECK (role IN ('owner', 'member')),
  CONSTRAINT ck_members_status CHECK (status IN ('active', 'left', 'removed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- MySQL cannot express a portable partial unique index for active nicknames.
-- Enforce active nickname uniqueness transactionally in the service. If the
-- selected MySQL version is fixed, add a generated active_nickname column and
-- a unique key on (room_id, active_nickname).

CREATE TABLE ledger_records_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  from_member_id BIGINT UNSIGNED NOT NULL,
  to_member_id BIGINT UNSIGNED NOT NULL,
  amount_minor BIGINT UNSIGNED NOT NULL,
  type VARCHAR(16) NOT NULL DEFAULT 'transfer',
  original_record_id BIGINT UNSIGNED NULL,
  from_nickname_snapshot VARCHAR(10) NOT NULL,
  to_nickname_snapshot VARCHAR(10) NOT NULL,
  note VARCHAR(50) NULL,
  operator_user_id BIGINT UNSIGNED NOT NULL,
  idempotency_key VARCHAR(64) NOT NULL,
  reversed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_ledger_idempotency (operator_user_id, idempotency_key),
  UNIQUE KEY uk_ledger_original_reversal (original_record_id, type),
  KEY idx_ledger_room_created (room_id, created_at, id),
  KEY idx_ledger_from_created (from_member_id, created_at),
  KEY idx_ledger_to_created (to_member_id, created_at),
  CONSTRAINT fk_ledger_room FOREIGN KEY (room_id) REFERENCES rooms_v2(id),
  CONSTRAINT fk_ledger_from FOREIGN KEY (from_member_id) REFERENCES room_members_v2(id),
  CONSTRAINT fk_ledger_to FOREIGN KEY (to_member_id) REFERENCES room_members_v2(id),
  CONSTRAINT fk_ledger_operator FOREIGN KEY (operator_user_id) REFERENCES users_v2(id),
  CONSTRAINT fk_ledger_original FOREIGN KEY (original_record_id) REFERENCES ledger_records_v2(id),
  CONSTRAINT ck_ledger_members CHECK (from_member_id <> to_member_id),
  CONSTRAINT ck_ledger_amount CHECK (amount_minor > 0),
  CONSTRAINT ck_ledger_type CHECK (type IN ('transfer', 'reversal')),
  CONSTRAINT ck_ledger_reversal_ref CHECK (
    (type = 'transfer' AND original_record_id IS NULL) OR
    (type = 'reversal' AND original_record_id IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE room_events_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  room_version BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  payload_json JSON NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_room_event_version (room_id, room_version),
  KEY idx_room_events_created (room_id, created_at),
  CONSTRAINT fk_events_room FOREIGN KEY (room_id) REFERENCES rooms_v2(id),
  CONSTRAINT fk_events_actor FOREIGN KEY (actor_user_id) REFERENCES users_v2(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE outbox_events_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  aggregate_type VARCHAR(32) NOT NULL,
  aggregate_id BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  payload_json JSON NOT NULL,
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  available_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  published_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_outbox_pending (published_at, available_at, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE invite_tokens_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  scene VARCHAR(32) NOT NULL,
  expires_at DATETIME(3) NULL,
  revoked_at DATETIME(3) NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_invite_hash (token_hash),
  UNIQUE KEY uk_invite_scene (scene),
  KEY idx_invite_room (room_id, revoked_at),
  CONSTRAINT fk_invite_room FOREIGN KEY (room_id) REFERENCES rooms_v2(id),
  CONSTRAINT fk_invite_creator FOREIGN KEY (created_by) REFERENCES users_v2(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE legacy_claim_codes_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_member_id BIGINT UNSIGNED NOT NULL,
  code_hash CHAR(64) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  claimed_by_user_id BIGINT UNSIGNED NULL,
  claimed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_claim_code_hash (code_hash),
  UNIQUE KEY uk_claim_member (room_member_id),
  CONSTRAINT fk_claim_member FOREIGN KEY (room_member_id) REFERENCES room_members_v2(id),
  CONSTRAINT fk_claim_user FOREIGN KEY (claimed_by_user_id) REFERENCES users_v2(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE admin_audit_logs_v2 (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(80) NOT NULL,
  target_type VARCHAR(40) NULL,
  target_id VARCHAR(80) NULL,
  request_id VARCHAR(64) NOT NULL,
  ip_hash CHAR(64) NULL,
  metadata_json JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_admin_audit_user_created (admin_user_id, created_at),
  KEY idx_admin_audit_target (target_type, target_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

