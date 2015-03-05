var Player = require('./player');
var Collisions = require('../common/collisions');
var Config = require('./config');

var WorldPhysics = {};

WorldPhysics.jump = function(player, opponent) {
    var x = player.getX();
    var z = player.getZ();
    var opx = opponent.getX();
    var opz = opponent.getZ();
    var speedZ = player.getSpeedZ();

    if(z < 0 || player.isJumping()) {
		speedZ -= Config.playerAcceleration;
		z -= speedZ;
		if(z >= 0) {
			z = 0;
			speedZ = 0;
			player.setJumping(false);
			opponent.storeSound('common', 'land');
		}
	};
	player.setZ(z);
	player.setSpeedZ(speedZ);
};


WorldPhysics.hit = function (player, opponent, damage, time, size, power, heightDifference) {
	player.useEnergy(damage);

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
		opponent.storeParticle('blood');
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
			if(damage === 'punchCombo' || damage === 'kickCombo') {
				player.setUsingCombo(false);
			}
			clearInterval(updateH);
		}
	}, 1000/30);

	return hit;
};

module.exports = WorldPhysics;