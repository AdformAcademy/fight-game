function Player(id, number, x, y){
   this.ID = id;
   this.Player_number = number;
   this.X = x;
   this.Y = y;
}
Player.prototype.getID = function(){
    alert(this.ID);
}
Player.prototype.getPlayer_number = function(){
    alert(this.Player_number);
}
Player.prototype.setPlayer_number = function(number){
    this.Player_number = number;
}
Player.prototype.getDimensions = function(){
    alert(this.X + this.Y);
}
Player.prototype.setDimensions = function(x, y){
    this.X = x;
    this.Y = y;
}

module.exports = Player;