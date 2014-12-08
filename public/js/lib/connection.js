var socket = io();

socket.on('playing', function() {
	alert('You are now playing');
});

socket.on('unactive', function() {
	alert('Player disconnected');
});