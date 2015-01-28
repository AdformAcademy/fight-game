var App = require('../app');
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

	if (control.isDown(keys.RIGHT)) {
		if (x < screenWidth - 185 && Collisions.checkRightCollision(player, opponent, size)) {
			input.key = keys.RIGHT;
		}
	}
	else if (control.isDown(keys.LEFT)) {
		if (x > -135 && Collisions.checkLeftCollision(player, opponent, size)) {
			input.key = keys.LEFT;
		}
	}
};

InputProcessor.prototype.processComboInputs = function (input) {

	var physics = App.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;

	if(!player.isJumping()){
		if (control.quickTapped(keys.KICK) && player.hasEnoughEnergy('kickCombo')) {
				console.log('kick combo');
				player.setUsingCombo(true);
				player.setHiting(true);
				physics.hit(600, 80, 15, 60);
				input.kickCombo = true;
			}
		else if (control.quickTapped(keys.PUNCH) && player.hasEnoughEnergy('punchCombo')) {
				console.log('punch combo');
				player.setUsingCombo(true);
				player.setHiting(true);
				physics.hit(800, 65, 0, 60);
				input.punchCombo = true;
			}	
		else if (control.isDown(keys.PUNCH) && player.hasEnoughEnergy('punch')) {
				console.log('simple punch');
				player.setHiting(true);
				physics.hit(300, 65, 5, 60);
				input.punchKey = true;
			}
		else if(control.isDown(keys.KICK) && player.hasEnoughEnergy('kick')) {
				console.log('simple kick');
				player.setHiting(true);
				physics.hit(400, 80, 10, 60);
				input.kickKey = true;
			}
		}
		else if (control.isDown(keys.PUNCH) && player.isJumping()) {
			console.log("jumping and punching");
			player.setHiting(true);
			physics.hit(780, 65, 5, 120);
			input.punchKey = true;
		}
		else if (control.isDown(keys.KICK) && player.isJumping()) {
			console.log("jumping and kicking");
			player.setHiting(true);
			physics.hit(780, 80, 10, 120);
			input.kickKey = true;
		}
};

InputProcessor.prototype.processActionInputs = function (input) {
	var physics = App.physics;
	var keys = Config.keyBindings;
	var control = InputCollection;
	var player = this.player;
	var opponent = this.opponent;
	var y = player.getLocation().getY();
	var z = player.getZ();
	var opy = opponent.getLocation().getY();
	var opz = opponent.getZ();
	var size = Config.playerSize;

	if (control.isDown(keys.JUMP) && player.hasEnoughEnergy('jump')) {
		if(!player.isJumping() && y + z > 0 && y - opz - opy != size) {
			var speedZ = Config.playerJumpSpeed;
			input.jumpKey = true;
			player.setSpeedZ(speedZ);
			player.setJumping(true);
			physics.jump();
		}
	}
	if (control.isDown(keys.DEFEND)) {
			player.setDefending(true);
			input.key = keys.DEFEND;
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
	if(!player.isHiting() && !player.isPunched() && !player.isDefending() || player.isJumping()) {
		this.processMovementInputs(input);
	}
	this.inputCounter++;
	return input;
};

module.exports = InputProcessor;