var ProgressBar = require('./progress-bar');

var LifeBar = function (params) {
	var loader = params.loader;

	var id = loader.append();
	this.healthVeryHighMask = new Image();
	this.healthVeryHighMask.src = './img/health/very-high.png';
	this.healthVeryHighMask.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	id = loader.append();
	this.healthHighMask = new Image();
	this.healthHighMask.src = './img/health/high.png';
	this.healthHighMask.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	id = loader.append();
	this.healthNormalMask = new Image();
	this.healthNormalMask.src = './img/health/normal.png';
	this.healthNormalMask.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	id = loader.append();
	this.healthLowMask = new Image();
	this.healthLowMask.src = './img/health/low.png';
	this.healthLowMask.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	id = loader.append();
	this.healthVeryLowMask = new Image();
	this.healthVeryLowMask.src = './img/health/very-low.png';
	this.healthVeryLowMask.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	id = loader.append();
	this.leftMaskImage = new Image();
	this.leftMaskImage.src = './img/health/used.png';
	this.leftMaskImage.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	this.params = {
		location: params.location,
		width: params.width,
		height: params.height,
		currentValue: params.currentValue,
		maxValue: params.maxValue,
		fill: {
			left: '#B5B5B5',
			leftMask: this.leftMaskImage,
			used: '#39BD1E',
			usedMask: this.healthVeryHighMask,
			leftOpacity: 1,
			usedOpacity: 1,
			globalOpacity: 1
		},
		border: {
			radius: 18
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

LifeBar.prototype.updateMask = function () {
	var maxValue = this.params.maxValue;
	var currentValue = this.params.currentValue;
	var percentage = currentValue * 100 / maxValue;
	if (percentage >= 80) {
		this.params.fill.usedMask = this.healthVeryHighMask;
	} else if (percentage < 80 && percentage >= 60) {
		this.params.fill.usedMask = this.healthHighMask;
	} else if (percentage < 60 && percentage >= 40) {
		this.params.fill.usedMask = this.healthNormalMask;
	} else if (percentage < 40 && percentage >= 20) {
		this.params.fill.usedMask = this.healthLowMask;
	} else if (percentage < 20) {
		this.params.fill.usedMask = this.healthVeryLowMask;
	}
};

LifeBar.prototype.update = function () {
	if (!this.animating && this.stored) {
		this.animateChange();
	}
	this.updateMask();
};

LifeBar.prototype.dispose = function () {
};

module.exports = LifeBar;