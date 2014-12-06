var Location = require('./location.js');

function EventCollection() {}

EventCollection.clickList = [];

EventCollection.addOnClickObject = function(obj) {
	EventCollection.clickList.push(obj);
}

$(window).click(function (event) {
	var location = new Location(event.pageX, event.pageY);
	for (var key in EventCollection.clickList) {
		if (EventCollection.clickList[key].locationIntersects(location)) {
			EventCollection.clickList[key].executeClick();
		}
	}
});

module.exports = EventCollection;