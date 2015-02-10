'use strict'

var SoundCollection = require('../../../src/client/lib/sound-collection.js')
var Config = require('../../../src/client/lib/config.js');
var Path = require('path');

describe('SoundCollection', function () {

	var soundsDataMock;
	var AudioMock = function () {
		this.play = function () {
			SoundCollection.playedSound = true;
		}
	};

	beforeEach(function () {
		SoundCollection.sounds = {
			common: {},
			player: {},
			opponent: {}
		};

		soundsDataMock = {
			sounds1: 1,
			sounds2: 3
		};
	});

	it('should define sounds object', function () {
		expect(SoundCollection.sounds).toBeDefined();
	});

	it('should define common sounds object', function () {
		expect(SoundCollection.sounds.common).toBeDefined();
	});

	it('should define player sounds object', function () {
		expect(SoundCollection.sounds.player).toBeDefined();
	});

	it('should define opponent sounds object', function () {
		expect(SoundCollection.sounds.opponent).toBeDefined();
	});

	it('should define loadCommonSounds function', function () {
		expect(SoundCollection.loadCommonSounds).toBeDefined();
	});

	it('should define loadPlayerSounds function', function () {
		expect(SoundCollection.loadPlayerSounds).toBeDefined();
	});

	it('should define loadOpponentSounds function', function () {
		expect(SoundCollection.loadOpponentSounds).toBeDefined();
	});

	it('should define load function', function () {
		expect(SoundCollection.load).toBeDefined();
	});

	it('should define play function', function () {
		expect(SoundCollection.play).toBeDefined();
	});

	it('should define playServerSounds function', function () {
		expect(SoundCollection.playServerSounds).toBeDefined();
	});

	it('should define clear function', function () {
		expect(SoundCollection.clear).toBeDefined();
	});

	it('should use play function', function () {
		SoundCollection.sounds.player.mockSounds = [];
		SoundCollection.sounds.player.mockSounds.push(new AudioMock());

		SoundCollection.playedSound = false;

		SoundCollection.play('player', 'mockSounds');
		expect(SoundCollection.playedSound).toBe(true);
	});

	it('should make sound arrays empty', function () {
		SoundCollection.sounds = {
			player: {
				sounds: ['soundMock', 'soundMock']
			},
			opponent: {
				sounds: ['soundMock', 'soundMock', 'soundMock'],
				otherSounds: ['soundMock']
			}
		};

		SoundCollection.clear();

		expect(SoundCollection.sounds.player.sounds.length).toBe(0);
		expect(SoundCollection.sounds.opponent.sounds.length).toBe(0);
		expect(SoundCollection.sounds.opponent.otherSounds.length).toBe(0);
	});
});