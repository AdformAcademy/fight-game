var UpdateHandler = function (callback, interval) {
	this.callback = callback;
	this.interval = interval;
	this.handlerInterval = null;
};

UpdateHandler.prototype.start = function () {
	var self = this;
	this.handlerInterval = setInterval(function () {
		self.callback();
	}, this.interval);
};

UpdateHandler.prototype.stop = function () {
	clearTimeout(this.handlerInterval);
};

module.exports = UpdateHandler;