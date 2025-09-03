// pgdb.js
const { Pool } = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render 환경변수
  ssl: { rejectUnauthorized: false }          // Render PostgreSQL SSL 필요
});

pool.connect()
  .then(() => console.log('PostgreSQL 연결 성공!'))
  .catch(err => console.error('PostgreSQL 연결 실패:', err));

// 세션 스토어 설정
const sessionStore = new pgSession({
  pool: pool,
  tableName: 'session'
});

module.exports = { pool, sessionStore };
