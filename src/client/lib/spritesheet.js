var SpriteSheet = function(params) {
	var App = require('../app');
	var obj = {};

	var _canvas = App.canvasObj.canvas;
	var _image = params.image;
	var _animations = params.animations;
	var _dimensions = params.spriteDimensions;

	var _fullAnimation = _animations[params.defaultAnimation.animation];
	var _activeAnimation = _fullAnimation[params.defaultAnimation.direction];
	var _activeFrameIndex = _activeAnimation.startFrame;
	var _speed = _activeAnimation.speed;
	
	var _currentFrame = _activeAnimation.startFrame;
	var _currentDirection = _activeAnimation.name;

	var countCurrentFrame = function (n, w, fw) {
		return (w - (n * fw + fw)) / fw;
	};

	obj.getCurrentFrame = function () {
		return _currentFrame;
	};

	obj.setCurrentFrame = function(currentFrame) {
		_currentFrame = currentFrame;
	};

	obj.getCurrentAnimation = function () {
		return _fullAnimation.name;
	};

	obj.getCurrentAnimationDirection = function () {
		return _activeAnimation.name;
	};

	obj.setActiveAnimation = function (animationName) {
		if (_fullAnimation.name !== animationName) {
			_fullAnimation = _animations[animationName];
			_activeAnimation = _fullAnimation[_activeAnimation.name];
			_activeFrameIndex = _activeAnimation.startFrame;
			_currentFrame = _activeAnimation.startFrame;
			_speed = _activeAnimation.speed;
		}
	};

	obj.setDirection = function(direction) {
		if (_currentDirection !== direction) {
			_activeAnimation = _fullAnimation[direction];
			_currentFrame = countCurrentFrame(_currentFrame, 
				_dimensions.width, _dimensions.frameWidth);
			_activeFrameIndex = _currentFrame;
			_currentDirection = _activeAnimation.name;
		}
	}

	obj.getAnimation = function (animationObj) {
		return _animations[animationObj.animation][animationObj.direction];
	};

	obj.update = function() {
		_activeFrameIndex += _speed;
		if (_activeFrameIndex > _activeAnimation.startFrame + _activeAnimation.frames) {
			_activeFrameIndex = _activeAnimation.startFrame;
		}
		_currentFrame = Math.floor(_activeFrameIndex);
	};

	obj.draw = function(x, y) {
		_canvas.drawImage(_image, _currentFrame * _dimensions.frameWidth, 
		0, _dimensions.frameWidth, _dimensions.height, 
		x, y, _dimensions.frameWidth, _dimensions.height);
	};

	return obj;
};

module.exports = SpriteSheet;