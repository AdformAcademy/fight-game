var PlayerCollection = require('./player-collection');
var Player = require('./player');
var Collisions = require('../common/collisions');
var Config = require('./config');

var WorldPhysics = function(params) {
	this.player = params.player;
	this.opponent = params.opponent;
};

WorldPhysics.jump = function (player, opponent) {
	player.useEnergy('jump');
	var d = new Date();
	var n1 = d.getTime();
	var t = 0;
	console.log(n1);
	var updateZ = setInterval(function () {
		t += 1;
	    var x = player.getX();
	    var z = player.getZ();
	    var opx = opponent.getX();
	    var opz = opponent.getZ();
	    var speedZ = player.getSpeedZ();
	    var size = Config.playerSize;
		speedZ -= Config.playerAcceleration;
		z -= speedZ;
		if (z > 0) {
			var d2 = new Date();
			var n2 = d2.getTime();
			console.log(n2);
			console.log('');
			console.log(n2-n1);
			console.log('');
			console.log(t);
			player.setJumping(false);
			clearInterval(updateZ);
			z = 0;
			speedZ = 0;
			opponent.storeSound('common', 'land');
		}
		player.setZ(z);
		player.setSpeedZ(speedZ);
	}, 1000/30);
};

WorldPhysics.hit = function (player, damage, time, size, power, heightDifference) {
	player.useEnergy(damage);
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());

	var t = 0;
	var hit = 0;
	var dealingDamage = false;
	var x = player.getX();
    var opx = opponent.getX();
    var map = player.getMap();

	if(Collisions.checkPunchCollisionLeft(player, opponent, size, heightDifference)){
		hit = 1;
		opponent.setPunched(1);
	}
	if(Collisions.checkPunchCollisionRight(player, opponent, size, heightDifference)){
		hit = 2;
		opponent.setPunched(1);
	}
	if(hit) {
		opponent.dealDamage(player.getDamage(damage));
	}
	else
		player.useEnergy(damage);

	var updateH = setInterval (function () {
		t += 30;
		if(t >= time) {
			if(hit == 1){
				if(opx < map.dimensions.width - 185){
					opx += power;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
				else{
					x -= power;
					player.setX(x);
					opponent.setPunched(0);
				}
			}
			else if(hit == 2){
				if(opx > map.dimensions.left - 135){
					opx -= power;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
				else{
					x += power;
					player.setX(x);
					opponent.setPunched(0);
				}
			}
			player.setHiting(false);
			clearInterval(updateH);
		}
	}, 1000/30);

	return hit;
};

module.exports = WorldPhysics;