function OnClickCollection() {}

OnClickCollection.list = [];

OnClickCollection.addObject = function(obj) {
	OnClickCollection.list.push(obj);
}

$(window).click(function (event) {
	var location = new Location(event.pageX, event.pageY);
	for (var key in OnClickCollection.list) {
		if (OnClickCollection.list[key].locationIntersects(location)) {
			OnClickCollection.list[key].executeClick();
		}
	}
});