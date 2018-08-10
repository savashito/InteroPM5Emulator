// function toLongUUID(shortUUID){
// 	return "ce06"+shortUUID+"43e511e4916c0800200c9a66";
// }

// module.exports = {
// 	toLongUUID:toLongUUID
// };


let socketController = null;
let ergData = ErgData();
function setSocketController(socket){
	socketController = socket;
}
/*
function suscribeC2characteristic(characteristic,msgKey,callback){
	characteristic.subscribe(function(error){
		console.log("Suscribe successfully to characteristic ",characteristic.uuid);
	});
	characteristic.on('data', function(data, isNotification) {
		// console.log(data);
		data = callback(data,ergData);
		if(isErgDataBuilt(ergData)){
			socketController.emit(msgKey,ergData);
			ergData = ErgData();
		}
		if(msgKey=='strokeData'){
			socketController.emit(msgKey,data);
		}
		// socketController.emit(msgKey,data);

		// console.log(callback(data));
	});
}
*/
// ergData constructor
function ErgData(){
	return {
		time:null,
		distance:null,
		spm:null,
		pace:null,
	};
}
/*
function isErgDataBuilt(ergData){
	return (time && distance && spm && pace);
}

function getC2PrimaryService(peripheral){
	return new Promise(function (resolve, reject) {
		peripheral.discoverServices([toLongUUID("0030")],function(err, services) {
			if (err) 
				reject(err);
			const service = services[0];
			// services.forEach(function(service) {
			console.log('found service:', service.uuid);
			resolve(service);
		});
	});
}
*/
function getC2GeneralStatusCharacteristic(service){
	return getC2Characteristic(service,[
		toLongUUID("0031"),
		toLongUUID("0032"),
		toLongUUID("0033"),
		toLongUUID("0035"),
		toLongUUID("0036"),
		toLongUUID("003A"),
		]);
}

function toLongUUID(shortUUID){
	return "ce06"+shortUUID+"43e511e4916c0800200c9a66";
}

function getErgServices(){
	return ["ce06002043e511e4916c0800200c9a66","ce06001043e511e4916c0800200c9a66","ce06003043e511e4916c0800200c9a66"];
}

module.exports = {
	setSocketController:setSocketController,
	// suscribeC2characteristic:suscribeC2characteristic,
	// getC2PrimaryService:getC2PrimaryService,
	getC2GeneralStatusCharacteristic:getC2GeneralStatusCharacteristic,
	toLongUUID:toLongUUID,
	getErgServices:getErgServices,
};

