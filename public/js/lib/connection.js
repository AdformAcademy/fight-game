var socket = io();

$("#btn").click(function() {
	socket.emit('ready', '');
});

socket.on('playing', function() {
	alert('You are now playing');
});

socket.on('unactive', function() {
	alert('Player disconnected');
});