'use strict';

var Camera = require('../../../src/client/lib/canvas/camera.js');
var Rectangle = require('../../../src/client/lib/canvas/rectangle.js');

describe('Camera', function () {

	var camera,
		worldRect;

	beforeEach(function() {
		worldRect = new Rectangle(0, 0, 3000, 1000);
		camera = new Camera({
			yView: 0,
			xView: 0,
			canvasWidth: 550,
			canvasHeight: 900,
			axis: 'horizontal',
			worldRect: worldRect
		});
	});

	it('should define follow method', function () {
		expect(camera.follow).toBeDefined();
	});

	it('should define setObjectAlign method', function () {
		expect(camera.setObjectAlign).toBeDefined();
	});

	it('should define getObjectAlign method', function () {
		expect(camera.getObjectAlign).toBeDefined();
	});

	it('should define isFollowing method', function () {
		expect(camera.isFollowing).toBeDefined();
	});

	it('should define update method', function () {
		expect(camera.update).toBeDefined();
	});

	it('should define leftCollision method', function () {
		expect(camera.leftCollision).toBeDefined();
	});

	it('should define rightCollision method', function () {
		expect(camera.rightCollision).toBeDefined();
	});

	it('should get default values', function () {
		expect(camera.xView).toBe(0);
		expect(camera.yView).toBe(0);
		expect(camera.wView).toBe(550);
		expect(camera.hView).toBe(900);
		expect(camera.axis).toBe('horizontal');
		expect(camera.worldRect).toBe(worldRect);
	});

	it('should get default object align value', function () {
		expect(camera.getObjectAlign()).toBe(0);
	});

	it('should set custom object align value', function () {
		camera.setObjectAlign(180);
		expect(camera.getObjectAlign()).toBe(180);
	});

	it('should not follow object by default', function () {
		expect(camera.isFollowing()).toBe(false);
	});

	it('should set following object to player', function () {
		var mockPlayer = {
			getX: function () {
				return 500;
			},
			getZ: function () {
				return 0;
			}
		};
		camera.follow(mockPlayer, 550 / 2, 900 / 2, 180);

		expect(camera.followed).toBe(mockPlayer);
		expect(camera.yDeadZone).toBe(900 / 2);
		expect(camera.getObjectAlign()).toBe(180);
		expect(camera.xDeadZone()).toBe((550 / 2) + 180);
	});

	it('should check if player is in left camera side', function () {
		var mockPlayer = {
			getX: function () {
				return -800;
			},
			getZ: function () {
				return 0;
			}
		};

		expect(camera.leftCollision(mockPlayer, 160)).toBe(true);
	});

	it('should check if player is not in left camera side', function () {
		var mockPlayer = {
			getX: function () {
				return -801;
			},
			getZ: function () {
				return 0;
			}
		};

		expect(camera.leftCollision(mockPlayer, 160)).toBe(false);
	});

	it('should check if player is in right camera side', function () {
		var mockPlayer = {
			getX: function () {
				return -250;
			},
			getZ: function () {
				return 0;
			}
		};

		expect(camera.rightCollision(mockPlayer, 160)).toBe(true);
	});

	it('should check if player is not in right camera side', function () {
		var mockPlayer = {
			getX: function () {
				return -249;
			},
			getZ: function () {
				return 0;
			}
		};

		expect(camera.rightCollision(mockPlayer, 160)).toBe(false);
	});

	it('should update camera viewport according to following object', function () {
		var mockPlayer = {
			x: 500,
			z: 0,
			getX: function () {
				return this.x;
			},
			getZ: function () {
				return this.z;
			},
			setX: function (x) {
				this.x = x;
			},
			setZ: function (z) {
				this.z = z;
			}
		};
		camera.follow(mockPlayer, 550 / 2, 900 / 2, 0);

		expect(camera.xView).toBe(0);

		camera.update();
		expect(camera.xView).toBe(225);

		mockPlayer.setX(-500);
		camera.update();
		expect(camera.xView).toBe(0);
		expect(camera.isFollowing()).toBe(false);

		mockPlayer.setX(0);
		camera.update();
		expect(camera.xView).toBe(0);
		expect(camera.isFollowing()).toBe(false);

		mockPlayer.setX(100);
		camera.update();
		expect(camera.xView).toBe(0);
		expect(camera.isFollowing()).toBe(false);

		mockPlayer.setX(500);
		camera.update();
		expect(camera.xView).toBe(225);
		expect(camera.isFollowing()).toBe(true);

		mockPlayer.setX(1000);
		camera.update();
		expect(camera.xView).toBe(725);
		expect(camera.isFollowing()).toBe(true);

		mockPlayer.setX(1500);
		camera.update();
		expect(camera.xView).toBe(1225);
		expect(camera.isFollowing()).toBe(true);

		mockPlayer.setX(2000);
		camera.update();
		expect(camera.xView).toBe(1725);
		expect(camera.isFollowing()).toBe(true);

		mockPlayer.setX(2500);
		camera.update();
		expect(camera.xView).toBe(2225);
		expect(camera.isFollowing()).toBe(true);

		mockPlayer.setX(3000);
		camera.update();
		expect(camera.xView).toBe(2450);
		expect(camera.isFollowing()).toBe(false);

		mockPlayer.setX(3500);
		camera.update();
		expect(camera.xView).toBe(2450);
		expect(camera.isFollowing()).toBe(false);

		mockPlayer.setX(4000);
		camera.update();
		expect(camera.xView).toBe(2450);
		expect(camera.isFollowing()).toBe(false);
	});
});