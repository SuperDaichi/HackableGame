var express = require('express');
var http = require('http');
var path = require('path');

var appServer = express();
/*
appServer.use(express.static(path.join(__dirname, 'index.html')));

appServer.get('*', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});
*/
appServer.use(express.static('public'));
http.createServer(appServer).listen(3456, function() {
    console.log('Express server listening on port');
});