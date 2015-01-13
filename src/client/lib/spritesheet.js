var SpriteSheet = function(params) {
	var App = require('../app');
	var obj = {};

	var _canvas = App.canvasObj.canvas;
	var _image = params.image;
	var _data = params.data;
	var _animations = _data.animations;
	var _dimensions = _data.spriteDimensions;

	var _activeAnimation = _animations[_data.defaultAnimation];
	var _order = _activeAnimation.order;

	var _speed = _order === 'asc' ? Math.abs(_activeAnimation.speed)
 		: -Math.abs(_activeAnimation.speed);
	
	var _startFrame = _order === 'asc' ? _activeAnimation.startFrame 
		: _activeAnimation.startFrame + _activeAnimation.frames - 1;
	var _currentFrame = _startFrame;
	var _activeFrameIndex = _startFrame;
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
			_order = _activeAnimation.order;
			_startFrame = _order === 'asc' ? _activeAnimation.startFrame 
				: _activeAnimation.startFrame + _activeAnimation.frames - 1;
			_currentFrame = _startFrame;
			_activeFrameIndex = _startFrame;
			_speed = _order === 'asc' ? Math.abs(_activeAnimation.speed)
		 		: -Math.abs(_activeAnimation.speed);
		}
	};

	obj.getAnimationOrder = function () {
		return _activeAnimation.order;
	};

	obj.setAnimationOrder = function (order) {
		_order = order;
		_speed = _order === 'asc' ? Math.abs(_activeAnimation.speed)
 		: -Math.abs(_activeAnimation.speed);
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
		if (_activeAnimation.order === 'asc') {
			if (_activeFrameIndex > _activeAnimation.startFrame + _activeAnimation.frames) {
				_activeFrameIndex = _startFrame;
			}
			_currentFrame = Math.floor(_activeFrameIndex);
		} else {
			if (_activeFrameIndex < _activeAnimation.startFrame) {
				_activeFrameIndex = _startFrame;
			}
			_currentFrame = Math.ceil(_activeFrameIndex);
		}
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