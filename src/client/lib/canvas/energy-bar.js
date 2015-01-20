var ProgressBar = require('./progress-bar');

var EnergyBar = function (params) {
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
			radius: 10
		},
		fillColors: {
			left: 'green',
			used: 'blue',
			usedOpacity: 1,
			globalOpacity: 1
		}
	};
	this.location = params.location;
};

EnergyBar.prototype = new ProgressBar();

EnergyBar.prototype.decrease = function (value) {
	//TODO: animated decrease
};

EnergyBar.prototype.increase = function (value) {
	//TODO: animated increase
};

EnergyBar.prototype.update = function () {
	//TODO: update logic
};

EnergyBar.prototype.dispose = function () {
};

module.exports = EnergyBar;