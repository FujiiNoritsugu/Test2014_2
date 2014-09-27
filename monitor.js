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
 var now = new Date();
 if(target_socket != null){
  target_socket.send(now % 60);
  console.log("send data in tick");
 }
}

