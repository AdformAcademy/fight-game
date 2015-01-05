var SpriteSheet = function(params) {
	var App = require('../app');
	var obj = {};

	var _canvas = App.canvasObj.canvas;
	var _image = params.image;
	var _animations = params.animations;

	var _fullAnimation = _animations[params.defaultAnimation.animation];
	var _activeAnimation = _fullAnimation[params.defaultAnimation.direction];
	var _activeFrameIndex = 0;
	var _speed = _activeAnimation.speed;
	var _currentDim = _activeAnimation.frameDimensions[0];

	obj.setActiveAnimation = function (animationName) {
		_fullAnimation = _animations[animationName];
		_activeAnimation = _fullAnimation[_activeAnimation.name];
		_activeFrameIndex = 0;
		_currentDim = _activeAnimation.frameDimensions[0];
		_speed = _activeAnimation.speed;
	};

	obj.setDirection = function(direction) {
		_activeAnimation = _fullAnimation[direction];
		_currentDim = _activeAnimation.frameDimensions[Math.floor(_activeFrameIndex)];
	}

	obj.getAnimation = function (animationObj) {
		return _animations[animationObj.animation][animationObj.direction];
	};

	obj.update = function() {
		var frameDimensionIndex;
		_activeFrameIndex += _speed;
		if (_activeFrameIndex > _activeAnimation.frames) {
			_activeFrameIndex = 0;
		}
		var ind = Math.floor(_activeFrameIndex);
		_currentDim = _activeAnimation.frameDimensions[ind];
	};

	obj.draw = function(x, y) {
		_canvas.drawImage(_image, _currentDim.x, 
		_activeAnimation.rowY, _currentDim.width, _activeAnimation.frameHeight, 
		x, y, _currentDim.width, _activeAnimation.frameHeight);
	};

	return obj;
};

module.exports = SpriteSheet;