var Config = require('./config');

var SoundCollection = {};

SoundCollection.mute = false;

SoundCollection.sounds = {
	common: {},
	player: {},
	opponent: {},
	theme: {}
};

SoundCollection.loadCommonSounds = function (loader, soundsData) {
	var sound;
	var commonSounds = SoundCollection.sounds.common;
	for (action in soundsData) {
		if(commonSounds[action] === undefined) {
			commonSounds[action] = [];
		}
		for (var i = 0; i < soundsData[action]; i++) {
			var id = loader.append();
			sound = new Audio();
			sound.oncanplaythrough = function (id) {
				return function () {
					loader.load(id);
				};
			}(id);
			sound.src = Config.commonSoundsPath + action + '/' + i + '.mp3';
			commonSounds[action].push(sound);
		}
	}
};

SoundCollection.loadPlayerSounds = function (loader, data) {
	var sound;
	var playerSounds = SoundCollection.sounds.player;
	for (action in data.sounds) {
		if(playerSounds[action] === undefined) {
			playerSounds[action] = [];
		}
		for(var i = 0; i < data.sounds[action]; i++) {
			var id = loader.append();
			sound = new Audio();
			sound.oncanplaythrough = function (id) {
				return function () {
					loader.load(id);
				};
			}(id);
			sound.src = Config.characterSoundsPath + data.id + '/' + action + '/' + i + '.wav';
			playerSounds[action].push(sound);
		}
	}
};

SoundCollection.loadOpponentSounds = function (loader, data) {
	var sound;
	var opponentSounds = SoundCollection.sounds.opponent;
	for (action in data.sounds) {
		if(opponentSounds[action] === undefined) {
			opponentSounds[action] = [];
		}
		for(var i = 0; i < data.sounds[action]; i++) {
			var id = loader.append();
			sound = new Audio();
			sound.oncanplaythrough = function (id) {
				return function () {
					loader.load(id);
				};
			}(id);
			sound.src = Config.characterSoundsPath + data.id + '/' + action + '/' + i + '.wav';
			opponentSounds[action].push(sound);
		}
	}
};

SoundCollection.load = function (loader, soundsData, playerData, opponentData) {
	SoundCollection.loadCommonSounds(loader, soundsData);
	SoundCollection.loadPlayerSounds(loader, playerData);
	SoundCollection.loadOpponentSounds(loader, opponentData);
};

SoundCollection.play = function (sounds, action) {
	if(!SoundCollection.mute) {
		var soundsPack = SoundCollection.sounds[sounds][action];
		var index = Math.floor(Math.random() * soundsPack.length);
		if(soundsPack[index] !== undefined) {
			soundsPack[index].play();
		}
	}
};

SoundCollection.playServerSounds = function (soundData) {
	if(!SoundCollection.mute) {
		if (soundData !== undefined) {
			for (var i in soundData) {
				SoundCollection.play(soundData[i].packet, soundData[i].sound);
			}
		}
	}
}

SoundCollection.clear = function () {
	for(var snd in SoundCollection.sounds) {
		for (var action in SoundCollection.sounds[snd]) {
			SoundCollection.sounds[snd][action] = [];
		}
	}
};

module.exports = SoundCollection;