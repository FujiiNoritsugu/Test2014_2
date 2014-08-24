var Cylon = require('cylon');
var io = require('socket.io').listen(9080);
var armQueue;
var slideQueue;

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
		every((1).second(), function(){ sensorFunction(my); });
	}
	}).start();
}

var sensorFunction = function(my){
 var lValue = my.lSensor.analogRead();
//console.log("left value = " + lValue);
 var RValue = my.rSensor.analogRead();
//console.log("right value = " + RValue);
};

function armFunction(my){

	var arm = armQueue.shift();
	
	if(arm == 1){
		my.lServo.angle(0);
	}else if(arm == 2){
		my.lServo.angle(90);
	}else if(arm == 3){
		my.lServo.angle(180);
	}else if(arm == 4){
		my.rServo.angle(0);
	}else if(arm == 5){
		my.rServo.angle(90);
	}else if(arm == 6){
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
