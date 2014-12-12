var Express = require('./src/server/express');
var SocketServer = require('./src/server/socket-server');
var Tasks = require('./src/server/tasks');
var io = require('socket.io')(SocketServer.http);

Express.loadResources(__dirname);
Tasks.start();
SocketServer.listen();

io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    SocketServer.disconnectClient(socket);
  });

  socket.on('ready', function() {
    SocketServer.prepareClient(socket);
  });

  socket.on('update', function(data) {
    SocketServer.updateClient(socket, data);
  });
  
});