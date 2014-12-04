var Session = require('./Session');

function Sessions() {};

Sessions.list = [];

Sessions.getSessionObject = function(sessionId) {
  return Sessions.list[sessionId];
};

Sessions.getAvailableSession = function() {
  for (var key in Sessions.list) {
    var sesObj = Sessions.list[key];
    if (sesObj.state == Session.READY) {
      return sesObj;
    }
  }
  return null;
};

Sessions.sessionExists = function(sessionId) {
  return Sessions.list[sessionId] != null;
};

Sessions.createSession = function(socket) {
  var sesObj = new Session(socket, null, Session.READY);
  Sessions.list[socket.id] = sesObj;
};

Sessions.deleteSession = function(sessionId) {
  delete Sessions.list[sessionId];
};

Sessions.printSessions = function() {
  console.log('Sessions: ');
  for (var key in Sessions.list) {
    console.log(Sessions.list[key].toString());
  }
};

module.exports = Sessions;