var Collisions = {};

Collisions.checkLeftCollision = function(player, opponent, size) {
	return (opponent.getX() + size < player.getX() || player.getX() <= opponent.getX())
		|| (Math.abs(player.getY() - opponent.getY()) >= size*2/3)
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

Collisions.checkRightCollision = function(player, opponent, size) {
	return (opponent.getX() - size > player.getX() || opponent.getX() <= player.getX())
		|| (Math.abs(player.getY() - opponent.getY()) >= size*2/3)
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

Collisions.checkUpCollision = function(player, opponent, size) {
	return (player.getY() - size*2/3 > opponent.getY() || player.getY() <= opponent.getY())
		|| (Math.abs(player.getX() - opponent.getX()) >= size)
	 	|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

Collisions.checkDownCollision = function(player, opponent, size) {
	return (player.getY() + size*2/3 < opponent.getY() || opponent.getY() <= player.getY())
		|| (Math.abs(player.getX() - opponent.getX()) >= size)
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
};

module.exports = Collisions;