import 'dotenv/config'
import mysql from 'mysql2/promise'

const connection=await mysql.createConnection({host:process.env.DB_HOST||'localhost',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USERNAME||'root',password:process.env.DB_PASSWORD||'',database:process.env.DB_DATABASE||'play'})
try{
  const [v2Tables]=await connection.query("SELECT table_name AS name FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name LIKE '%\\_v2' ORDER BY table_name")
  const [legacyTables]=await connection.query("SELECT table_name AS name FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name IN ('rooms','room_users','expense_records') ORDER BY table_name")
  const [unbalanced]=await connection.query('SELECT room_id, SUM(balance_points) AS total FROM room_members_v2 GROUP BY room_id HAVING SUM(balance_points)<>0')
  const [invalidPoints]=await connection.query('SELECT COUNT(*) AS count FROM ledger_records_v2 WHERE points<1 OR points>99999')
  const expected=['account_deletion_requests_v2','admin_audit_logs_v2','feedback_files_v2','feedback_v2','idempotency_keys_v2','invite_tokens_v2','ledger_records_v2','legacy_claim_codes_v2','outbox_events_v2','profile_avatars_v2','refresh_tokens_v2','room_events_v2','room_members_v2','rooms_v2','users_v2']
  const actual=v2Tables.map((row)=>row.name)
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`v2 table mismatch: ${actual.join(',')}`)
  if(legacyTables.length!==3)throw new Error('legacy tables missing')
  if(unbalanced.length)throw new Error(`unbalanced rooms: ${JSON.stringify(unbalanced)}`)
  if(Number(invalidPoints[0].count)!==0)throw new Error('invalid points found')
  console.log(JSON.stringify({v2TableCount:actual.length,legacyTables:legacyTables.map((row)=>row.name),unbalancedRoomCount:0,invalidPointCount:0}))
}finally{await connection.end()}
