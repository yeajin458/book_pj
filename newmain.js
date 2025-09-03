// 202331989 박예진
// main.js

// 1. import 모듈
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

// 라우터
const rootRouter = require('./router/rootRouter');
const registerRouter = require('./router/registerRouter');
const categRouter = require('./router/categRouter');
const bookRouter = require('./router/bookRouter');
const adminRouter = require('./router/adminRouter');
const chatRouter = require('./router/chatRouter');

// PostgreSQL + 세션 연결
const { sessionStore } = require('./pgdb'); // pgdb.js에서 가져오기

// 2. Express 앱 & HTTP 서버
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 3. 세션 설정
const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
});

app.use(sessionMiddleware);

// 4. 뷰 엔진 & 바디파서 & 정적 파일
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// 5. socket.io 핸들러
const socketHandler = require('./lib/socketHandler');
socketHandler(io, sessionMiddleware, sessionStore);

// 6. 라우터 연결
app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/categ', categRouter);
app.use('/book', bookRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);

// 7. favicon 처리
app.get('/favicon.ico', (req, res) => res.sendStatus(404));

// 8. 서버 포트 (Render 호환)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
