var SessionCollection = require('./session-collection');
var PlayerCollection = require('./player-collection');
var Session = require('./session');
var SocketServer = require('./socket-server');
var InputsArray = require('./inputs-array');

function PlayerUpdate(){

};

module.exports = PlayerUpdate;
PlayerUpdate.inputsArray = [];
var collection;
var session;
var playerObj;
var data;

PlayerUpdate.emitData = function(){
	collection = SessionCollection.getCollection();
	for (var key in collection){
		session = collection[key];
		if(session.state == Session.PLAYING){
			playerObj = PlayerCollection.getPlayerObject(session.socket.id);
			if (playerObj != null) {
				opponentObj = PlayerCollection.getPlayerObject(playerObj.getOpponentId());
				data = SocketServer.prepareSocketData(playerObj, opponentObj);
				session.socket.emit('update', data);
			}
		}
	}
	setTimeout(PlayerUpdate.emitData, 1000 / 30);
};

PlayerUpdate.updatePhysics = function(){
	collection = SessionCollection.getCollection();
	for (var key in collection) {
		session = collection[key];
		if(session.state == Session.PLAYING){
			playerObj = PlayerCollection.getPlayerObject(session.socket.id);
			if (playerObj != null) {
				if(typeof PlayerUpdate.inputsArray[session.socket.id] != 'undefined')
				{
					if(PlayerUpdate.inputsArray[session.socket.id].getLength() > 0){
						SocketServer.updateClientCoordinates(playerObj, PlayerUpdate.inputsArray[session.socket.id].get(0));
						PlayerUpdate.inputsArray[session.socket.id].shift();
					}
				}
				SocketServer.updateZ(playerObj);
			}
		}
	}
	setTimeout(PlayerUpdate.updatePhysics, 1000 / 60);
};

/*eiti per sesijas, kurios aktyvios, paimti player, paimti seniausia imputa is imputsArray, atlikti ji ir istrini*/