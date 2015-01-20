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
			left: '#072F4A',
			used: '#42FFAA',
			usedOpacity: 1,
			globalOpacity: 1
		}
	};
	this.location = params.location;
};

EnergyBar.prototype = new ProgressBar();

EnergyBar.prototype.decrease = function (value) {
	//TODO: animated decrease
	this.setCurrentValue(value);
};

EnergyBar.prototype.increase = function (value) {
	//TODO: animated increase
	this.setCurrentValue(value);
};

EnergyBar.prototype.update = function (value) {
    var currentValue = this.params.currentValue;
    if (currentValue !== value) {
        if (value > currentValue) {
            this.increase(value);
        } else {
            this.decrease(value);
        }
    }
};

EnergyBar.prototype.dispose = function () {
};

module.exports = EnergyBar;