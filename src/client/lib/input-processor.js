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

	if (control.isDown(keys.RIGHT)) {
		if (x < this.world.width - 185 
				&& Collisions.checkRightCollision(player, opponent, size)
				&& camera.leftCollision(opponent, size)) {
			input.key = actions.RIGHT;
		}
	}
	else if (control.isDown(keys.LEFT)) {
		if (x > this.world.left - 135 
				&& Collisions.checkLeftCollision(player, opponent, size)
				&& camera.rightCollision(opponent, size)) {
			input.key = actions.LEFT;
		}
	}
};

InputProcessor.prototype.processComboInputs = function (input) {

	var physics = App.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;
	
	if(!player.isJumping() && !player.isDefending()) {
		if (control.quickTapped(keys.KICK) && player.hasEnoughEnergy('kickCombo')) {
			player.setUsingCombo(true);
			player.setHiting(true);
			var hit = physics.hit(600, 80, 15, 60);
			input.kickCombo = true;
				if(hit != 0) {
					SoundCollection.play('player', 'comboKick');
					SoundCollection.play('player', 'kick');
					SoundCollection.play('opponent', 'hit');
				} else {
					SoundCollection.play('player', 'comboKick');
					SoundCollection.play('common', 'miss');
				}
			}
		if (control.quickTapped(keys.PUNCH) && player.hasEnoughEnergy('punchCombo')) {
			player.setUsingCombo(true);
			player.setHiting(true);
			var hit = physics.hit(800, 65, 0, 60);
			input.punchCombo = true;
				if(hit != 0) {
					SoundCollection.play('player', 'comboPunch');
					SoundCollection.play('player', 'punch');
					SoundCollection.play('opponent', 'hit');
				} else {
					SoundCollection.play('player', 'comboPunch');
					SoundCollection.play('common', 'miss');
				}
		}	
		else if (control.isDown(keys.PUNCH) && player.hasEnoughEnergy('punch')) {
				var hit = physics.hit(300, 65, 5, 60);
			player.setHiting(true);
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
				var hit = physics.hit(400, 80, 10, 60);
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
		var hit = physics.hit(780, 65, 5, 120);
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
		var hit = physics.hit(780, 80, 10, 120);
		input.kickKey = true;

		if(hit != 0) {
			SoundCollection.play('player', 'kick');
			SoundCollection.play('opponent', 'hit');
		} else {
			SoundCollection.play('common', 'miss');
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

	if (control.isDown(keys.JUMP) && player.hasEnoughEnergy('jump') && !player.isDefending()) {
		if(!player.isJumping()) {
			input.jumpKey = true;
			player.setJumping(true);
			player.setSpeedZ(Config.playerJumpSpeed);
			physics.jump();
		}
	}
	if (control.isDown(keys.DEFEND) && !player.isJumping()) {
			player.setDefending(true);
			input.key = actions.DEFEND;
		}
	else {
		player.setDefending(false);
	}
	
};

InputProcessor.prototype.processInputs = function() {
	var input = this.createBlankInput();
	var player = this.player;

	if(!player.isHiting() && !player.isPunched()) {
		this.processComboInputs(input);
		this.processActionInputs(input);
	}
	if(!player.isHiting() && !player.isPunched() 
			&& !player.isDefending() || player.isJumping()) {
		this.processMovementInputs(input);
	}
	this.inputCounter++;
	return input;
};

module.exports = InputProcessor;