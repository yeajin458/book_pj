// migrate-passwords.js
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

// ✅ DB 연결 설정 (본인 환경 맞게 수정하세요)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "proj"
});

// 전체 사용자 불러오기
db.query("SELECT loginid, password FROM user", async (err, results) => {
  if (err) throw err;

  for (const user of results) {
    const plainPw = user.password;

    // bcrypt 해시로 이미 처리된 계정은 건너뛰기
    if (plainPw.startsWith("$2a$") || plainPw.startsWith("$2b$")) {
      console.log(`✅ 유저 ${user.loginid}는 이미 해시 처리됨`);
      continue;
    }

    try {
      // 평문 → 해시 변환
      const hashed = await bcrypt.hash(plainPw, 10);

      // DB 업데이트
      await db.promise().query(
        "UPDATE user SET password = ? WHERE loginid = ?",
        [hashed, user.loginid]
      );

      console.log(`🔒 유저 ${user.loginid} 비번 해시 완료`);
    } catch (err2) {
      console.error(`❌ 업데이트 실패 (id=${user.loginid}):`, err2);
    }
  }

  db.end();
});
