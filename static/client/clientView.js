var canvas,
    canvasWidth = 600,
    canvasHeight = 280,

    vengerImgURL = "/static/images/venger.png",
    venger,
    vengerSize = 25,

    chopperImgURL = "/static/images/choppa.png",
    vengerDouble,
    
    bodies,
    asteroids,
    numOfBodies = 8,
    maxBodySpace = 250,
    bodiesPositions = [0, 35, 70, 100, 135, 160, 190, 210, 225];

var game = {};

var divButton;

var frameRate = 20,
    gameState = "menu",
    gameSpeed,
    bodiesSpeed = 2,
    asteroidSpeed = 2,
    bodiesStartSpeed = 8,
    asteroidsStartSpeed = 12,
    canvasWidth = 600;


window.onload = function(){
    document.title = "SpaceVenger Game | Multiplayer Version";
    intialise();
};

var intialise = function(){


    game.canvas = document.getElementById('main');
    game.canvas.innerHTML = "";
    game.canvas.style.width = canvasWidth + 'px';
    game.canvas.style.height = canvasHeight + 'px';
    game.canvas.style.position = 'absolute';
    game.canvas.style.border = '5px solid black';
    bodiesSpeed = bodiesStartSpeed;
    asteroidSpeed = asteroidsStartSpeed;

    venger = Object();
    venger.xCoordinate = 100;
    venger.yCoordinate = 50;
    venger.img = document.createElement('img');
    venger.img.src = vengerImgURL;
    venger.img.height = vengerSize;
    venger.img.style.position = 'absolute';
    venger.img.style.top = venger.yCoordinate + 'px';
    venger.img.style.left = venger.xCoordinate + 'px';
    game.canvas.appendChild(venger.img);


    vengerDouble = Object();
    vengerDouble.xCoordinate = 100;
    vengerDouble.yCoordinate = 200;
    vengerDouble.img = document.createElement('img');
    vengerDouble.img.src = chopperImgURL;
    vengerDouble.img.height = vengerSize;
    vengerDouble.img.style.position = 'absolute';
    vengerDouble.img.style.top = vengerDouble.yCoordinate + 'px';
    vengerDouble.img.style.left = vengerDouble.xCoordinate + 'px';
    game.canvas.appendChild(vengerDouble.img);


    bodies = Array();
    asteroids = Array();
    for(var i = 0; i < numOfBodies; i++){
        if(i > 3){
            var asteroid = new Object();
            asteroid.img = document.createElement('img');
            asteroid.img.src = "/static/images/bigAsteroid.png";
            asteroid.img.style.position = 'absolute';
            asteroid.img.height = 30;
            game.canvas.appendChild(asteroid.img);

            asteroid.xCoordinate = canvasWidth + (Math.floor(Math.random()) * 1000);
            var asteroidPosition = Math.floor(Math.random() * 9);
            asteroid.yCoordinate = bodiesPositions[asteroidPosition];

            asteroids.push(asteroid);
        }else{
            var meteor = new Object();
            meteor.img = document.createElement('img');
            meteor.img.src = "/static/images/content2.png";
            meteor.img.style.position = 'absolute';
            meteor.img.height = 30;
            game.canvas.appendChild(meteor.img);

            meteor.xCoordinate = parseInt(canvasWidth + (Math.floor(Math.random() * 1000)));
            var asteroidPosition = Math.floor(Math.random() * 9);
            meteor.yCoordinate = bodiesPositions[asteroidPosition];
            bodies.push(meteor);
        }
    }


    nappendDiv = document.createElement('div');
    nappendDiv.id = 'more-div';
    nappendDiv.style.backgroundColor = '#00A';
    nappendDiv.style.height = '100px';
    nappendDiv.style.width = '500px';
    nappendDiv.style.color = '#FFF';
    nappendDiv.style.fontSize = '1em';
    nappendDiv.style.textAlign = 'center';
    nappendDiv.style.margin = "0 auto";
    document.body.appendChild(nappendDiv);

    

    // update();
    // draw();
    // clock();

    // game = new gameControl();
    // console.log(game);
    // setUpdate(game);
    // game.draw();
    // game.clock();
}


const socket = io();
socket.on('connection', function(){
    socket.emit('connected');
});