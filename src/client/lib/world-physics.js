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

		if (Math.abs(x - opx) < size && Math.abs(y - opy) < size / 3) {
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
			if (z >= -(y + size - opy)) {
				z = -(y + size - opy);
				speedZ = 0;
				player.getSpriteSheet().setActiveAnimation('standAnimation');
			}
		}
		else {
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
		}
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

WorldPhysics.prototype.comboPunch = function () {
	var t = 0;
	var player = this.player;
	var updateP = setInterval(function () {
		t += 30;
		if (t >= 800) {
			player.setUsingCombo(false);
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			clearInterval(updateP);
		}
	}, 1000/30);
};

WorldPhysics.prototype.comboKick = function () {
	var t = 0;
	var player = this.player;
	var updateP = setInterval(function () {
		t += 30;
		if (t >= 600) {
			player.setUsingCombo(false);
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			clearInterval(updateP);
		}
	}, 1000/30);
}

WorldPhysics.prototype.punch = function () {
	var player = this.player;
	var t = 0;
	var updateP = setInterval(function () {
		t += 30;
		if (player.usingCombo()) {
			player.setPunching(false);
			clearInterval(updateP);
		}
		if (t >= 300) {
			player.setPunching(false);
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			clearInterval(updateP);
		}
	}, 1000/30);
};

WorldPhysics.prototype.kick = function () {
	var player = this.player;
	var t = 0;
	var updateP = setInterval(function () {
		t += 30;
		if (player.usingCombo()) {
			player.setKicking(false);
			clearInterval(updateP);
		}
		if (t >= 400) {
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setKicking(false);
			clearInterval(updateP);
		}
	}, 1000/30);
};

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

	if (player.isStanding()) {
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