var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');

var Express = {};

Express.loadResources = function(dirname) {
	app.get('/', function(req, res){
	  res.sendFile(dirname + '/views/index.html');
	});

	app.use(favicon(dirname + '/public/img/favicon.ico'));
	app.use('/', express.static('public/'));
};

Express.app = app;
Express.path = path;

module.exports = Express;