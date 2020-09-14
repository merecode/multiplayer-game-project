var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var response = require('express');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
const port = 5000;

var UUID = require('uuid');


app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'static/index.html'));
});

server.listen(port, function(){
    console.log('Go to http://localhost:' + port);
});

var serverControl = require('./server/serverControl.js');

var players = new Object();


io.on('connection', function(user){
    players.id = socketIO.id;
    console.log('Player: ' + players.id);
    user.userid = UUID.v4();
    console.log('User with ID: ' + user.userid + ' connected');
    user.emit('onconnected', {id: user.userid});
    serverControl.findGame(user);

    user.on('message', function(m){
        serverControl.onMessage(user, m);
    });

    user.on('disconnect', function(){
        console.log('User with ID: ' + user.userid + ' disconnected. Game with ID: ' + user.game.id + ' abandoned.');
        if(user.game && user.game.id){
            serverControl.endGame(user.game.id, user.userid);
        }
    });
});




