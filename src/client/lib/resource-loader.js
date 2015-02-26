var ResourceLoader = function (event) {
	this.event = event;
	this.resources = [];
	this.globalId = 0;
	this.eventTriggered = false;
	var self = this;
	setTimeout(function () {
		self.triggerEvent();
	}, 30000);
};

ResourceLoader.prototype.append = function (resource) {
	this.resources[this.globalId] = {
		id: this.globalId,
		loaded: false
	};
	return this.globalId++;
};

ResourceLoader.prototype.isLoaded = function () {
	for (var resource in this.resources) {
		if (!this.resources[resource].loaded) {
			return false;
		}
	}
	return true;
};

ResourceLoader.prototype.load = function (id) {
	this.resources[id].loaded = true;
	if (this.isLoaded()) {
		this.triggerEvent();
	}
};

ResourceLoader.prototype.triggerEvent = function () {
	if (!this.eventTriggered) {
		this.event();
		this.eventTriggered = true;
	}
};

module.exports = ResourceLoader;