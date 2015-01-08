var SpriteSheet = function(params) {
	var App = require('../app');
	var obj = {};

	var _canvas = App.canvasObj.canvas;
	var _image = params.image;
	var _animations = params.animations;
	var _dimensions = params.spriteDimensions;

	var _activeAnimation = _animations[params.defaultAnimation];
	var _activeFrameIndex = _activeAnimation.startFrame;
	var _speed = _activeAnimation.speed;
	
	var _currentFrame = _activeAnimation.startFrame;
	var _flipH = false;

	obj.getCurrentFrame = function () {
		return _currentFrame;
	};

	obj.setCurrentFrame = function(currentFrame) {
		_currentFrame = currentFrame;
	};

	obj.getCurrentAnimation = function () {
		return _activeAnimation.name;
	};

	obj.isFlipped = function () {
		return _flipH;
	};

	obj.setActiveAnimation = function (animationName) {
		if (_activeAnimation.name !== animationName) {
			_activeAnimation = _animations[animationName];
			_activeFrameIndex = _activeAnimation.startFrame;
			_currentFrame = _activeAnimation.startFrame;
			_speed = _activeAnimation.speed;
		}
	};

	obj.flipAnimation = function (flip) {
		if (_flipH !== flip) {
			_flipH = !_flipH;
		}
	};

	obj.getAnimation = function (animation) {
		return _animations[animation];
	};

	obj.update = function() {
		_activeFrameIndex += _speed;
		if (_activeFrameIndex > _activeAnimation.startFrame + _activeAnimation.frames) {
			_activeFrameIndex = _activeAnimation.startFrame;
		}
		_currentFrame = Math.floor(_activeFrameIndex);
	};

	obj.draw = function(x, y) {
		var scaleX = _flipH ? _dimensions.frameWidth * -1 - x : x;
		var scale = _flipH ? -1 : 1; 
		_canvas.save();
		_canvas.scale(scale, 1);
		_canvas.drawImage(_image, _currentFrame * _dimensions.frameWidth, 
		0, _dimensions.frameWidth, _dimensions.height, 
		scaleX, y, _dimensions.frameWidth, _dimensions.height);
		_canvas.restore();
	};

	return obj;
};

module.exports = SpriteSheet;