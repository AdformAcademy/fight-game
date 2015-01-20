var ProgressBar = require('./progress-bar');

var LifeBar = function (params) {
	this.params = {
		location: params.location,
		width: params.width,
		height: params.height,
		currentValue: params.currentValue,
		maxValue: params.maxValue,
		border: {
			drawBorder: true,
			width: 3,
			color: 'black',
			radius: 17
		},
		fillColors: {
			left: 'yellow',
			used: 'red',
			usedOpacity: 1,
			globalOpacity: 1
		}
	};
	this.location = params.location;
	this.changesBuffer = [];
	this.animating = false;
};

LifeBar.prototype = new ProgressBar();

LifeBar.prototype.store = function (value) {
	this.changesBuffer.push(value);
};

LifeBar.prototype.useBuffer = function () {
	var value = this.changesBuffer[0];
	if (value === undefined) {
		return;
	}
	var currentValue = this.params.currentValue;
	if (value !== currentValue) {
		this.animateChange(value);
	}
	this.changesBuffer.shift();
};

LifeBar.prototype.animateChange = function (value) {
	var self = this;
	var changeRate = 0.1;
	var changeMultiplier = 2;
	this.animating = true;
	var animate = setInterval(function () {
		var currentValue = self.params.currentValue;
		var changed = changeRate * changeMultiplier;
		if (currentValue > value) {
			changed = -changed;
		}
		self.changeCurrentValue(changed);
		changeRate = Math.abs(changed);
		if (self.params.currentValue < value) {
			self.setCurrentValue(value);
			clearInterval(animate);
			self.animating = false;
		}
	}, 1000 / 30);
};

LifeBar.prototype.update = function () {
	if (!this.animating) {
		this.useBuffer();
	}
};

LifeBar.prototype.dispose = function () {
	this.changesBuffer = [];
};

module.exports = LifeBar;