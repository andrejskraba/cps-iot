var http = require("http").createServer(handler); // on req - hand
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    board.pinMode(0, board.MODES.ANALOG); // enable analog pin 0
});

function handler(req, res) {
    fs.readFile(__dirname + "/example10.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

var desiredValue = 0; // desired value var

http.listen(8080); // server will listen on port 8080

var sendValueViaSocket = function(){}; // var for sending messages

board.on("ready", function(){
    
board.analogRead(0, function(value){
    desiredValue = value; // continuous read of analog pin 0
});

io.sockets.on("connection", function(socket) {
    socket.emit("messageToClient", "Srv connected, board OK");

    setInterval(sendValues, 40, socket); // on 40ms trigerr func. sendValues
    
}); // end of sockets.on connection

}); // end of board.on ready

function sendValues (socket) {
    socket.emit("clientReadValues",
    {
    "desiredValue": desiredValue
    });
};