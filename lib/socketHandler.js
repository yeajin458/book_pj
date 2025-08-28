var db = require('./db');

module.exports = function (io, sessionMiddleware) {
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on('connection', (socket) => {
    const session = socket.request.session;

    if (session && session.loginid) {
      const username = session.loginid;
      console.log(`${username} 접속`);

      // 클라이언트가 join_room 요청 시
      socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`${username}님이 ${room} 방에 입장`);

        // 이전 메시지 불러오기
        db.query(
          'SELECT sender, message, created_at FROM messages WHERE room_id = ? ORDER BY created_at ASC',
          [room],
          (err, results) => {
            if (err) {
              console.error(err);
              return;
            }
            // 이전 메시지를 해당 클라이언트에만 전송
            socket.emit('previous_messages', results);
          }
        );
      });

      // 메시지 전송 이벤트
      socket.on('private_room_message', ({ room, to, message }) => {
        // DB에 저장
        db.query(
          'INSERT INTO messages (room_id, sender, receiver, message) VALUES (?, ?, ?, ?)',
          [room, username, to, message],
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            // 저장 성공 후 방 내 모든 접속자에게 메시지 전송
            io.to(room).emit('private_room_message', {
              from: username,
              message,
            });
          }
        );
      });

      // 접속 종료
      socket.on('disconnect', () => {
        console.log(`${username} 연결 해제`);
      });
    } else {
      console.log('세션 없음 - 연결 끊김');
      socket.disconnect(true);
    }
  });
};
