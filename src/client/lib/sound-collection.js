var SoundCollection = {}

SoundCollection.sounds = {};

SoundCollection.sounds.punch = [];
SoundCollection.sounds.kick = [];
SoundCollection.sounds.comboPunch = [];
SoundCollection.sounds.comboKick = [];
SoundCollection.sounds.jump = [];
SoundCollection.sounds.land = [];

SoundCollection.load = function (soundsData) {
	var sound;
	for (action in SoundCollection.sounds) {
		for (var i = 0; i < soundsData[action]; i++) {
			sound = new Audio();
			sound.src = './audio/' + action + '/' + i + '.wav'; 
			SoundCollection.sounds[action].push(sound);
		}
	}
};

SoundCollection.play = function (action) {
	var sounds = SoundCollection.sounds[action];
	var index = Math.floor(Math.random() * sounds.length);
	if(sounds[index] !== undefined) {
		sounds[index].play();
	}
};

SoundCollection.clear = function () {
	SoundCollection.sounds.punch = [];
	SoundCollection.sounds.kick = [];
	SoundCollection.sounds.comboPunch = [];
	SoundCollection.sounds.comboKick = [];
	SoundCollection.sounds.jump = [];
	SoundCollection.sounds.land = [];
}

module.exports = SoundCollection;