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
};

LifeBar.prototype = new ProgressBar();

LifeBar.prototype.decrease = function (value) {
	//TODO: animated decrease
	this.setCurrentValue(value);
};

LifeBar.prototype.increase = function (value) {
	//TODO: animated increase
	this.setCurrentValue(value);
};

LifeBar.prototype.update = function (value) {
	var currentValue = this.params.currentValue;
	if (currentValue !== value) {
		if (value > currentValue) {
			this.increase(value);
		} else {
			this.decrease(value);
		}
	}
};

LifeBar.prototype.dispose = function () {
};

module.exports = LifeBar;