var Collisions = {};

Collisions.checkLeftCollision = function(player, opponent, size) {
	return (opponent.getX() + size < player.getX() || player.getX() <= opponent.getX())
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

Collisions.checkRightCollision = function(player, opponent, size) {
	return (opponent.getX() - size > player.getX() || opponent.getX() <= player.getX())
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

Collisions.checkPunchCollisionLeft = function(player, opponent, size, heightDifference) {
	return (player.getX() < opponent.getX() && opponent.getX() - player.getX() < size
		&& (Math.abs(player.getZ() - opponent.getZ()) <= heightDifference));
}

Collisions.checkPunchCollisionRight = function(player, opponent, size, heightDifference) {
	return (player.getX() > opponent.getX() && player.getX() - opponent.getX() < size
		&& (Math.abs(player.getZ() - opponent.getZ()) <= heightDifference));
}

module.exports = Collisions;