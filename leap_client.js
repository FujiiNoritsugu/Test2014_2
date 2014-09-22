var leap = require('leapjs');
var client = require('socket.io-client');
//var socket = client.connect('http://54.238.172.248:9080');
var socket = client.connect('http://192.168.1.6:9080');

var swipeCount = 0;

socket.on('connect',onConnect);

function onConnect(){
	socket.send("leap");
	leap.loop({enableGestures: true},onLoop);
	sendArmMessage();
	sendSlideMessage();
	//process.exit(0);
}

function onLoop(frame) {

    if(frame.hands.length > 0){
      actionHand(frame);
    }

  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
        if(gesture.type == "swipe"){
         gestureSwipe(gesture);
        }
    });
  }
  
}

var armValue = null;
var preValue = null;
var slideValue = null;

// 5秒毎にポーリングを実施し、値が設定されておりかつ前回と異なればイベントを送信する
function sendArmMessage(){
  if(armValue != null && armValue != preValue){
console.log("arm = "+armValue);
   socket.send(armValue);
   preValue = armValue;
  }
  setTimeout(sendArmMessage, 5000);
}

// 3秒毎にポーリングを実施し、値が設定されていればイベントを送信する
function sendSlideMessage(){
  if(slideValue != null){
   console.log(slideValue);
   socket.send(slideValue);
   slideValue = null;
  }
  setTimeout(sendSlideMessage, 3000);
}

function actionHand(frame){
  var hand = frame.hands[0];
  var tFinger = hand.thumb;
  var iFinger = hand.indexFinger;

  distance = leap.vec3.distance(tFinger.tipPosition, iFinger.tipPosition);

  //console.log("distance1 = " + distance1);
  checkFinger(distance);
  //console.log("distance2 = " + distance2);

}

function gestureSwipe(gesture){
  //console.log("Swipe Gesture");
  if(gesture.direction[0] > 0){
    swipeDirection = "right";
    swipeCount ++;
  } else {
    swipeDirection = "left";
    swipeCount --;
  }

  if(swipeCount > 15){
    //socket.send("right");
    slideValue = 'right';
    swipeCount = 0;
  }else if(swipeCount < -15){
    //socket.send("left");
    slideValue = 'left';
    swipeCount = 0;
  }
  //console.log(swipeDirection);
}

//var preValue = null;

function checkFinger(distance){
//console.log("distance = "+distance);
 var value = null;
 
 if(distance != null){
  if(distance < 25){
    value = 3;
  }else if(distance >= 25 && distance < 50){
    value = 2;
  }else if(distance >= 50){
    value = 1;
  }
 }
   armValue = value;
//console.log("armValue = "+armValue);

}
