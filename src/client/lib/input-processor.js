var App = require('../app');
var Collisions = require('../../common/collisions');
var InputCollection = require('./input-collection');
var Config = require('./config');
var SoundCollection = require('./sound-collection');

var InputProcessor = function (params) {
	this.player = params.player;
	this.opponent = params.opponent;
	this.canvas = App.canvasObj;
	this.world = params.world;
	this.camera = params.camera;
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
	var actions = Config.actions;
	var control = InputCollection;
	var screenWidth = this.canvas.getWidth();
	var screenHeight = this.canvas.getHeight();
	var player = this.player;
	var opponent = this.opponent;
	var x = player.getX();
	var size = Config.playerSize;
	var camera = this.camera;

	if (control.isDown(keys.RIGHT) && !player.isFatality() && !player.isDefeated()) {
		if (x < this.world.width - 185 
				&& Collisions.checkRightCollision(player, opponent, size)
				&& camera.leftCollision(opponent, size)) {
			input.key = actions.RIGHT;
		}
	}
	else if (control.isDown(keys.LEFT) && !player.isFatality() && !player.isDefeated()) {
		if (x > this.world.left - 135 
				&& Collisions.checkLeftCollision(player, opponent, size)
				&& camera.rightCollision(opponent, size)) {
			input.key = actions.LEFT;
		}
	}
};

InputProcessor.prototype.processHitInputs = function (input) {
	var physics = App.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;

	if(!player.isJumping() && !player.isDefending() && !player.isFatality()) {
		if (control.isDown(keys.PUNCH) && player.hasEnoughEnergy('punch')) {
			player.setHiting(true);
			var hit = physics.hit(player.getSpeed("punch"), 65, 5, 60, false);
			input.punchKey = true;
				if(hit != 0) {
					SoundCollection.play('player', 'punch');
					SoundCollection.play('opponent', 'hit');
				} else {
					SoundCollection.play('common', 'miss');
				}
		}
		else if(control.isDown(keys.KICK) && player.hasEnoughEnergy('kick')) {
			player.setHiting(true);
			var hit = physics.hit(player.getSpeed("kick"), 80, 10, 60, false);
			input.kickKey = true;
				if(hit != 0) {
					SoundCollection.play('player', 'kick');
					SoundCollection.play('opponent', 'hit');
				} else {
					SoundCollection.play('common', 'miss');
				}
		}
	}
	else if (control.isDown(keys.PUNCH) && player.isJumping() && player.hasEnoughEnergy('punch')) {
		player.setHiting(true);
		var hit = physics.hit(player.getSpeed("punch"), 65, 5, 120, player.isUsingCombo());
		input.punchKey = true;

		if(hit != 0) {
			SoundCollection.play('player', 'punch');
			SoundCollection.play('opponent', 'hit');
		} else {
			SoundCollection.play('common', 'miss');
		}
	}
	else if (control.isDown(keys.KICK) && player.isJumping() && player.hasEnoughEnergy('kick')) {
		player.setHiting(true);
		var hit = physics.hit(player.getSpeed("kick"), 80, 10, 120, player.isUsingCombo());
		input.kickKey = true;

		if(hit != 0) {
			SoundCollection.play('player', 'kick');
			SoundCollection.play('opponent', 'hit');
		} else {
			SoundCollection.play('common', 'miss');
		}
	}
}

InputProcessor.prototype.processComboInputs = function (input) {

	var physics = App.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;

	if (control.quickTapped(keys.KICK) && player.hasEnoughEnergy('kickCombo') && !player.usingCombo()) {
		if(!player.isJumping() && !player.isDefending() && !player.isFatality()) {
			player.setHiting(true);
			player.setUsingCombo(true);
			var hit = physics.hit(player.getSpeed("kickCombo"), 80, 15, 60, true);
			input.kickCombo = true;
			if(hit != 0) {
				SoundCollection.play('player', 'comboKick');
				SoundCollection.play('player', 'kick');
				SoundCollection.play('opponent', 'hit');
				physics.shakeCamera(3, 5000, 1.02);
			} else {
				SoundCollection.play('player', 'comboKick');
				SoundCollection.play('common', 'miss');
			}
		}
	}
	if (control.quickTapped(keys.PUNCH) && player.hasEnoughEnergy('punchCombo') && !player.usingCombo()) {
		if(!player.isJumping() && !player.isDefending() && !player.isFatality()) {
			player.setHiting(true);
			player.setUsingCombo(true);
			var hit = physics.hit(player.getSpeed("punchCombo"), 65, 0, 60, true);
			input.punchCombo = true;
			if(hit != 0) {
				SoundCollection.play('player', 'comboPunch');
				SoundCollection.play('player', 'punch');
				SoundCollection.play('opponent', 'hit');
				physics.shakeCamera(3, 5000, 1.02);
			} else {
				SoundCollection.play('player', 'comboPunch');
				SoundCollection.play('common', 'miss');
			}
		}
	}
};

InputProcessor.prototype.processActionInputs = function (input) {
	var physics = App.physics;
	var keys = Config.keyBindings;
	var actions = Config.actions;
	var control = InputCollection;
	var player = this.player;
	var opponent = this.opponent;
	var z = player.getZ();
	var opz = opponent.getZ();
	var size = Config.playerSize;

	if (control.isDown(keys.DEFEND) && !player.isJumping()) {
			player.setDefending(true);
			input.key = actions.DEFEND;
		}
	else {
		player.setDefending(false);
	}
	if (control.isDown(keys.JUMP) && player.hasEnoughEnergy('jump') && !player.isDefending()) {
		if(!player.isJumping()) {
			input.jumpKey = true;
			player.setJumping(true);
			player.setSpeedZ(Config.playerJumpSpeed);
			physics.jump();
		}
	}	
};

var proc = 0;

InputProcessor.prototype.processInputs = function() {
	var input = this.createBlankInput();
	var player = this.player;

	if(!player.isHiting() && !player.isPunched()) {
		this.processHitInputs(input);
		this.processActionInputs(input);
	}
	this.processComboInputs(input);
	if(!player.isHiting() && !player.isPunched() && !player.isDefending() || player.isJumping()) {
		this.processMovementInputs(input);
	}
	this.inputCounter++;
	return input;
};

module.exports = InputProcessor;