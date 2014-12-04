var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('./src/session');

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

io.on('connection', function(socket){
  console.log(socket.id);
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('rectangle x', function(msg){
  	io.emit('rectangle x', msg);
  });

  socket.on('rectangle y', function(msg){
  	io.emit('rectangle y', msg);
  });
});

http.listen(3000, function(){
  var ses = new session('5', '1', 'unactive');
  console.log(ses.sessionId);
  console.log(ses.opponentId);
  console.log(ses.state);

  ses.setState('active');
  ses.setOpponentId('2');

  console.log(ses.sessionId);
  console.log(ses.opponentId);
  console.log(ses.state);

  console.log('listening on *:3000');
});