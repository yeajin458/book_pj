var mysql=require('mysql2')
var db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'proj',
    multipleStatements: true
});
db.connect();
module.exports=db;