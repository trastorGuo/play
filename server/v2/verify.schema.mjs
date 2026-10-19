import 'reflect-metadata';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'node:url';
const host = process.env.DB_HOST;
const source = process.env.DB_DATABASE;
if (process.env.V2_SMOKE_ISOLATED !== 'true' || !['localhost', '127.0.0.1'].includes(host) || !/^play_verify_[a-z0-9_]+$/.test(source || '')) throw new Error('Only an explicitly isolated local schema is accepted');
const database = source + '_migrations';
const options = { host, port: Number(process.env.DB_PORT), user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD };
const connection = await mysql.createConnection(options);
let created = false, dataSource;
try {
  await connection.query(`CREATE DATABASE \`${database}\``); created = true;
  dataSource = new DataSource({ type: 'mysql', host, port: options.port, username: options.user, password: options.password, database, synchronize: false, migrations: [fileURLToPath(new URL('../migrations/*.js', import.meta.url))] });
  await dataSource.initialize();
  assert.equal((await dataSource.runMigrations()).length, 5);
  assert.equal((await dataSource.runMigrations()).length, 0);
  const sections = [
    ['columns', "SELECT TABLE_NAME,COLUMN_NAME,ORDINAL_POSITION,COLUMN_TYPE,IS_NULLABLE,COLUMN_DEFAULT,EXTRA,COLLATION_NAME FROM information_schema.columns WHERE TABLE_SCHEMA=? AND RIGHT(TABLE_NAME,3)='_v2' ORDER BY TABLE_NAME,ORDINAL_POSITION"],
    ['indexes', "SELECT TABLE_NAME,INDEX_NAME,NON_UNIQUE,SEQ_IN_INDEX,COLUMN_NAME FROM information_schema.statistics WHERE TABLE_SCHEMA=? AND RIGHT(TABLE_NAME,3)='_v2' ORDER BY TABLE_NAME,INDEX_NAME,SEQ_IN_INDEX"],
    ['constraints', "SELECT TABLE_NAME,CONSTRAINT_NAME,CONSTRAINT_TYPE FROM information_schema.table_constraints WHERE TABLE_SCHEMA=? AND RIGHT(TABLE_NAME,3)='_v2' ORDER BY TABLE_NAME,CONSTRAINT_NAME"],
  ];
  for (const [section, sql] of sections) {
    const [expected] = await connection.query(sql, [database]);
    const [actual] = await connection.query(sql, [source]);
    assert.deepEqual(actual, expected, `Production schema differs from migrations: ${section}`);
    console.log(`PASS schema ${section}: ${expected.length}`);
  }
  console.log('PASS five fresh migrations, no-op rerun, production schema equivalence');
} finally {
  if (dataSource?.isInitialized) await dataSource.destroy();
  if (created) await connection.query(`DROP DATABASE \`${database}\``);
  await connection.end();
}
