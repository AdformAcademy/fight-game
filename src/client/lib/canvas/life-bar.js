var ProgressBar = require('./progress-bar');

var LifeBar = function (params) {
	var usedMaskImage = new Image();
	usedMaskImage.src = './img/health.png';
	var leftMaskImage = new Image();
	leftMaskImage.src = './img/health-used.png';
	this.params = {
		location: params.location,
		width: params.width,
		height: params.height,
		currentValue: params.currentValue,
		maxValue: params.maxValue,
		border: {
			drawBorder: true,
			width: 3,
			color: '#212121',
			radius: 17
		},
		fill: {
			left: '#B5B5B5',
			leftMask: leftMaskImage,
			used: '#39BD1E',
			usedMask: usedMaskImage,
			usedOpacity: 1,
			globalOpacity: 1
		}
	};
	this.location = params.location;
	this.animating = false;
	this.updatedValue = 0;
	this.stored = false;
};

LifeBar.prototype = new ProgressBar();

LifeBar.prototype.store = function (value) {
	this.updatedValue = value;
	this.stored = true;
};

LifeBar.prototype.animateChange = function () {
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

LifeBar.prototype.update = function () {
	if (!this.animating && this.stored) {
		this.animateChange();
	}
};

LifeBar.prototype.dispose = function () {
};

module.exports = LifeBar;