var Config = require('./config');
var Collisions = require('../../common/collisions');
var SoundCollection = require('./sound-collection');

var WorldPhysics = function(params) {
	this.player = params.player;
	this.opponent = params.opponent;
	this.world = params.world;
	this.parallax = params.parallax;
	this.camera = params.camera;
	this.animating = false;
	this.oldAnimatingValue = -1;
};

WorldPhysics.prototype.applyCoordinates = function(player, x, z) {
	player.setX(x);
	if (z !== null) {
		player.setZ(z);
	}
};

WorldPhysics.prototype.applyInput = function(player, input) {
	if (!input) {
		return;
	}
	var opponent = player === this.player ? this.opponent : this.player;
	var actions = Config.actions;
	var x = player.getX();
	var z = player.getZ();

	if (input.key === actions.RIGHT) {
		x += Config.playerMoveSpeed;
	}
	else if (input.key === actions.LEFT) {
		x -= Config.playerMoveSpeed;
	}

	this.applyCoordinates(player, x, z);
};

WorldPhysics.prototype.jump = function () {
	var player = this.player;
    var opponent = this.opponent;
    SoundCollection.play('common', 'jump');
    SoundCollection.play('player', 'jump');
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
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setJumping(false);
			clearInterval(updateZ);
			z = 0;
			speedZ = 0;
			SoundCollection.play('common', 'land');
		}
		player.setZ(z);
		player.setSpeedZ(speedZ);
	}, 1000/30);
};
WorldPhysics.prototype.hit = function (time, size, power, heightDifference) {
	var self = this;
	var player = this.player;
	var opponent = this.opponent;
	var t = 0;
	var hit = 0;
	var x = player.getX();
    var opx = opponent.getX();

	if(Collisions.checkPunchCollisionLeft(player, opponent, size, heightDifference)){
		hit = 1;
		opponent.setPunched(2);
	}
	if(Collisions.checkPunchCollisionRight(player, opponent, size, heightDifference)){
		hit = 2;
		opponent.setPunched(2);
	}	
	var updateH = setInterval(function () {
		t += 30;
		if (t >= time) {
			if(hit == 1){
				if(opx < self.world.width - 185){
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
				if(opx > self.world.left - 135){
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
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setHiting(false);
			player.setUsingCombo(false);
			clearInterval(updateH);
		}
	}, 1000/30);

	return hit;
};

WorldPhysics.prototype.updatePlayerAnimation = function (packet) {
	var keys = Config.keyBindings;
	var actions = Config.actions;
	var player = this.player;
	var opponent = this.opponent;
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
	} else if (packet.key === actions.DEFEND) {
		playerSprite.setActiveAnimation('defendAnimation');
	}
	if (player.isStanding() && !player.isHiting()) {
		if (packet.key !== 0) {
			if(player.getX() < opponent.getX()) {
				if (packet.key === actions.RIGHT)
					playerSprite.setActiveAnimation('moveLeftAnimation');
				else if (packet.key === actions.LEFT)
					playerSprite.setActiveAnimation('moveRightAnimation');
			}
			else {
				if (packet.key === actions.LEFT)
					playerSprite.setActiveAnimation('moveLeftAnimation');
				else if (packet.key === actions.RIGHT)
					playerSprite.setActiveAnimation('moveRightAnimation');
			}
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
			playerSprite.setActiveAnimation('jumpPunchAnimation');
		}
		else if (packet.kickKey) {
			playerSprite.setActiveAnimation('jumpKickAnimation');
		}
	}
};

WorldPhysics.prototype.flipPlayerSpritesheets = function () {
	var player = this.player;
	var opponent = this.opponent;
	var playerSpriteSheet = player.getSpriteSheet();
	var opponentSpriteSheet = opponent.getSpriteSheet();
	var x = player.getX();
	var opx = opponent.getX();

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
	var z = player.getZ();
	var oz = opponent.getZ();

	if (z < oz || !player.isPunched()) {
		player.setDepth(0);
		opponent.setDepth(1);
	} else {
		player.setDepth(1);
		opponent.setDepth(0);
	}
};

WorldPhysics.prototype.applyParallax = function (packet) {
	var actions = Config.actions;
	if(!this.player.isHiting()){
		if (packet.key === actions.RIGHT) {
			this.parallax.moveRight();
		} else if (packet.key === actions.LEFT) {
			this.parallax.moveLeft();
		}
	}
};

WorldPhysics.prototype.updateViewport = function () {
	var player = this.player;
	var opponent = this.opponent;
	var x = player.getX();
	var opx = opponent.getX();

	if (this.camera.isFollowing()) {
		if (x < opx) {
			this.animateViewportChange(320);
		}
		else {
			this.animateViewportChange(0);
		}
	}
};

WorldPhysics.prototype.animateViewportChange = function (amount) {
	if (this.animating || this.oldAnimatingValue === amount) {
		return;
	}
	this.oldAnimatingValue = amount;
	this.animating = true;
	var self = this;
	var camera = this.camera;
	var currentAlign = this.camera.getObjectAlign();
	var currentAmount = amount;
	var addition = currentAmount > currentAlign ? 10 : -10;
	var animate = setInterval(function () {
		currentAlign += addition;
		if (currentAmount > currentAlign && addition < 0 
				|| currentAmount < currentAlign && addition > 0) {
			currentAlign = currentAmount;
		}

		camera.setObjectAlign(currentAlign);

		if (currentAlign === currentAmount) {
			clearInterval(animate);
			self.animating = false;
		}
	}, 1000 / 30);
};

module.exports = WorldPhysics;