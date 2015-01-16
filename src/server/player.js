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
  var _punching = false;
  var _punched = 0;
  var _kicking = false;
  var _defending = false;
  var _usingCombo = false;
  var _lastProcessedInput = 0;
  var _currentAnimation = null;
  var _characterData = params.characterData;

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

  obj.isPunching = function() {
    return _punching;
  };

  obj.isPunched = function() {
    return _punched;
  };
  obj.isKicking = function() {
    return _kicking;
  }

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

  obj.setPunching = function(punching) {
    _punching = punching;
  };

  obj.setPunched = function(punched) {
    _punched = punched;
  };

  obj.setKicking = function (kicking) {
    _kicking = kicking;
  }

  obj.setDefending = function (defending) {
    _defending = defending;
  };

  obj.isDefending = function() {
    return _defending;
  };

  obj.isJumpingAndPunching = function () {
    return _jumping && _punching;
  }

  obj.setUsingCombo = function (combo) {
    _usingCombo = combo;
  };

  obj.usingCombo = function () {
    return _usingCombo;
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

  obj.getCharacterData = function () {
    return _characterData;
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

module.exports = Player;