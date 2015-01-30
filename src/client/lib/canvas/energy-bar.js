var ProgressBar = require('./progress-bar');

var EnergyBar = function (params) {
	this.usedMaskImage = new Image();
	this.usedMaskImage.src = './img/energy/energy.png';
	this.leftMaskImage = new Image();
	this.leftMaskImage.src = './img/energy/used.png';

	this.params = {
		location: params.location,
		width: params.width,
		height: params.height,
		currentValue: params.currentValue,
		maxValue: params.maxValue,
		fill: {
			left: '#072F4A',
			leftMask: this.leftMaskImage,
			used: '#42FFAA',
			usedMask: this.usedMaskImage,
			leftOpacity: 1,
			usedOpacity: 1,
			globalOpacity: 1
		},
		border: {
			radius: 10
		}
	};
	this.location = params.location;
	this.animating = false;
	this.updatedValue = 0;
	this.stored = false;
};

EnergyBar.prototype = new ProgressBar();

EnergyBar.prototype.store = function (value) {
	this.updatedValue = value;
	this.stored = true;
};

EnergyBar.prototype.animateChange = function () {
	var self = this;
	var changeRate = 0.1;
	var changeMultiplier = 2;
	this.animating = true;
	var animate = setInterval(function () {
		var currentValue = self.params.currentValue;
		var updatedValue = self.updatedValue;
		var changed = changeRate * changeMultiplier;
		var increasing = true;
		if (currentValue > updatedValue) {
			changed = -changed;
			increasing = false;
		}
		self.changeCurrentValue(changed);
		changeRate = Math.abs(changed);
		if ((self.params.currentValue < updatedValue && !increasing) || 
			(self.params.currentValue > updatedValue && increasing)) {
			self.setCurrentValue(updatedValue);
			clearInterval(animate);
			self.animating = false;
			self.stored = false;
		}
	}, 1000 / 30);
};

EnergyBar.prototype.update = function () {
	if (!this.animating && this.stored) {
		this.animateChange();
	}
};

EnergyBar.prototype.dispose = function () {
};

module.exports = EnergyBar;