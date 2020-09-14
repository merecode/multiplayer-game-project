
var gameControl = function(gameInstance){

    // this.clientConnectToServer();



    // this.instance = gameInstance;
    // this.server = this.instance !== undefined;



    // if(this.server){
    //     this.players = {
    //         self: new gamePlayer(this, this.instance.playerHost),
    //         other: new gamePlayer(this, this.instance.playerClient)
    //     };

    //     this.players.self.pos = {x:20, y:20};
    // }else{
    //     this.players = {
    //         self: new gamePlayer(this),
    //         other: new gamePlayer(this)
    //     };
    // }

    // if(!this.server){
    //     this.clientConnectToServer();
    // }
};

if('undefined' != typeof global){
    module.exports = global.gameControl = gameControl;
}

var gamePlayer = function(gameInstance, playerInstance){
    this.instance = playerInstance;
    this.game = gameInstance;

    this.pos = {x:0, y:0};
    this.size = {x:16, y:16, hx:8, hy:8};
    this.state = 'not-connected';
    this.color = 'rgba(255, 255, 255, 0.1)';
    this.id = '';

    if(playerInstance){
        this.pos = {x:20, y:20};
    }else{
        this.pos = {x:500, y:200};
    }
};


gameControl.prototype.setUpdate = function(game){
    gameControl.update();
    gameControl.draw();
    gameControl.clock();
}


gameControl.prototype.update = function(){
    if(gameState == "ingame"){
        for(var i = 0; i < bodies.length; i++){
            bodies[i].xCoordinate -= bodiesSpeed;
            if(bodies[i].xCoordinate < -10){
                bodies[i].img.style.visibility = 'visible';
                var asteroidPosition = Math.floor(Math.random() * 9);
                bodies[i].xCoordinate = canvasWidth;
                console.log('Canvas Width: ' + canvasWidth);
                bodies[i].yCoordinate = bodiesPositions[asteroidPosition];

                console.log('ingame for loop BODIES X-POSITION: ' + bodies[i].xCoordinate);
            }
        }

        for(var i = 0; i < asteroids.length; i++){
            asteroids[i].xCoordinate -= asteroidSpeed;
            if(asteroids[i].xCoordinate < -10){
                asteroids[i].img.style.visibility = 'visible';
                var asteroidPosition = Math.floor(Math.random() * 9);
                asteroids[i].xCoordinate = canvasWidth;
                asteroids[i].yCoordinate = bodiesPositions[asteroidPosition];
            }
        }
        setTimeout(gameControl.update, 1000/frameRate);
    }
}

gameControl.prototype.draw = function(){
    console.log('Bodies in Draw: ', bodies);
    console.log(gameState);
    if(gameState == "ingame"){
        venger.img.style.left = venger.xCoordinate + 'px';
        venger.img.style.top = venger.yCoordinate + 'px';

        vengerDouble.img.style.left = vengerDouble.xCoordinate + 'px';
        vengerDouble.img.style.top = vengerDouble.yCoordinate + 'px';

        for(var i = 0; i < bodies.length; i++){
            bodies[i].img.style.left = bodies[i].xCoordinate + 'px';
            console.log('Bodies x-cordinate: ' + bodies[i].xCoordinate);
            bodies[i].img.style.top = bodies[i].yCoordinate + 'px';
        }

        for(var i = 0; i < asteroids.length; i++){
            asteroids[i].img.style.left = asteroids[i].xCoordinate + 'px';
            asteroids[i].img.style.top = asteroids[i].yCoordinate + 'px';
        }
        setTimeout(gameControl.draw, 1000/frameRate);
    }
}

gameControl.prototype.clock = function(){
    if(gameState == "ingame"){
        gameSpeed += 2;
        asteroidsStartSpeed += 2;
        bodiesSpeed += 2;
        setTimeout(gameControl.clock, 10000);
    }
}

gameControl.prototype.clientOnReadyGame = function(data){
    var playerHost = this.players.self.host ? this.players.self : this.players.other;
    var playerClient = this.players.self.host ? this.players.other : this.players.self;

    playerHost.state = 'local_pos(hosting)';
    playerClient.state = 'local_pos(joined)';

    this.players.self.state = 'YOU' + this.players.self.state;
    gameState = "ingame";
    intialise();
}

gameControl.prototype.clientOnJoinGame = function(data){
    this.players.self.host = false;
    nappendDiv.innerHTML += " Joining ";
    vengerDouble.img.style.display = 'inline';
    console.log('joining');
    this.players.self.state = 'connected.joined.waiting';
    this.socket.send('joining our game!');
};



gameControl.prototype.clientOnHostGame = function(data){
    this.players.self.host = true;
    nappendDiv.innerHTML += " Hosting ";
    vengerDouble.img.style.display = 'none';
    console.log('hosting');
    this.players.self.state = 'hosting waiting for a player';
    this.socket.send('hosting our game!');
};

gameControl.prototype.clientOnConnected = function(data){
    this.players.self.id = data.id;
    nappendDiv.innerHTML += data.id + " ";
    this.players.self.state = 'connected';
    this.players.self.online = true;
};

gameControl.prototype.clientOnPing = function(data){
    this.netPing = new Date().getTime() - parseFloat(data);
    this.netLatency = this.netPing/2;
};

gameControl.prototype.clientOnNetMessage = function(data){
    var commands = data.split('.');
    var command = commands[0];
    var subcommand = commands[1] || null;
    var commanddata = commands[2] || null;

    switch(command){
        case 's':
            switch(subcommand){
                case 'h':
                    this.clientOnHostGame(commanddata); break;
                case 'j':
                    this.clientOnJoinGame(commanddata); break;
                case 'r':
                    this.clientOnReadyGame(commanddata); break;
                case 'e':
                    this.clientOnDisconnect(commanddata); break;
                case 'p':
                    this.clientOnPing(commanddata); break;
            }
        break;
    }
};


gameControl.prototype.clientOnDisconnect = function(data){
    this.players.self.state = 'not-connected';
    this.players.self.online = false;

    this.players.other.state = 'not-connected';
};


/* gameControl.prototype.clientConnectToServer = function(){
    this.socket = io.connect();
    this.socket.on('connect', function(){
        this.players.self.state = 'connecting';
    }.bind(this));

    this.socket.on('disconnect', this.clientOnDisconnect.bind(this));
    // this.socket.on('onserverupdate', this.clientOnServerUpdateRecieved.bind(this));
    this.socket.on('onconnected', this.clientOnConnected.bind(this));
    this.socket.on('error', this.clientOnDisconnect.bind(this));
    this.socket.on('message', this.clientOnNetMessage.bind(this));
}; */
