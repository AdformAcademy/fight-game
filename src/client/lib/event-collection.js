var Point = require('./canvas/point');

var EventCollection = {};

EventCollection.clickList = [];
EventCollection.mouseOverList = [];

EventCollection.addOnClickObject = function(obj) {
	EventCollection.clickList.push(obj);
};

EventCollection.addMouseOverObject = function(obj) {
	EventCollection.mouseOverList.push(obj);
};

EventCollection.removeOnClickObject = function(obj) {
	for (var key in EventCollection.clickList) {
		if (EventCollection.clickList[key] === obj) {
			delete EventCollection.clickList[key];
			return;
		}
	}
};

EventCollection.removeMouseOverObject = function(obj) {
	for (var key in EventCollection.mouseOverList) {
		if (EventCollection.mouseOverList[key] === obj) {
			delete EventCollection.mouseOverList[key];
			return;
		}
	}
};

module.exports = EventCollection;