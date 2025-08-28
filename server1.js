const express = require('express');
const http = require('http');
const session = require('express-session');
const { Server } = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = new Server(server);

// 세션 설정
const sessionMiddleware = session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false
});
app.use(sessionMiddleware);

// ejs, static 설정
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 로그인 가정 (임시)
app.get('/login', (req, res) => {
  req.session.user = { username: req.query.name }; // ?username=aaa
  res.redirect('/chat');
});

app.get('/chat', (req, res) => {
  if (!req.session.loginid) return res.send('로그인 필요');
  res.render('chat', { loginid: req.session.loginid });
});

// Socket.IO에 세션 공유
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// 사용자 소켓 맵 (username → socket.id)
const userSockets = {};

io.on('connection', (socket) => {
  const session = socket.request.session;
  const user = session.name;

  if (user && user.username) {
    userSockets[user.username] = socket.id;
    console.log(`${user.username} 접속됨`);

    socket.on('private_message', ({ to, message }) => {
      const targetSocketId = userSockets[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit('private_message', {
          from: user.username,
          message
        });
      }
    });

    socket.on('disconnect', () => {
      delete userSockets[user.username];
    });
  }
});

server.listen(3000, () => {
  console.log('http://localhost:3000');
});
