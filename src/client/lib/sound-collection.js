var SoundCollection = {};

SoundCollection.sounds = {
	common: {},
	player: {},
	opponent: {}
};

SoundCollection.loadCommonSounds = function (soundsData) {
	var sound;
	var commonSounds = SoundCollection.sounds.common;
	for (action in soundsData) {
		if(commonSounds[action] === undefined) {
			commonSounds[action] = [];
		}
		for (var i = 0; i < soundsData[action]; i++) {
			sound = new Audio();
			sound.src = './audio/common/' + action + '/' + i + '.wav'; 
			commonSounds[action].push(sound);
		}
	}
};

SoundCollection.loadPlayerSounds = function (data) {
	var sound;
	var playerSounds = SoundCollection.sounds.player;
	for (action in data.sounds) {
		if(playerSounds[action] === undefined) {
			playerSounds[action] = [];
		}
		for(var i = 0; i < data.sounds[action]; i++) {
			sound = new Audio();
			sound.src = './audio/character' + data.id + '/' + action + '/' + i + '.wav';
			playerSounds[action].push(sound);
		}
	}
};

SoundCollection.loadOpponentSounds = function (data) {
	var sound;
	var opponentSounds = SoundCollection.sounds.opponent;
	for (action in data.sounds) {
		if(opponentSounds[action] === undefined) {
			opponentSounds[action] = [];
		}
		for(var i = 0; i < data.sounds[action]; i++) {
			sound = new Audio();
			sound.src = './audio/character' + data.id + '/' + action + '/' + i + '.wav';
			opponentSounds[action].push(sound);
		}
	}
};

SoundCollection.load = function (soundsData, playerData, opponentData) {
	SoundCollection.loadCommonSounds(soundsData);
	SoundCollection.loadPlayerSounds(playerData);
	SoundCollection.loadOpponentSounds(opponentData);
};

SoundCollection.play = function (sounds, action) {
	var soundsPack = SoundCollection.sounds[sounds][action];
	var index = Math.floor(Math.random() * soundsPack.length);
	if(soundsPack[index] !== undefined) {
		soundsPack[index].play();
	}
};

SoundCollection.playServerSounds = function (soundData) {
	if (soundData !== undefined) {
		for (var i in soundData) {
			SoundCollection.play(soundData[i].packet, soundData[i].sound);
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