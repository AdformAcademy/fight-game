var UpdateHandler = function (callback, interval) {
	this.callback = callback;
	this.interval = interval;
	this.handlerInterval = null;
	this.started = false;
};

UpdateHandler.prototype.start = function () {
	var self = this;
	if (!this.started) {
		this.started = true;
		this.handlerInterval = setInterval(function () {
			self.callback();
		}, this.interval);
	}
};

UpdateHandler.prototype.stop = function () {
	clearTimeout(this.handlerInterval);
	this.started = false;
};

module.exports = UpdateHandler;