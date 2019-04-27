var express = require('express');
var http = require('http');
var path = require('path');

var appServer = express();
appServer.use(express.static('files'));

appServer.get('*', (req, res) => {
    res.sendFile(__dirname+"/");
    //res.sendFile(__dirname+"/login.js");
});



http.createServer(appServer).listen(3456, function() {
    console.log('Express server listening on port');
});