'use strict';


const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require("fs");
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
let unityUserNames = ["a","b","c","d"];
let unityUserLogFiles = [undefined,undefined,undefined,undefined];
let unityUserOldDistance =[0,0,0,0];
const date = new Date();
//{flags:'w'}

function init(characteristicPM5){
	let socketController = new SocketController();
	// let string
	io.on('connection', function(socket){
		console.log('a Mackiz connected');
		socketController.setSocket(socket);

		socket.on('unityUser', function (data){
			console.log("unity User Socket connected!");
			socketUnity.push(socket);
			socket.emit('unityUserConnected',{status:'OK'});
			console.log("emitted unityUserConnected");
		})

		socket.on('disconnect', function() {
      		console.log('Got disconnect! ',socketUnity);
      		var i = socketUnity.indexOf(socket);
      		socketUnity.splice(i, 1);
      		console.log("afeter",socketUnity);
   		});
		socket.on('name', function(data){
			// who is the erg from?
			/*
			let dir = "./data/"+data.name+"/";
			console.log(date.getMinutes())
			let name = dir+data.name+"_"+date.getHours() +":"+date.getMinutes()+"_"+date.getDate()+"_"+date.getMonth()+"_"+date.getFullYear()+".txt";
			if(!fs.existsSync("./data")){
				fs.mkdirSync("./data");
			}

			if(!fs.existsSync(dir)){
				
				fs.mkdirSync(dir);
			}
			
			console.log("Got name ",name);
			unityUserNames[data.id] = data.name;
			unityUserLogFiles[data.id] = fs.createWriteStream(name);
			*/
		});

		socket.on('ergData', function(data){

			// console.log("ergData," ,data);
			/*
			let i = Number(data.i);
			if (i == NaN)i=0;
			i=0;
			characteristicPM5.characteristicPM5ErgCallback(i,data);*/
			if(socketUnity.length){
				for (var i = 0; i < socketUnity.length; i++) {
						console.log(data);
						socketUnity[i].emit('ergData',data);
					}
				// for (var i = 0; i < socketUnity.length; i++) {
				// 		console.log(data);
				// 		socketUnity[i].emit('ergData',data);
				// 	}
				/*
				// only emit if different
				if(unityUserOldDistance[data.i]!=data.distance){
					for (var i = 0; i < socketUnity.length; i++) {
						console.log(data);
						socketUnity[i].emit('ergData',data);
					}
					// socketUnity.emit('ergData',data);
					// console.log(data.i)
					if(unityUserLogFiles[data.i]){
						// console.log(data);

						
						unityUserLogFiles[data.i].write(JSON.stringify(data));
						unityUserLogFiles[data.i].write("\n");
					}
					
				}*/
				// unityUserOldDistance[data.i]=data.distance;
				
	

			}else{
				// console.log("No user");
			// console.log(data)

			}
			// packageErgEntry(data)
		//	console.log('ergData: ' , data);
			// console.log('ergData: ' , data,data.i);
			// characteristicPM5.characteristicPM5ErgCallback(data);
			// console.log("Send BLE data ",data);
			// console.log("ErgData",data);
			// if(data.i==0){
			// 	characteristicPM5.characteristicPM5ErgCallback(data.i,data);
			// }
			
			/*
			switch(data.i){
				case 0:
				characteristicPM5.characteristicPM5ErgCallback(data);
				break;
				case 1:
				characteristicPM5.characteristicPM51ErgCallback(data);
				break;
			}// Telcel call for credit *135#
			*/
			
			// characteristicPM5.characteristicPM51ErgCallback(data);
			
			if(socketController)socketController.emit('ergData',data);
		});
		socket.on('strokeData', function(data){
			if(socketUnity.length){
				for (var i = 0; i < socketUnity.length; i++) {
					// console.log(data);
					socketUnity[i].emit('strokeData',data);
				}
			}
			// if(socketUnity.length){
			// 	for (var i = 0; i < socketUnity.length; i++) {
			// 		socketUnity[i].emit('strokeData',data);
			// 	}
			// 	// socketUnity.emit('ergData',data);
			// 	// console.log(data);
			// }
			// console.log('strokeData:', data);
			// characteristicPM5.characteristicPM5StrokeCallback(i,data);
			if(socketController)socketController.emit('strokeData',data);

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


