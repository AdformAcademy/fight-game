var App;

var SpriteSheet = function (params) {
	App = require('../../app');
	this.canvas = App.canvasObj.canvas;
	this.image = params.image;
	this.data = params.data;
	this.animations = this.data.animations;
	this.dimensions = this.data.spriteDimensions;
	this.oneshot = params.oneshot || false;
	this.passed = false;

	this.activeAnimation = this.animations[this.data.defaultAnimation];
	this.order = this.activeAnimation.order;

	this.speed = this.order === 'asc' ? Math.abs(this.activeAnimation.speed)
 		: -Math.abs(this.activeAnimation.speed);
	this.startFrame = this.order === 'asc' ? this.activeAnimation.startFrame 
		: this.activeAnimation.startFrame + this.activeAnimation.frames - 1;
	this.currentFrame = this.startFrame;
	this.activeFrameIndex = this.startFrame;
	this.flipH = false;
	this.scale = params.useScale || false;
	this.scaleWidth = params.scaleWidth || null;
	this.scaleHeight = params.scaleHeight || null;
};

SpriteSheet.prototype.getDimensions = function () {
	return this.dimensions;
};

SpriteSheet.prototype.getSpriteSheetHeight = function () {
	return this.dimensions.frameHeight;
};

SpriteSheet.prototype.getSpriteSheetWidth = function () {
	return this.dimensions.frameWidth;
};

SpriteSheet.prototype.getCurrentFrame = function () {
	return this.currentFrame;
};

SpriteSheet.prototype.setCurrentFrame = function (currentFrame) {
	this.currentFrame = currentFrame;
	this.activeFrameIndex = currentFrame;
};

SpriteSheet.prototype.getCurrentAnimation = function () {
	return this.activeAnimation.name;
};

SpriteSheet.prototype.isFlipped = function () {
	return this.flipH;
};

SpriteSheet.prototype.isLastFrame = function () {
	var activeAnimation = this.activeAnimation;
	var currentFrame = this.currentFrame;
	if (activeAnimation.order === 'asc') {
		if (currentFrame === activeAnimation.startFrame + activeAnimation.frames) {
			return true;
		}
	} else {
		if (currentFrame === activeAnimation.startFrame) {
			return true;
		}
	}
	return false;
};

SpriteSheet.prototype.setActiveAnimation = function (animationName) {
	if (this.activeAnimation.name !== animationName) {
		this.activeAnimation = this.animations[animationName];
		this.order = this.activeAnimation.order;
		this.startFrame = this.order === 'asc' ? this.activeAnimation.startFrame 
			: this.activeAnimation.startFrame + this.activeAnimation.frames - 1;
		this.currentFrame = this.startFrame;
		this.activeFrameIndex = this.startFrame;
		this.speed = this.order === 'asc' ? Math.abs(this.activeAnimation.speed)
	 		: -Math.abs(this.activeAnimation.speed);
	}
};

SpriteSheet.prototype.getAnimationOrder = function () {
	return this.order;
};

SpriteSheet.prototype.setAnimationOrder = function (order) {
	this.order = order;
	this.speed = this.order === 'asc' ? Math.abs(this.activeAnimation.speed)
		: -Math.abs(this.activeAnimation.speed);
};

SpriteSheet.prototype.flipAnimation = function (flip) {
	if (this.flipH !== flip) {
		this.flipH = !this.flipH;
	}
};

SpriteSheet.prototype.getAnimation = function (animation) {
	return this.animations[animation];
};

SpriteSheet.prototype.update = function() {
	var activeAnimation = this.activeAnimation;
	this.activeFrameIndex += this.speed;
	if (activeAnimation.order === 'asc') {
		if (this.activeFrameIndex > activeAnimation.startFrame + activeAnimation.frames) {
			this.activeFrameIndex = this.startFrame;
			this.passed = true;
		}
		this.currentFrame = Math.floor(this.activeFrameIndex);
	} else {
		if (this.activeFrameIndex < activeAnimation.startFrame) {
			this.activeFrameIndex = this.startFrame;
			this.passed = true;
		}
		this.currentFrame = Math.ceil(this.activeFrameIndex);
	}
};

SpriteSheet.prototype.draw = function(x, y) {
	if(this.oneshot && !this.passed || !this.oneshot) {
		var scaleX = this.flipH ? this.dimensions.frameWidth * -1 - x : x;
		var scale = this.flipH ? -1 : 1;
		var frameWidth, frameHeight; 
		this.canvas.save();
		this.canvas.scale(scale, 1);
		if (!this.scale) {
			frameWidth = this.dimensions.frameWidth;
			frameHeight = this.dimensions.frameHeight;
		} else {
			frameWidth = this.scaleWidth;
			frameHeight = this.scaleHeight;
		}

		this.canvas.drawImage(this.image, this.currentFrame * this.dimensions.frameWidth, 
			(this.activeAnimation.row * 224), this.dimensions.frameWidth, this.dimensions.frameHeight, 
			scaleX, y, frameWidth, frameHeight);
		this.canvas.restore();
	}
};

module.exports = SpriteSheet;