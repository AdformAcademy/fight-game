var Player = function(params) {
  var obj = {};
  var _id = params.id;
  var _opponentId = params.opponentId;
  var _location = {
    x: params.x || 0,
    y: params.y || 0,
    z: params.z || 0
  };
  var _speedZ = 0;
  var _jumping = false;
  var _lastProcessedInput = 0;
  var _currentAnimation = 0;

  obj.getID = function() {
    return _id;
  };

  obj.getOpponentId = function() {
    return _opponentId;
  };

  obj.setOpponentId = function(opponentId) {
    _opponentId = opponentId;
  };

  obj.getX = function() {
    return _location.x;
  };

  obj.getY = function() {
    return _location.y;
  };

  obj.getZ = function() {
    return _location.z;
  };

  obj.getSpeedZ = function() {
    return _speedZ;
  };

  obj.isJumping = function() {
    return _jumping;
  };

  obj.setX = function(x) {
    _location.x = x;
  };

  obj.setY = function(y) {
    _location.y = y;
  };

  obj.setZ = function(z) {
    _location.z = z;
  };

  obj.setSpeedZ = function(speedZ) {
    _speedZ = speedZ;
  };

  obj.setJumping = function(jumping) {
    _jumping = jumping;
  };

  obj.setLastProcessedInput = function(input) {
    _lastProcessedInput = input;
  };

  obj.getLastProcessedInput = function() {
    return _lastProcessedInput;
  };

  obj.setCurrentAnimation = function (animation) {
    _currentAnimation = animation;
  };

  obj.getCurrentAnimation = function () {
    return _currentAnimation;
  };

  obj.toPacket = function() {
    return {
      x: _location.x,
      y: _location.y,
      z: _location.z,
      currentAnimation: _currentAnimation
    };
  };

  return obj;
};

Player.KeyBindings = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  UP_LEFT: 41,
  UP_RIGHT: 42,
  DOWN_LEFT: 43,
  DOWN_RIGHT: 44,
  SPACE: 88,
  PUNCH: 90
};

module.exports = Player;