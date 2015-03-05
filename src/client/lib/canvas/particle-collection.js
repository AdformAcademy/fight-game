var Config = require('../config');
var SpriteSheet = require('./spritesheet');

var ParticleCollection = {};

ParticleCollection.particles = {};
ParticleCollection.drawEvents = [];

ParticleCollection.load = function (loader, data) {
	var particles = ParticleCollection.particles;
	for (var key in data) {
		var id = loader.append();
		var spriteImage = new Image();
		spriteImage.src = './img/particles/' + data[key].spriteSheetImage;
		spriteImage.onload = function (id) {
			return function () {
				loader.load(id);
			};
		}(id);

		particles[key] = {
			image: spriteImage,
			data: data[key]
		};
		particles[key].data.defaultAnimation = Math.floor(Math.random() * 2);
	}
};

ParticleCollection.triggerParticle = function (player, particle, flip) {
	var playerSpriteWidth = player.getSpriteSheet().getDimensions().frameWidth;
	var particleSpriteWidth = ParticleCollection.particles[particle].data.spriteDimensions.frameWidth;
	ParticleCollection.drawEvents.push({
		position: {
			x: player.getX() + (playerSpriteWidth - particleSpriteWidth) * (0.5 + ((flip ? -1 : 1) * 0.2)),
			z: player.getZ() + player.groundHeight() - player.getSpriteSheet().getSpriteSheetHeight() * (Math.random() * 0.2 + 0.6)
		},
		spriteSheet: new SpriteSheet({
			image: ParticleCollection.particles[particle].image,
			data: ParticleCollection.particles[particle].data
		})
	});

	var lastElementNumber = ParticleCollection.drawEvents.length - 1;
	var spriteSheet = ParticleCollection.drawEvents[lastElementNumber].spriteSheet;
	spriteSheet.flipAnimation(flip);
	setTimeout(function () {
		delete ParticleCollection.drawEvents[lastElementNumber];
	}, spriteSheet.getAnimation(spriteSheet.getCurrentAnimation()).frames * 1000 / 30);
};

ParticleCollection.update = function () {
	for (var key in ParticleCollection.drawEvents) {
		ParticleCollection.drawEvents[key].spriteSheet.update();
	}
};

ParticleCollection.draw = function (xView, yView) {
	var player;
	for (var key in ParticleCollection.drawEvents) {
		position = ParticleCollection.drawEvents[key].position;
		ParticleCollection.drawEvents[key].spriteSheet.draw(position.x - xView, position.z - yView);
	}
};

ParticleCollection.clear = function () {
	ParticleCollection.particles = {};
};

module.exports = ParticleCollection;