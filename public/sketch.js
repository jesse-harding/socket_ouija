var socket; //adding socket

var data; //object for outgoing data;

// let color = [];

let boardImg;
let planchetteImg;

function setup() {
    imageMode(CENTER);
    boardImg = loadImage("ouija_board.png");
    planchetteImg = loadImage("planchette.png");
    // color[0] = int(random(255));
    // color[1] = int(random(255));
    // color[2] = int(random(255));

    data = {    //make data object to send
        x: 0,
        y: 0,
    }

    createCanvas(window.innerWidth, window.innerHeight);
    noStroke();
    background(255);
    fill(0);
    
    
    socket = io(); //socket to server

    socket.on('L1', serverMsg);
    textAlign(CENTER);
    textSize(24);
    text("click and drag to tell the future",width/2,height/2);
}

function draw() {
    // background(255);
}

function drawAvg(coords){
    background(255);
    image(boardImg,width/2,height/2, width/2, height/2);
    fill(255,0,255);
    if (coords.avgX != 0 && coords.avgY != 0){
        image(planchetteImg, width * coords.avgX, height * coords.avgY,width/5, width/5);
    }
}

function serverMsg(incomingData){
    drawAvg(incomingData);
}

function mouseDragged(){
    // fill(color[0], color[1], color[2]);
    // ellipse(mouseX, mouseY,50,50);
    data.x = mouseX/width;
    data.y =  mouseY/height;
    socket.emit('mouse', data); //name and apply data to message and send via socket
}
