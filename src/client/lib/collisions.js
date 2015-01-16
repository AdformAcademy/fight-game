var Collisions = {};

Collisions.checkLeftCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (oloc.getX() + size < loc.getX() || loc.getX() <= oloc.getX())
		|| (Math.abs(loc.getY() - oloc.getY()) >= size*2/3)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
};

Collisions.checkRightCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (oloc.getX() - size > loc.getX() || oloc.getX() <= loc.getX())
		|| (Math.abs(loc.getY() - oloc.getY()) >= size*2/3)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
};

Collisions.checkUpCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (loc.getY() - size*2/3 > oloc.getY() || loc.getY() <= oloc.getY())
		|| (Math.abs(loc.getX() - oloc.getX()) >= size)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
};

Collisions.checkDownCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (loc.getY() + size*2/3 < oloc.getY() || oloc.getY() <= loc.getY())
		|| (Math.abs(loc.getX() - oloc.getX()) >= size)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
};

module.exports = Collisions;