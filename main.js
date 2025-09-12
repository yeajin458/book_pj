//202331989 박예진
//1. import 코드들
const mysql = require('mysql2/promise');
mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'proj'
}).then(conn => conn.query('SHOW TABLES').then(([rows]) => console.log(rows)));

const express=require('express')
var session=require('express-session')
var MySqlStore=require('express-mysql-session')(session)
var bodyParser=require('body-parser')
const http = require('http'); // ← http 모듈 불러오기


const rootRouter=require('./router/rootRouter')
const registerRouter=require('./router/registerRouter')
const categRouter=require('./router/categRouter')
const bookRouter=require('./router/bookRouter')
const adminRouter=require('./router/adminRouter')
const chatRouter=require('./router/chatRouter')

//2. 모든 경로에서 실행되어야 하는 모듈들
var options={
    host:'localhost',
    user:'root',
    password:'1234',
    database:'proj',
    multipleStatements:true
}

var sessionStore=new MySqlStore(options)//객체 mysql와 세션이 연동
const app=express()
const server = http.createServer(app); // ← app을 http 서버로 감싸기
const { Server } = require('socket.io');
const io = new Server(server); // ← socket.io가 http서버 위에서 돌아가도록 설정



const sessionMiddleware = session({
  secret:'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
});

// 2. express에 미들웨어 등록
app.use(sessionMiddleware);


app.set('views',__dirname+'/views')
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended: true}))///바디파서 위에 use 메소드가 있으면 안됨
app.use(express.static('public'))

const socketHandler = require('./lib/socketHandler');
socketHandler(io, sessionMiddleware, sessionStore);

app.use('/',rootRouter)
app.use('/register',registerRouter)
app.use('/categ',categRouter)
app.use('/book',bookRouter)
app.use('/admin',adminRouter)
app.use('/chat',chatRouter)

app.get('/favicon.ico',(req,res)=>res.writeHead(404))

server.listen(3000, '0.0.0.0', () => {
  console.log("서버 실행 중 http://0.0.0.0:3000");
});
