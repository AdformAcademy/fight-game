var express = require('express');
var app = express();
var path = require('path');

function Express() {};

Express.loadResources = function(dirname) {
	app.get('/', function(req, res){
	  res.sendFile(dirname + '/views/index.html');
	});

	app.use('/', express.static('public/'));
};

Express.app = app;
Express.path = path;

module.exports = Express;