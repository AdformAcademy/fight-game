var Session = require('./session');

var SessionCollection = {};

SessionCollection.list = [];

SessionCollection.getSessionObject = function(sessionId) {
  return SessionCollection.list[sessionId];
};

SessionCollection.getAvailableSession = function() {
  for (var key in SessionCollection.list) {
    var sesObj = SessionCollection.list[key];
    if (sesObj.state === Session.READY) {
      return sesObj;
    }
  }
  return undefined;
};

SessionCollection.sessionExists = function(sessionId) {
  return SessionCollection.list[sessionId] !== undefined;
};

SessionCollection.createSession = function(socket, selection, state) {
  state = state === undefined ? Session.READY : state;
  var sesObj = new Session(socket, null, state);
  sesObj.setSelection(selection);
  SessionCollection.list[socket.id] = sesObj;
  return sesObj;
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