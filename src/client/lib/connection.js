var socket = io();

socket.on('unactive', function() {
	alert('Player disconnected');
});