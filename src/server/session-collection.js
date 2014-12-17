var Session = require('./session');

function SessionCollection() {};

SessionCollection.list = [];

SessionCollection.getSessionObject = function(sessionId) {
  return SessionCollection.list[sessionId];
};

SessionCollection.getAvailableSession = function() {
  for (var key in SessionCollection.list) {
    var sesObj = SessionCollection.list[key];
    if (sesObj.state == Session.READY) {
      return sesObj;
    }
  }
  return null;
};

SessionCollection.sessionExists = function(sessionId) {
  return SessionCollection.list[sessionId] != null;
};

SessionCollection.createSession = function(socket) {
  var sesObj = new Session(socket, null, Session.READY);
  SessionCollection.list[socket.id] = sesObj;
};

SessionCollection.deleteSession = function(sessionId) {
  delete SessionCollection.list[sessionId];
};

SessionCollection.printSessions = function() {
  console.log('Sessions: ');
  for (var key in SessionCollection.list) {
    console.log(SessionCollection.list[key].toString());
  }
};

SessionCollection.getCollection = function() {
  return SessionCollection.list;
}

module.exports = SessionCollection;