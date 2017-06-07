'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const characteristicPM5 = require('./characteristicPM531');
class SocketController {
	constructor() {
		this.socket = undefined;
	}

	setSocket(socket) {
		this.socket = socket;
	}
	emit(event,data){
		if(this.socket)
			this.socket.emit(event,data);
		else
			console.log("Socket has not been initialized")
	}
}
let socketUnity = [];


function init(characteristicPM5){
	let socketController = new SocketController();
	io.on('connection', function(socket){
		console.log('a user connected');
		socketController.setSocket(socket);
		socket.on('unityUser', function (data){
			console.log("fd");
			socketUnity.push(socket);
			// socketUnity = socket;
		})
		socket.on('ergData', function(data){
			if(socketUnity.length){
				for (var i = 0; i < socketUnity.length; i++) {
					socketUnity[i].emit('ergData',data);
				}
				// socketUnity.emit('ergData',data);
				// console.log(data)

			}
			// packageErgEntry(data)
		//	console.log('ergData: ' , data);
			// console.log('ergData: ' , data,data.i);
			/*
			switch(data.i){
				case 0:
				characteristicPM5.characteristicPM5ErgCallback(data);
				break;
				case 1:
				characteristicPM5.characteristicPM51ErgCallback(data);
				break;
			}
			*/
			// characteristicPM5.characteristicPM51ErgCallback(data);
			
			// socketController.emit('ergData',data);
		});
		socket.on('strokeData', function(data){
			if(socketUnity.length){
				for (var i = 0; i < socketUnity.length; i++) {
					socketUnity[i].emit('strokeData',data);
				}
				// socketUnity.emit('ergData',data);
				console.log(data);
			}
		//	console.log('strokeData: ' , data);
			// characteristicPM5.characteristicPM5StrokeCallback(data);
			// socketController.emit('strokeData',data);

		});
	});

	http.listen(8080, function(){
		console.log('listening on *:8080');
	});
	// http.listen(8081, function(){
	// 	console.log('listening on *:8081');
	// });
	return socketController;
}
module.exports = init;
// export default  socketController;


