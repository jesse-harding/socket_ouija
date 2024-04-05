//terminal:
    // navigate to project folder (cd & drag from finder)
    // npm install node
    // npm install express
    // npm install socket.io //make sure versions match between server and client
    // node server.js to run server
//make folder named "public" in project dir for hosted site


let express = require('express'); //add the express package/libary
let app = express(); //trigger express function

let port; //set port
if (port == null || port == "") {
    port = 3000;
}
let server = app.listen(port); //create listener on port

app.use(express.static('public')); //post contents of "public" dir to server
let socket = require('socket.io'); //add the socket.io package/library
let io = socket(server); //create socket object that is part of the server on port 3000
io.sockets.on('connection', newConnection); //check for new connection

//store client information to be parsed and sent to localhost
let avgArray = [];

let maxParticipants = 100; //****change this later****
for (let i = 0; i < maxParticipants; i++){
    avgArray[i] = [];
    avgArray[i][0] = 0;
    avgArray[i][1] = 0;
}

var tempData = {    //temporary data
    x: 0,
    y: 0,
    id: "",
    num: 0,
    num2: 0,
    avgX: 0,
    avgY : 0
}

var serverMsg = {
    avgX: 0,
    avgY : 0
}

//object to hold averaged data to be sent out.
let avgOut = {
    x: 0,
    y: 0
}

let allClients = [];

function newConnection(socket){ //triggered when there is a new connection / message sent
    allClients.push(socket.id);
    console.log("new client connected, total clients:" + allClients.length);
    // console.log("new client id:" + socket.id);
    socket.on('disconnect', function() {
        var i = allClients.indexOf(socket.id);
        allClients.splice(i, 1);
        console.log("client disconnected, total clients:" + allClients.length);
    });

    socket.on('mouse', mouseMsg);
    
    function mouseMsg(mouseData){
            
            unitCoordConstrain(mouseData);
            
            tempData.x = mouseData.x;
            tempData.y = mouseData.y;
            tempData.id = socket.id;
            tempData.num = allClients.indexOf(socket.id);
            tempData.num2 = allClients.length;
            tempData.color = mouseData.color;  
            calcAvg(tempData);
            serverMsg.avgX = tempData.avgX;
            serverMsg.avgY = tempData.avgY;
            io.sockets.emit('L1', serverMsg);
        // }
    }
    
    function calcAvg(incomingData){
        
        //sets unused client data in array to 0,0
        if (avgArray.length > incomingData.num2){
            for (let i = incomingData.num2; i < avgArray.length; i++){
                avgArray[i][0]=0;
                avgArray[i][1]=0;
            }
        }

        if (incomingData.num < avgArray.length){
            avgArray[incomingData.num][0] = incomingData.x;
            avgArray[incomingData.num][1] = incomingData.y;
        }
        
        let tempCount = 0;
        avgOut.x = 0;
        avgOut.y = 0;
        for (let i = 0; i < incomingData.num2; i++){
            avgOut.x += avgArray[i][0];
            avgOut.y += avgArray[i][1];
            if (avgArray[i][0] != 0 && avgArray[i][1] != 0){
                tempCount++;
            }
        }
        
        if (tempCount != 0){
            avgOut.x = avgOut.x / tempCount;
            avgOut.y = avgOut.y / tempCount;
        }
        tempData.avgX = avgOut.x;
        tempData.avgY = avgOut.y;
    }    
}

function unitCoordConstrain(input){
    if (input.x != 0 && input.y != 0){
        if (input.x > 1){
            input.x = 1;
        }
        if (input.x < 0.001){
            input.x = 0.001;
        }
        if (input.y > 1){
            input.y = 1;
        }
        if (input.y < 0.001){
            input.y = 0.001;
        } 
        return input;
    }
}