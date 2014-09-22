var Cylon = require('cylon');
var io = require('socket.io').listen(9080);
var armQueue;
var slideQueue;
var rSensorValue;
var lSensorValue;

io.sockets.on('connection', onConnection);

function onConnection(socket){
  startRobot();
  socket.on('message', onMessage);
  armQueue = [];
  slideQueue = [];
}

function onMessage(message){
console.log(message);
    if(isFinite(message)){
     armQueue.push(message);
    }else{
     slideQueue.push(message);
    }
}

function startRobot(){
Cylon.robot({
	connection: {name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'},
	device: [{name: 'hServo', driver: 'servo', pin:9},
	         {name: 'lServo', driver: 'servo', pin:7},
	         {name: 'rServo', driver: 'servo', pin:5},
	         {name: 'lSensor', driver: 'analogSensor', pin:1},
	         {name: 'rSensor', driver: 'analogSensor', pin:3}
	],
	work: function(my){
		every((2).second(), function(){ armFunction(my); });
		every((3).second(), function(){ slideFunction(my); });
		every((1).second(), function(){ sensorFunction1(my); });
		every((1).second(), function(){ sensorFunction2(my); });
	}
	}).start();
}

var sensorFunction1 = function(my){
lSensorValue = my.lSensor.analogRead();
// var lValue = my.lSensor.analogRead();
//console.log("left value = " + lValue);
// var RValue = my.rSensor.analogRead();
//console.log("right value = " + RValue);
};

var sensorFunction2 = function(my){
rSensorValue = my.rSensor.analogRead();
// var lValue = my.lSensor.analogRead();
//console.log("left value = " + lValue);
// var RValue = my.rSensor.analogRead();
//console.log("right value = " + RValue);
};

function armFunction(my){

	var arm = armQueue.shift();
	
	if(arm == 1){
		my.lServo.angle(0);
		my.rServo.angle(0);
	}else if(arm == 2){
		my.lServo.angle(140);
		my.rServo.angle(140);
	}else if(arm == 3){
		my.lServo.angle(180);
		my.rServo.angle(180);
	}

}

var currentPosition = 40;
function slideFunction(my){
	
	var slide = slideQueue.shift();
	var isMove = false;
console.log("slide=" + slide);
	if(slide == 'right'){
		currentPosition = currentPosition + 50;
		isMove = true;
console.log("currentPosition="+currentPosition);
	}else if(slide == 'left'){
		currentPosition = currentPosition - 50;
		isMove = true;
console.log("currentPosition="+currentPosition);
	}
	
	if(currentPosition < 40){
		currentPosition = 40;
	}else if(currentPosition > 140){
		currentPosition = 140;
	}else if(isMove && (currentPosition >= 40) && (currentPosition <= 140)){
		my.hServo.angle(currentPosition);
	}
	
}
//----------- for monitoring -----------------------------
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

var fs = require('fs');
var html = fs.readFileSync('monitor.html', 'utf8');

app.listen(8124);

var target_socket;
io.sockets.on('connection', function(socket){
	console.log("connection");
	socket.on('message', function(data){
		console.log("message = "+data);
		target_socket = this;
	});
	
	if(target_socket != null){
		target_socket.send("send data");
		console.log("send data");
	}
	setInterval(tick, 1000);
});

function handler(req, res){
 res.setHeader('Content-Type', 'text/html');
 res.setHeader('Content-Length', Buffer.byteLength(html, 'utf8'));
 res.end(html);
}

function tick(){
 //var now = new Date();
 //if(target_socket != null){
 // target_socket.send(now % 60);
 // console.log("send data in tick");
 //}
 if(target_socket != null){
 
  if(rSensorValue != null){
   target_socket.send("r"+rSensorValue);
  }
 
  if(lSensorValue != null){
   target_socket.send("l"+lSensorValue);
  }
 
 }
 
}

