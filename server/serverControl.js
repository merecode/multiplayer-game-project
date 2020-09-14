

var serverControl = module.exports = {games:{}, gameCount:0};
var UUID = require('uuid');
var verbose = true;


global.window = global.document = global;

require('../static/client/gameControl.js');

serverControl.log = function(){
    if(verbose) console.log.apply(this, arguments);
};



serverControl.messages = [];

serverControl.onMessage = function(user, message){
    serverControl.messages.push({user: user, message: message});
    this.log('\t Client ' +  user.userid);
    // this.log('\t', serverControl.messages);
    this.log('\t', serverControl.messages.length);
}


serverControl.createGame = function(player){
    var theGame = {
        id: UUID.v4(),
        playerHost: player,
        playerClient: null,
        playerCount: 1
    };

    this.games[theGame.id] = theGame;
    this.gameCount++;

    theGame.gameControl = new gameControl(theGame); 

    player.send('s.h.');
    player.game = theGame;
    player.hosting = true;

    this.log('Player with ID: ' + player.userid + ' created a game with id: ' + player.game.id);

    return theGame;
};

serverControl.endGame = function(gameID, userID){
    var theGame = this.games[gameID];
    if(theGame){
        //theGame.gameControl.stopUpdate();
        if(theGame.playerCount > 1){
            if(userID == theGame.playerHost.userid){
                if(theGame.playerClient){
                    theGame.playerClient.send('s.e.');
                    this.findGame(theGame.playerClient);
                }
            }else{
                if(theGame.playerHost){
                    theGame.playerHost.send('s.e.');
                    theGame.playerHost.hosting = false;
                    this.findGame(theGame.playerHost);
                }
            }
        }
        delete this.games[gameID];
        this.gameCount--;
        this.log('Game removed. There are now ' + this.gameCount + ' games');
    }else{
        this.log('That game was not found!');
    }
};

serverControl.startGame = function(game){
    game.playerClient.send('s.j.' + game.playerHost.userid);
    game.playerClient.game = game;
    game.playerClient.send('s.r.');
    game.playerHost.send('s.r.');
    game.active = true;
    game.gameState = 'ingame';

};

serverControl.findGame = function(player){
    this.log('Looking for a game. We have: ' + this.gameCount);
    if(this.gameCount){
        var joined_a_game = false;
        for(var gameid in this.games){
            if(!this.games.hasOwnProperty(gameid)) continue;
            var gameInstance = this.games[gameid];
            if(gameInstance.playerCount < 2){
                joined_a_game = true;
                gameInstance.playerClient = player;
                gameInstance.gameControl.players.other.instance = player;
                gameInstance.playerCount++;

                this.startGame(gameInstance);
            }
        }

        if(!joined_a_game){
            this.createGame(player);
        }
    }else{
        this.createGame(player);
    }
};