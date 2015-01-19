var App = require('../app');
var Client = require('./client');
var Collisions = require('../../common/collisions');
var InputCollection = require('./input-collection');
var Config = require('./config');

var InputProcessor = function (params) {
	this.player = params.player;
	this.opponent = params.opponent;
	this.canvas = App.canvasObj;
	this.inputCounter = 0;
};

InputProcessor.prototype.createBlankInput = function () {
	return {
		id: this.inputCounter,
		key: 0,
		jumpKey: false,
		punchKey: false,
		kickKey: false,
		punchCombo: false,
		kickCombo: false
	};
};

InputProcessor.prototype.processMovementInputs = function (input) {

	var keys = Config.keyBindings;
	var control = InputCollection;
	var screenWidth = this.canvas.getWidth();
	var screenHeight = this.canvas.getHeight();
	var player = this.player;
	var opponent = this.opponent;
	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var size = Config.playerSize;

	if (control.isDown(keys.RIGHT) && control.isDown(keys.UP)) {
		if (x < screenWidth - 185 && y > 150 
			&& Collisions.checkRightCollision(player, opponent, size)
			&& Collisions.checkUpCollision(player, opponent, size)) {
			input.key = keys.UP_RIGHT;
		}
		else if (x < screenWidth - 185 
			&& Collisions.checkRightCollision(player, opponent, size)) {
			input.key = keys.RIGHT;
		}
		else if (y > 150 && Collisions.checkUpCollision(player, opponent, size)) {
			input.key = keys.UP;
		}
	}
	else if (control.isDown(keys.LEFT) && control.isDown(keys.UP)) {
		if (x > -135 && y > 150 && Collisions.checkLeftCollision(player, opponent, size)
			&& Collisions.checkUpCollision(player, opponent, size)) {
			input.key = keys.UP_LEFT;
		}
		else if (x > -135 && Collisions.checkLeftCollision(player, opponent, size)) {
			input.key = keys.LEFT;
		}
		else if (y > 150 && Collisions.checkUpCollision(player, opponent, size)) {
			input.key = keys.UP;
		}
	}
	else if (control.isDown(keys.DOWN) && control.isDown(keys.LEFT)) {
		if (x > -135 && y < screenHeight - 200 
				&& Collisions.checkLeftCollision(player, opponent, size)
				&& Collisions.checkDownCollision(player, opponent, size)) {
			input.key = keys.DOWN_LEFT;
		}
		else if (x > -135 && Collisions.checkLeftCollision(player, opponent, size)) {
			input.key = keys.LEFT;
		}
		else if (y < screenHeight - 200 
				&& Collisions.checkDownCollision(player, opponent, size)) {
			input.key = keys.DOWN;
		}
	}
	else if (control.isDown(keys.DOWN) && control.isDown(keys.RIGHT)) {
		if (x < screenWidth - 185 && y < screenHeight - 200 
				&& Collisions.checkRightCollision(player, opponent, size)
				&& Collisions.checkDownCollision(player, opponent, size)) {
			input.key = keys.DOWN_RIGHT;
		}
		else if (x < screenWidth - 185 
				&& Collisions.checkRightCollision(player, opponent, size)) {
			input.key = keys.RIGHT;
		}
		else if (y < screenHeight - 200 
				&& Collisions.checkDownCollision(player, opponent, size)) {
			input.key = keys.DOWN;
		}
	}
	else if (control.isDown(keys.RIGHT)) {
		if (x < screenWidth - 185 && Collisions.checkRightCollision(player, opponent, size)) {
			input.key = keys.RIGHT;
		}
	}
	else if (control.isDown(keys.LEFT)) {
		if (x > -135 && Collisions.checkLeftCollision(player, opponent, size)) {
			input.key = keys.LEFT;
		}
	}
	else if (control.isDown(keys.UP)) {
		if (y > 150 && Collisions.checkUpCollision(player, opponent, size)) {
			input.key = keys.UP;
		}
	}
	else if (control.isDown(keys.DOWN)) {
		if (y < screenHeight - 200 && Collisions.checkDownCollision(player, opponent, size)) {
			input.key = keys.DOWN;
		}
	}
};

InputProcessor.prototype.processComboInputs = function (input) {

	var physics = Client.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;

	if (control.quickTapped(keys.KICK) && !player.isJumping()) {
		player.setUsingCombo(true);
		physics.comboKick();
		input.kickCombo = true;
		console.log('kick combo');
	}
	else if (control.isDown(keys.PUNCH) && player.isJumping()) {
		console.log("jumping and punching");
		player.setPunching(true);
		physics.punch();
		input.punchKey = true;
	}
	else if (control.quickTapped(keys.PUNCH) && !player.isJumping()) {
		player.setUsingCombo(true);
		physics.comboPunch();
		input.punchCombo = true;
		console.log('combo punch');
	}
	else if (control.isDown(keys.PUNCH)) {
		input.punchKey = true;
		player.setPunching(true);
		physics.punch();
		console.log('simple punch');
	}
	else if(control.isDown(keys.KICK)) {
		input.kickKey = true;
		player.setKicking(true);
		physics.kick();
		console.log('simple kick');
	}
};

InputProcessor.prototype.processActionInputs = function (input) {
	var physics = Client.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;
	var opponent = this.opponent;
	var y = player.getLocation().getY();
	var z = player.getZ();
	var opy = opponent.getLocation().getY();
	var opz = opponent.getZ();
	var size = Config.playerSize;

	if (control.isDown(keys.JUMP)) {
		if(!player.isJumping() && y + z > 0 && y - opz - opy != size) {
			var speedZ = Config.playerJumpSpeed;
			input.jumpKey = true;
			player.setSpeedZ(speedZ);
			player.setJumping(true);
			physics.jump();
		}
	}
	if (control.isDown(keys.DEFEND)) {
		if (!player.isDefending()) {
			player.setDefending(true);
		}
		input.key = keys.DEFEND;
	}
	else {
		player.setDefending(false);
	}
};

InputProcessor.prototype.processInputs = function() {
	var input = this.createBlankInput();
	var player = this.player;

	if(!player.isPunching() && !player.isKicking() 
			&& !player.isPunched() && !player.usingCombo()) {
		this.processMovementInputs(input);
		this.processComboInputs(input);
		this.processActionInputs(input);
	}
	this.inputCounter++;
	return input;
};

module.exports = InputProcessor;