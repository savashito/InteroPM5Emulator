var util = require('util');
let PM5Util = require('./PM5Util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
// ***** ergData ********** //
// let time = 0;
// let pace = 387.8277952417603;
// let spm = 22;
// commong
let time;
// 31
let distance		=	0;
let flags;
let totalWOGDistance;
let totalWOGTime;
let WOGTimeType;
let drag;
// 32
let speed;               // Speed
let SPM;                 // Stroke rate
let heartrate;           // Heartrate ToDo in emulator and BLE
let pace;                // Current Pace 
let avgPace;             // Average Pace ToDo in emulator and BLE
let restDistance;        // Rest Distance ToDo in emulator and BLE
let restTime;            // Rest Time ToDo in emulator and BLE
    // 33
let intervalCount;         // Interval Count ToDo in emulator and BLE
let avgPower;            // Average Power ToDo in emulator and BLE
let calories;            // Total calories
let splitAvgPace;       // Split Average Place ToDo in emulator and BLE
let splitAvgPower;       // split Average Power ToDo in emulator and BLE
let splitAvgCalories;    // Split Average Calories ToDo in emulator and BLE
let splitTime;           // Split Time ToDo in emulator and BLE
let splitDistance;       // Split Distance ToDo in emulator and BLE
////////**** StrokeData ******////
// let distance = 0;
// let strokeRecoveryTime = 0;
// let driveTime = 0;

    // Stroke Data
let driveLength		=	0;                 // Drive Lentgth
let driveTime		=	0;                   // Drive Time
    // Recovery
let strokeRecoveryTime		=	0;          // Stroke Recovery Time
let strokeRecoveryDistance	=	0;              // Stroke Distance ToDo in emulator and BLE
    //
let peakDriveForce		=	0;              // Peak Drive Force
let avgDriveForce		=	0;               // Average Drive Force
let workPerStroke		=	0;               // Work per stroke ToDo in emulator and BLE
let strokeCount			=	0;                 // Stroke Count
    // 36
let strokePower			=	0;                 // Stroke Power
let strokeCalories		=	0;              // Stroke Calories ToDo in emulator and BLE
let projectedWorkTime	=	0;           // Projected Work Time ToDo in emulator and BLE
let projectedWorkDistance	=	0;       // Projected Work Distance ToDo in emulator and BLE
// Erg index
let i = 0;

function characteristicPM5(update3x,uuid,timeOut=500){
	let _updateValueCallback = null;
	let _value = Buffer.allocUnsafe(5*4);
	let characteristicPM53x = function() {
		characteristicPM53x.super_.call(this, {
			uuid: PM5Util.toLongUUID(uuid),
			properties: ['read', 'write', 'notify'],
			value: null
		});
	}

	util.inherits(characteristicPM53x, BlenoCharacteristic);
	characteristicPM53x.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
		console.log('characteristicPM53x - onSubscribe '+uuid);
		_updateValueCallback = updateValueCallback;
	};

	characteristicPM53x.prototype.onUnsubscribe = function() {
		console.log('characteristicPM53x - onUnsubscribe');
		_updateValueCallback = null;
	};
	characteristicPM53x.update=function(data) {
		// update();
		console.log("uidd ",uuid,_updateValueCallback);
		if(_updateValueCallback){
			// console.log("update "+uuid);
			update3x(_value,data);
			_updateValueCallback(_value);
			// setTimeout(characteristicPM53x.update, timeOut);
		}
	}
/*
	function update() {
		if(_updateValueCallback){
			console.log("update "+uuid);
			getDummy3x(_value);
			_updateValueCallback(_value);
		}
		// setTimeout(update, timeOut);
	}
	// setTimeout(update, timeOut);
*/
	return characteristicPM53x;
}







//////

class ManageBufferPM5{
	constructor (buffer) {
		this.buffer = buffer;
		this.i = 0;
 	}

	writeTime (time) {
		this.write3Bytes(time/0.01);
	}
	writeDistance (distance) {
		this.write3Bytes(distance/0.1);
	}
	writeUnimportantFlags(nGarbage){
		this.i+=nGarbage;
	}
	writePace (pace) {
		this.write2Bytes(pace/0.01);
	}
	writeByte(value){
		this.buffer.writeUInt8(value, this.i++);
	}
	write2Bytes(val){
		val = Math.round(val);
		// console.log('write2Bytes',val);
		this.buffer.writeUInt16LE(val, this.i);
		this.i += 2;
	}
	write3Bytes(val){
		val = Math.round(val);
		// console.log('write3Bytes',val);
		const pos = this.i;
		this.buffer.writeUInt32LE(val, pos + 0);
		// this.buffer.writeUInt16LE(val >> 8, pos + 0);
		// const num = val & 0xFF;
		// console.log(num,pos);
		// this.buffer.writeUInt8(num, pos + 2);

		this.i=this.i+3;
	}
	getBuffer(){
		return this.buffer;
	}
}
// let _value = Buffer.allocUnsafe(5*4);
// getDummy31(_value);

	// this.buf = // Buffer.from([69,69,69]);

/*
	characteristicPM53x.update=function() {
		// update();
		if(_updateValueCallback){
			console.log("update "+uuid);
			getDummy3x(_value);
			_updateValueCallback(_value);
			// setTimeout(characteristicPM53x.update, timeOut);
		}
	}*/
/*
function characteristicPM5TestErgCallback(data){
	console.log("HelloErg ",data);
	distance += 1;//Number(data.distance);
	time += 0.5 ;//Number(data.time);
	spm = 22 ; //Number(data.spm);
	pace = 123;//Number(data.pace);
	characteristicPM531.update();//{time:data.time,distance:data.distance});
	characteristicPM532.update();
	// characteristicPM535.update();
	// characteristicPM536.update();
	setTimeout(characteristicPM5TestErgCallback, 500);
}
// setTimeout(characteristicPM5TestErgCallback, 500);

function characteristicPM5Test1ErgCallback(data){
	console.log("HelloErg1 ",data);
	distance += 1;//Number(data.distance);
	time += 0.5 ;//Number(data.time);
	spm = 22 ; //Number(data.spm);
	pace = 123;//Number(data.pace);
	characteristicPM5131.update();//{time:data.time,distance:data.distance});
	characteristicPM5132.update();
	// characteristicPM535.update();
	// characteristicPM536.update();
	setTimeout(characteristicPM5Test1ErgCallback, 500);
}
*/
// setTimeout(characteristicPM5Test1ErgCallback, 500);

const characteristicPM5_31 = [
	characteristicPM5(update31,'0031'),
	characteristicPM5(update31,'0131'),
	characteristicPM5(update31,'0231'),
	characteristicPM5(update31,'0331')];

const characteristicPM5_32 = [
	characteristicPM5(update32,'0032'),
	characteristicPM5(update32,'0132'),
	characteristicPM5(update32,'0232'),
	characteristicPM5(update32,'0332')];

const characteristicPM5_33 = [
	characteristicPM5(update33,'0033'),
	characteristicPM5(update33,'0133'),
	characteristicPM5(update33,'0233'),
	characteristicPM5(update33,'0333')];

const characteristicPM5_35 = [
	characteristicPM5(update35,'0035'),
	characteristicPM5(update35,'0135'),
	characteristicPM5(update35,'0235'),
	characteristicPM5(update35,'0335')];

const characteristicPM5_36 = [
	characteristicPM5(update36,'0036'),
	characteristicPM5(update36,'0136'),
	characteristicPM5(update36,'0236'),
	characteristicPM5(update36,'0336')];

const characteristics = [];
for (let i = 0; i < 4; ++i) {
	characteristics.push(
		[new characteristicPM5_31[i](),
		new characteristicPM5_32[i](),
		new characteristicPM5_35[i](),
		new characteristicPM5_36[i]()
		]);
}
				
				// [
				// 	new characteristicsPM5.characteristicPM531(),
				// 	new characteristicsPM5.characteristicPM532(),
				// 	new characteristicsPM5.characteristicPM535(),
				// 	new characteristicsPM5.characteristicPM536(),
				// ]
function characteristicPM5ErgCallback(offset,data){
	// console.log("HelloErg ",data);
	time	= Number(data.time);
	// 31
	distance	= Number(data.distance);
	flags	= Number(data.flags);
	totalWOGDistance	= Number(data.totalWOGDistance);
	totalWOGTime	= Number(data.totalWOGTime);
	WOGTimeType	= Number(data.WOGTimeType);
	drag	= Number(data.drag);
	// 32
	// Ergadata
	speed	= Number(data.speed);               // Speed
	SPM	= Number(data.SPM);                 // Stroke rate
	heartrate	= Number(data.heartrate);           // Heartrate ToDo in emulator and BLE
	pace	= Number(data.pace);                // Current Pace 
	avgPace	= Number(data.avgPace);             // Average Pace ToDo in emulator and BLE
	restDistance	= Number(data.restDistance);        // Rest Distance ToDo in emulator and BLE
	restTime	= Number(data.restTime);            // Rest Time ToDo in emulator and BLE
	// 33
	intervalCount = Number(data.intervalCount);         // Interval Count ToDo in emulator and BLE
	avgPower	= Number(data.avgPower);            // Average Power ToDo in emulator and BLE
	calories	= Number(data.calories);            // Total calories
	splitAvgPace	= Number(data.splitAvgPace);       // Split Average Place ToDo in emulator and BLE
	splitAvgPower	= Number(data.splitAvgPower);       // split Average Power ToDo in emulator and BLE
	splitAvgCalories	= Number(data.splitAvgCalories);    // Split Average Calories ToDo in emulator and BLE
	splitTime	= Number(data.splitTime);           // Split Time ToDo in emulator and BLE
	splitDistance	= Number(data.splitDistance);       // Split Distance ToDo in emulator and BLE
	i = Number(data.i)
	// 
	characteristicPM5_31[i].update(); 
	characteristicPM5_32[i].update();
	characteristicPM5_33[i].update();
	// TODO wrong
	// characteristicPM5_35[offset].update(); 
	// characteristicPM5_36[offset].update();
	//{time:data.time,distance:data.distance});
	// characteristicPM535.update();
	// characteristicPM536.update();
}


// function characteristicPM51ErgCallback(data){
// 	console.log("HelloErg1 ",data);
// 	distance = Number(data.distance);
// 	time = Number(data.time);
// 	spm = Number(data.spm);
// 	pace = Number(data.pace);
// 	characteristicPM5131.update();//{time:data.time,distance:data.distance});
// 	characteristicPM5132.update();
// 	// characteristicPM535.update();
// 	// characteristicPM536.update();
// }

function characteristicPM5StrokeCallback(data){
	//console.log("HelloStroke ",data);
	time 		=	 Number(data.time);
	distance 	=	 Number(data.distance);
	driveLength =	 Number(data.driveLength);
	driveTime 	=	 Number(data.driveTime);
	// Stroke recovery
	strokeRecoveryTime 	= Number(data.strokeRecoveryTime);
	strokeRecoveryDistance 	= Number(data.strokeRecoveryDistance);
	// Stroke info
	peakDriveForce 		=	 Number(data.peakDriveForce);
	avgDriveForce 		=	 Number(data.avgDriveForce);
    workPerStroke 		=	 Number(data.workPerStroke);               // Work per stroke ToDo in emulator and BLE
	strokeCount 		=	 Number(data.strokeCount);
	// 36
	strokePower 		=	 Number(data.strokePower);
	strokeCalories 		=	 Number(data.strokeCalories);
    projectedWorkTime 	=	 Number(data.projectedWorkTime);           // Projected Work Time ToDo in emulator and BLE
    projectedWorkDistance = Number(data.projectedWorkDistance);       // Projected Work Distance ToDo in emulator and BLE
	i 					=	 Number(data.i);

	// strokeRecoveryTime = Number(data.strokeRecoveryTime);
	// driveTime = Number(data.driveTime);
	// strokeRecoveryTime =strokeRecoveryTime?strokeRecoveryTime:0;
	// driveTime=driveTime ? driveTime:0;

	//console.log("HelloStroke ",strokeRecoveryTime, driveTime);
	// characteristicPM531.update();
	// characteristicPM532.update();
	console.log("i : ",i);
	characteristicPM5_35[i].update(); 
	characteristicPM5_36[i].update();
}
function update31(bufferData){
	const mBuffer = new ManageBufferPM5(bufferData);
	mBuffer.writeTime(time);  // 
	mBuffer.writeDistance(distance);
	mBuffer.writeUnimportantFlags(flags);
	mBuffer.writeDistance(totalWOGDistance); // total work disntace
	mBuffer.writeTime(totalWOGTime); // workout duration
	mBuffer.writeByte(WOGTimeType);    // workut 
	mBuffer.writeByte(drag);  // drag factor
	return mBuffer.getBuffer();
}

function update32(data){
	bufferErg = new ManageBufferPM5(data) ;
		bufferErg.writeTime(time);  // elapsed time 
		bufferErg.write2Bytes(speed); // speed 40/0.001
		bufferErg.writeByte(SPM); // SPM
		bufferErg.writeByte(heartrate); // HRM
		bufferErg.writePace(pace); // Current Pace
		bufferErg.writePace(avgPace); // Average pace
		bufferErg.write2Bytes(restDistance); // rest distance
		bufferErg.writeTime(restTime);  // rest time
	return bufferErg.getBuffer();
}

function update33(data){
	
	bufferErg = new ManageBufferPM5(data) ;
	 	bufferErg.writeTime(time);
	 	bufferErg.writeByte(intervalCount);
	 	bufferErg.write2Bytes(avgPower);
	 	bufferErg.write2Bytes(calories);
		// Averages
	 	bufferErg.writePace(splitAvgPace);
	 	bufferErg.write2Bytes(splitAvgPower);
	 	bufferErg.write2Bytes(splitAvgCalories);
		// LastTimePlit
	 	bufferErg.writeTime(splitTime);
	 	bufferErg.writeDistance(splitDistance);

	return bufferErg.getBuffer();
}

// Stroke
function update35(data){
	console.log("update35");
	const bufferErg = new ManageBufferPM5(data);
	bufferErg.writeTime(time);
	bufferErg.writeDistance(distance);
 	console.log(driveTime);
 	console.log(strokeRecoveryTime);
	/*
	let stroke = {
		driveLength: 1.24,
		driveTime: driveTime,
		strokeRecoveryTime: strokeRecoveryTime,
		strokeRecoveryDistance: 9.86,
		peakDriveForce: 181.70000000000002,
		avgDriveForce: 102,
		strokePower: 241,
		strokeCalories: 1129,
		strokeCount: 39}
	*//*
	bufferErg.writeByte(stroke.driveLength/0.01);
	console.log("drivetime: ",stroke.driveTime/0.01);
	bufferErg.writeByte(2); // outof bounds
	bufferErg.write2Bytes(stroke.strokeRecoveryTime/0.01);
	bufferErg.write2Bytes(stroke.strokeRecoveryDistance/0.01);
	bufferErg.write2Bytes(stroke.peakDriveForce/0.1);
	bufferErg.write2Bytes(stroke.avgDriveForce/0.1);
	bufferErg.write2Bytes(69)
	*/
	bufferErg.writeByte(driveLength/0.01);
	console.log("drivetime: ",driveTime/0.01);
	bufferErg.writeByte(2); // outof bounds
	bufferErg.write2Bytes(strokeRecoveryTime/0.01);
	bufferErg.write2Bytes(strokeRecoveryDistance/0.01);
	bufferErg.write2Bytes(peakDriveForce/0.1);
	bufferErg.write2Bytes(avgDriveForce/0.1);
	bufferErg.write2Bytes(69)
	return bufferErg.getBuffer();
}
//Stroke
function update36(data){
	bufferErg = new ManageBufferPM5(data);
	/*stroke = {
		time:9.29,
		// strokePower:power,
		strokeCalories:69,
		strokeCount:70};
*/	
	bufferErg.writeTime(time);
	bufferErg.write2Bytes(strokePower);
	bufferErg.write2Bytes(strokeCalories);
	bufferErg.write2Bytes(strokeCount);
	
	return bufferErg.getBuffer();
}




// const characteristicPM5131 = characteristicPM5(update31,'0131');
// const characteristicPM5132 = characteristicPM5(update32,'0132');
// const characteristicPM531 = characteristicPM5(update31,'0031');
// const characteristicPM535 = characteristicPM5(update35,'0035',700);
// const characteristicPM532 = characteristicPM5(update32,'0032');
// const characteristicPM536 = characteristicPM5(update36,'0036');


module.exports = {
	// characteristicPM531:characteristicPM531,
	// characteristicPM5131:characteristicPM5131,
	// characteristicPM5132:characteristicPM5132,
	// characteristicPM532:characteristicPM532,
	// characteristicPM535:characteristicPM535,
	// characteristicPM536:characteristicPM536,
	characteristics:characteristics,
	characteristicPM5ErgCallback:characteristicPM5ErgCallback,
	// characteristicPM51ErgCallback:characteristicPM51ErgCallback,
	characteristicPM5StrokeCallback:characteristicPM5StrokeCallback
}


/*
// simulate something
function test31(){
  if(_updateValueCallback){
	console.log('characteristicPM531 - onWriteRequest: notifying');
	this._updateValueCallback([0x69,0x69]);
  }
  setTimeout(test31, 0.5*1000);
}*/



/*
characteristicPM531.prototype.onReadRequest = function(offset, callback) {
  console.log('characteristicPM531 - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

characteristicPM531.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('characteristicPM531 - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
	console.log('characteristicPM531 - onWriteRequest: notifying');

	this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};
*/
