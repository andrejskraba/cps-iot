var http = require("http");
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // pin8 as out    
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // pin13 as out
});

http.createServer(function(req, res) {
    var parts = req.url.split("/"); // split request on / character
    var operator1 = parseInt(parts[1],10); // 10 is radix - decimal notation
    var operator2 = parseInt(parts[2],10); // 10 is radix - decimal notation
    
    if (operator1 == 0) {
        console.log("Putting LED to OFF.");
        board.digitalWrite(13, board.LOW);
    }
    if (operator1 == 1) {
        console.log("Putting LED to ON.");
        board.digitalWrite(13, board.HIGH);
    }
    
    if (operator2 == 0) {
        console.log("Putting LED to OFF.");
        board.digitalWrite(8, board.LOW);
    }
    if (operator2 == 1) {
        console.log("Putting LED to ON.");
        board.digitalWrite(8, board.HIGH);
    }    
    
    res.writeHead(200, {"Content-Type": "text/plain"}); // 200=OK
    res.write("For test write into browser e.g. 123.1.2.3:8080/1 \n");
    res.end("The value of the operator is: " + operator1 + "|" + operator2);
    
}).listen(8080, "172.16.22.240"); // listen on port 8080

