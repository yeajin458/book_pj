const mysql = require('mysql2');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'proj'
});

connection.query('SELECT * FROM book LIMIT 1;', (err, results) => {
  if(err) {
    console.error('쿼리 에러:', err);
  } else {
    console.log('쿼리 결과:', results);
  }
  connection.end();
});
