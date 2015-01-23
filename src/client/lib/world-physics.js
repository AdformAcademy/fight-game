var Config = require('./config');

var WorldPhysics = function(params) {
	this.player = params.player;
	this.opponent = params.opponent;
};

WorldPhysics.prototype.applyCoordinates = function(player, x, y, z) {
	var playerLocation = player.getLocation();
	playerLocation.setX(x);
	playerLocation.setY(y);
	if (z !== null) {
		player.setZ(z);
	}
};

WorldPhysics.prototype.applyInput = function(player, input) {
	if (!input) {
		return;
	}
	var opponent = player === this.player ? this.opponent : this.player;
	var keys = Config.keyBindings;
	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();

	if (input.key === keys.UP_RIGHT) {
		x += Config.playerMoveSpeed;
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.UP_LEFT) {
		x -= Config.playerMoveSpeed;
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.DOWN_LEFT) {
		x -= Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if (input.key === keys.DOWN_RIGHT) {
		x += Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if (input.key === keys.RIGHT) {
		x += Config.playerMoveSpeed;
	}
	else if (input.key === keys.LEFT) {
		x -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.UP) {
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.DOWN) {
		y += Config.playerMoveSpeed;
	}

	this.applyCoordinates(player, x, y, z);
};

WorldPhysics.prototype.jump = function () {
	var player = this.player;
    var opponent = this.opponent;
	var updateZ = setInterval(function () {
	    var x = player.getLocation().getX();
	    var y = player.getLocation().getY();
	    var z = player.getZ();
	    var opx = opponent.getLocation().getX();
	    var opy = opponent.getLocation().getY();
	    var opz = opponent.getZ();
	    var speedZ = player.getSpeedZ();
	    var size = Config.playerSize;
		speedZ -= Config.playerAcceleration;
		z -= speedZ;
		if (z > 0) {
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setJumping(false);
			clearInterval(updateZ);
			z = 0;
			speedZ = 0;
		}
		player.setZ(z);
		player.setSpeedZ(speedZ);
	}, 1000/30);
};
WorldPhysics.prototype.hit = function (time, size, power, heightDifference, yDifference) {
	var player = this.player;
	var opponent = this.opponent;
	var t = 0;
	var hit = 0;
	var x = player.getX();
    var opx = opponent.getX();

	if(WorldPhysics.checkPunchCollisionLeft(player, opponent, size, heightDifference, yDifference)){
		hit = 1;
		opponent.setPunched(2);
	}
	if(WorldPhysics.checkPunchCollisionRight(player, opponent, size, heightDifference, yDifference)){
		hit = 2;
		opponent.setPunched(2);
	}
	var updateH = setInterval(function () {
		t += 30;
		if (t >= time) {
			if(hit == 1){
				if(opx < Config.screenWidth - 185){
					opx += power;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			else if(hit == 2){
				if(opx > -135){
					opx -= power;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setHiting(false);
			player.setUsingCombo(false);
			clearInterval(updateH);
		}
	}, 1000/30);
};

WorldPhysics.checkPunchCollisionLeft = function(player, opponent, size, heightDifference, yDifference) {
	return (player.getX() < opponent.getX() && opponent.getX() - player.getX() < size
		&& (Math.abs(player.getY() - opponent.getY()) <= yDifference)
		&& (Math.abs(player.getZ() - opponent.getZ()) <= heightDifference));
}

WorldPhysics.checkPunchCollisionRight = function(player, opponent, size, heightDifference, yDifference) {
	return (player.getX() > opponent.getX() && player.getX() - opponent.getX() < size
		&& (Math.abs(player.getY() - opponent.getY()) <= yDifference)
		&& (Math.abs(player.getZ() - opponent.getZ()) <= heightDifference));
}

WorldPhysics.prototype.updatePlayerAnimation = function (packet) {
	var keys = Config.keyBindings;
	var player = this.player;
	var playerSprite = player.getSpriteSheet();

	if (packet.kickCombo) {
		playerSprite.setActiveAnimation('kickComboAnimation');
	} else if (packet.punchCombo) {
		playerSprite.setActiveAnimation('punchComboAnimation');
	} else if (packet.punchKey) {
		var punchNumber = Math.ceil(Math.random() * 2);
		playerSprite.setActiveAnimation('punchAnimation' + punchNumber);
	} else if (packet.kickKey) {
		playerSprite.setActiveAnimation('kickAnimation');
	} else if (packet.jumpKey) {
		playerSprite.setActiveAnimation('jumpAnimation');
	} else if (packet.key === keys.DEFEND) {
		playerSprite.setActiveAnimation('defendAnimation');
	}
	if (player.isStanding() && !player.isHiting()) {
		if (packet.key !== 0) {
			playerSprite.setActiveAnimation('moveAnimation');
		}
		else if (player.isPunched()) {
			playerSprite.setActiveAnimation('damageAnimation');
		}
		else if (!player.isPunched()) {
			playerSprite.setActiveAnimation('standAnimation');
		}
	}
	if (player.isJumping()) {
		if (packet.punchKey) {
			console.log('JUMP TEST');
			playerSprite.setActiveAnimation('jumpPunchAnimation');
		}
		else if (packet.kickKey) {
			console.log('JUMP TEST');
			playerSprite.setActiveAnimation('jumpKickAnimation');
		}
	}
};

WorldPhysics.prototype.flipPlayerSpritesheets = function () {
	var player = this.player;
	var opponent = this.opponent;
	var playerSpriteSheet = player.getSpriteSheet();
	var opponentSpriteSheet = opponent.getSpriteSheet();
	var x = player.getLocation().getX();
	var opx = opponent.getLocation().getX();

	if (x < opx) {
		playerSpriteSheet.flipAnimation(true);
		opponentSpriteSheet.flipAnimation(false);
	}
	else {
		playerSpriteSheet.flipAnimation(false);
		opponentSpriteSheet.flipAnimation(true);
	}

	player.setSpriteSheet(playerSpriteSheet);
	opponent.setSpriteSheet(opponentSpriteSheet);
};

WorldPhysics.prototype.updatePlayersDepth = function () {
	var player = this.player;
	var opponent = this.opponent;
	var y = player.getLocation().getY();
	var z = player.getZ();
	var oy = opponent.getLocation().getY();
	var oz = opponent.getZ();

	if (y > oy) {
		player.setDepth(0);
		opponent.setDepth(1);
	} else {
		player.setDepth(1);
		opponent.setDepth(0);
	}
};

module.exports = WorldPhysics;