var util = require('util');
let PM5Util = require('./PM5Util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

let time = 0;
let distance = 0;
let pace = 387.8277952417603;
let spm = 22;
// strokeData
let strokeRecoveryTime = 0;
let driveTime = 0;

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
		console.log('characteristicPM53x - onSubscribe');
		_updateValueCallback = updateValueCallback;
	};

	characteristicPM53x.prototype.onUnsubscribe = function() {
		console.log('characteristicPM53x - onUnsubscribe');
		_updateValueCallback = null;
	};
	characteristicPM53x.update=function(data) {
		// update();
		if(_updateValueCallback){
			console.log("update "+uuid);
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

function characteristicPM5ErgCallback(data){
	console.log("HelloErg ",data);
	distance = Number(data.distance);
	time = Number(data.time);
	spm = Number(data.spm);
	pace = Number(data.pace);
	characteristicPM531.update();//{time:data.time,distance:data.distance});
	characteristicPM532.update();
	// characteristicPM535.update();
	// characteristicPM536.update();
}

function characteristicPM5StrokeCallback(data){
	console.log("HelloStroke ",data);
	strokeRecoveryTime = Number(data.strokeRecoveryTime);
	driveTime = Number(data.driveTime);
	// characteristicPM531.update();
	// characteristicPM532.update();
	characteristicPM535.update();
	characteristicPM536.update();
}
function update31(bufferData){
	const mBuffer = new ManageBufferPM5(bufferData);
	// console.log("update31 ",data.time,data.distance)
	// mBuffer.writeTime(Number(data.time));
	// mBuffer.writeDistance(Number(data.distance));


	mBuffer.writeTime(time);  // 
	mBuffer.writeDistance(distance);
	mBuffer.writeUnimportantFlags(5);
	mBuffer.writeDistance(11.2); // total work disntace
	mBuffer.writeTime(9.29); // workout duration
	mBuffer.writeByte(0);    // workut 
	mBuffer.writeByte(12);  // drag factor
	return mBuffer.getBuffer();
}

function update32(data){
	bufferErg = new ManageBufferPM5(data) ;
		bufferErg.writeTime(time);  // elapsed time 
		bufferErg.write2Bytes(40/0.001); // speed
		bufferErg.writeByte(spm); // SPM
		bufferErg.writeByte(110); // HRM
		bufferErg.writePace(pace); // Current Pace
		bufferErg.writePace(120); // Average pace
		bufferErg.write2Bytes(1); // rest distance
		bufferErg.writeTime(20);  // rest time
	
	return bufferErg.getBuffer();
}

// Stroke
function update35(data){
	const bufferErg = new ManageBufferPM5(data);
	bufferErg.writeTime(time);
	bufferErg.writeDistance(distance);
 
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
	bufferErg.writeByte(stroke.driveLength/0.01);
	bufferErg.writeByte(stroke.driveTime/0.01);
	bufferErg.write2Bytes(stroke.strokeRecoveryTime/0.01);
	bufferErg.write2Bytes(stroke.strokeRecoveryDistance/0.01);
	bufferErg.write2Bytes(stroke.peakDriveForce/0.1);
	bufferErg.write2Bytes(stroke.avgDriveForce/0.1);
	bufferErg.write2Bytes(69)
	return bufferErg.getBuffer();
}
//Stroke
function update36(data){
	bufferErg = new ManageBufferPM5(data);
	stroke = {
		time:9.29,
		strokePower:260,
		strokeCalories:69,
		strokeCount:70};

	bufferErg.writeTime(stroke.time);
	bufferErg.write2Bytes(stroke.strokePower);
	bufferErg.write2Bytes(stroke.strokeCalories);
	bufferErg.write2Bytes(stroke.strokeCount);
	
	return bufferErg.getBuffer();
}





const characteristicPM531 = characteristicPM5(update31,'0031');
const characteristicPM535 = characteristicPM5(update35,'0035',700);
const characteristicPM532 = characteristicPM5(update32,'0032');
const characteristicPM536 = characteristicPM5(update36,'0036');


module.exports = {
	characteristicPM531:characteristicPM531,
	characteristicPM532:characteristicPM532,
	characteristicPM535:characteristicPM535,
	characteristicPM536:characteristicPM536,
	characteristicPM5ErgCallback:characteristicPM5ErgCallback,
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
