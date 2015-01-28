var Collisions = {};

Collisions.checkLeftCollision = function(player, opponent, size) {
	return (opponent.getX() + size < player.getX() || player.getX() <= opponent.getX())
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

Collisions.checkRightCollision = function(player, opponent, size) {
	return (opponent.getX() - size > player.getX() || opponent.getX() <= player.getX())
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

module.exports = Collisions;