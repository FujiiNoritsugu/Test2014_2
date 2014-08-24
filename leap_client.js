var leap = require('leapjs');
var client = require('socket.io-client');
//var socket = client.connect('http://54.238.172.248:9080');
var socket = client.connect('http://192.168.1.6:9080');

var swipeCount = 0;

socket.on('connect',onConnect);

function onConnect(){
	socket.send("leap");
	leap.loop({enableGestures: true},onLoop);
	sendLeftArmMessage();
	sendRightArmMessage();
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

var armLeftValue = null;
var armRightValue = null;
var slideValue = null;

// 2秒毎にポーリングを実施し、値が設定されていればイベントを送信する
function sendLeftArmMessage(){
  if(armLeftValue != null){
console.log("left = "+armLeftValue);
   socket.send(armLeftValue);
   armLeftValue = null;
  }
  setTimeout(sendLeftArmMessage, 2000);
}

// 2秒毎にポーリングを実施し、値が設定されていればイベントを送信する
function sendRightArmMessage(){
  if(armRightValue != null){
console.log("right = " + armRightValue);
   socket.send(armRightValue);
   armRightValue = null;
  }
  setTimeout(sendRightArmMessage, 2000);
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
  var rFinger = hand.ringFinger;

  distance1 = leap.vec3.distance(tFinger.tipPosition, iFinger.tipPosition);
  distance2 = leap.vec3.distance(tFinger.tipPosition, rFinger.tipPosition);

  //console.log("distance1 = " + distance1);
  checkFinger(1, distance1);
  //console.log("distance2 = " + distance2);
  checkFinger(2, distance2);
  
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

function checkFinger(type, distance){
 var value = null;
 if(type === 1){
   if(distance < 30){
     value = 3;
   }else if(distance < 40){
     value = 2;
   }else if(distance < 60){
     value = 1;
   }
   armRightValue = value;
   //armRightValue = distance;
 }else{
    if(distance < 50){
     value = 6;
   }else if(distance < 60){
     value = 5;
   }else if(distance < 130){
     value = 4;
   }
   armLeftValue = value;
   //armLeftValue = distance;
 }

}
