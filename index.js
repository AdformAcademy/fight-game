var Express = require('./src/server/express');
var SocketServer = require('./src/server/socket-server');
var Tasks = require('./src/server/tasks');
var io = require('socket.io')(SocketServer.http);
var PlayerUpdate = require('./src/server/player-update');
var InputsArray = require('./src/server/inputs-array');

Express.loadResources(__dirname);
Tasks.start();
SocketServer.listen();

PlayerUpdate.emitData();
PlayerUpdate.updatePhysics();
io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    SocketServer.disconnectClient(socket);
    delete PlayerUpdate.inputsArray[socket.id];
  });

  socket.on('ready', function() {
    SocketServer.prepareClient(socket);
  });

  socket.on('update', function(data) {
  	console.log('data: ' + data.key + ' ' + data.jumpKey);
    SocketServer.updateClient(socket, data);
    if(PlayerUpdate.inputsArray[socket.id] == null)
    	PlayerUpdate.inputsArray[socket.id] = new InputsArray();
    PlayerUpdate.inputsArray[socket.id].push(data);
  });
});