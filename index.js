var Express = require('./src/server/express');
var SocketServer = require('./src/server/socket-server');
var Tasks = require('./src/server/tasks');
var io = require('socket.io')(SocketServer.http);
Express.loadResources(__dirname);
Tasks.start();
SocketServer.listen();

setInterval(function() {
  SocketServer.update();
}, 1000 / 10);

io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    SocketServer.disconnectClient(socket);
  });

  socket.on('ready', function() {
    SocketServer.prepareClient(socket);
  });

  socket.on('update', function(input) {
    SocketServer.storeInput(socket, input);
  });
});