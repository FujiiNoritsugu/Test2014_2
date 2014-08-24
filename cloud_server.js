var leap_id,rasp_id;
var leap_socket, rasp_socket;

var io = require('socket.io').listen(9080);
io.sockets.on('connection', onConnection);

function onConnection(socket){
  //console.log(socket);
  socket.on('message', onMessage);
}

function onMessage(message){
    if(message === "leap"){
      leap_id = this.id;
      leap_socket = this;
      console.log(leap_id);
    }else if(message === "rasp"){
      rasp_id = this.id;
      rasp_socket = this;
      console.log(rasp_id);
    }else{
      if(this.id === leap_id && rasp_socket != null){
       rasp_socket.send(message);
      }
    }
    //console.log(message);
}

