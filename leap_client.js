var leap = require('leapjs');

var before,current;
leap.loop({enableGestures: true}, function(frame) {

    if(frame.hands.length > 0)
    {
        var hand = frame.hands[0];
        var tFinger = hand.thumb;
        var iFinger = hand.indexFinger;
        var rFinger = hand.ringFinger;
        
        distance1 = leap.vec3.distance(tFinger.tipPosition, iFinger.tipPosition);
        distance2 = leap.vec3.distance(tFinger.tipPosition, rFinger.tipPosition);
        console.log("distance1 = " + distance1);
        console.log("distance2 = " + distance2);
    }

  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
        switch (gesture.type){
          case "circle":
              console.log("Circle Gesture");
              break;
          case "keyTap":
              console.log("Key Tap Gesture");
              break;
          case "screenTap":
              console.log("Screen Tap Gesture");
              break;
          case "swipe":
              console.log("Swipe Gesture");
              if(gesture.direction[0] > 0){
                  swipeDirection = "right";
              } else {
                  swipeDirection = "left";
              }
              console.log(swipeDirection);
              break;
        }
    });
  }
});
