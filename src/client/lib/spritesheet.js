var SpriteSheet = function(params) {
	var App = require('../app');
	var obj = {};

	var _canvas = App.canvasObj.canvas;
	var _image = params.image;
	var _animations = params.animations;

	var _activeAnimation = _animations[params.defaultAnimation];
	var _activeFrameIndex = _activeAnimation.start;
	var _speed = _activeAnimation.speed;
	var _currentDim = _activeAnimation.frameDimensions[0];

	obj.setActiveAnimation = function (animationName) {
		_activeAnimation = _animations[animationName];
		_activeFrameIndex = _activeAnimation.start;
		_currentDim = _activeAnimation.frameDimensions[0];
		_speed = _activeAnimation.speed;
	};

	obj.getAnimation = function (animationName) {
		return _animations[animationName];
	};

	obj.update = function() {
		var frameDimensionIndex;
		_activeFrameIndex += _speed;
		if (_activeFrameIndex > _activeAnimation.start + _activeAnimation.frames) {
			_activeFrameIndex = _activeAnimation.start;
		}
		frameDimensionIndex = Math.floor(_activeFrameIndex) - _activeAnimation.start;
		_currentDim = _activeAnimation.frameDimensions[frameDimensionIndex];
	};

	obj.draw = function(x, y) {
		_canvas.drawImage(_image, _currentDim.x, 
		_activeAnimation.rowY, _currentDim.width, _activeAnimation.frameHeight, 
		x, y, _currentDim.width, _activeAnimation.frameHeight);
	};

	return obj;
};

module.exports = SpriteSheet;