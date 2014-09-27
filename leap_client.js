var leap = require('leapjs');
var client = require('socket.io-client');
var socket = client.connect('http://192.168.1.6:9080');

var swipeCount = 0;

socket.on('connect',onConnect);

function onConnect(){
	socket.send("leap");
	leap.loop({enableGestures: true},onLoop);
	sendArmMessage();
	sendSlideMessage();
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
  var distance = hand.sphereRadius;
  checkFinger(distance);

}

function gestureSwipe(gesture){
  if(gesture.direction[0] > 0){
    swipeDirection = "right";
    swipeCount ++;
  } else {
    swipeDirection = "left";
    swipeCount --;
  }

  if(swipeCount > 15){
    slideValue = 'right';
    swipeCount = 0;
  }else if(swipeCount < -15){
    slideValue = 'left';
    swipeCount = 0;
  }
}

function checkFinger(distance){
 var value = null;
 
  if(distance != null){
  if(distance > 80){
    value = 1;
  }else if(distance > 40){
    value = 2;
  }else {
    value = 3;
  }
 }

   armValue = value;

}
