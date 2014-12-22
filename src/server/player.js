function Player(id, opponentId, x, y){
  this.id = id;
  this.opponentId = opponentId;
  this.x = x;
  this.y = y;
  this.z = 0;
  this.speedZ = 0;
  this.jumping = false;
  this.lastProcessedInput = 0;
}

Player.prototype.getID = function(){
  return this.id;
}

Player.prototype.getOpponentId = function(){
  return this.opponentId;
}

Player.prototype.setOpponentId = function(opponentId){
  this.opponentId = opponentId;
}

Player.prototype.getX = function(){
  return this.x;
}

Player.prototype.getY = function(){
  return this.y;
}

Player.prototype.getZ = function(){
  return this.z;
}

Player.prototype.getSpeedZ = function(){
  return this.speedZ;
}

Player.prototype.getJumping = function(){
  return this.jumping;
}

Player.prototype.setX = function(x){
  this.x = x;
}

Player.prototype.setY = function(y){
  this.y = y;
}

Player.prototype.setZ = function(z){
  this.z = z;
}

Player.prototype.setSpeedZ = function(speedZ){
  this.speedZ = speedZ;
}

Player.prototype.setJumping = function(jumping){
  this.jumping = jumping;
}

Player.prototype.setLastProcessedInput = function(input) {
  this.lastProcessedInput = input;
}

Player.prototype.getLastProcessedInput = function() {
  return this.lastProcessedInput;
}

Player.KeyBindings = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  UP_LEFT: 41,
  UP_RIGHT: 42,
  DOWN_LEFT: 43,
  DOWN_RIGHT: 44,
  SPACE: 88
};

module.exports = Player;