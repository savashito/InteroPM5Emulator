let bleno = require('bleno');
let characteristicsPM5 = require('./characteristicPM531');
var socket = require('./socketController')(characteristicsPM5);
let PM5Util = require('./PM5Util');

PM5Util.setSocketController(socket);

var BlenoPrimaryService = bleno.PrimaryService;

// var uuidErgService = PM5Util.toLongUUID("0030")//'18902a9a-1f4a-44fe-936f-14c8eea41800';// '6969';

console.log('PM5 bleno - simulation');

bleno.on('stateChange', function(state) {
	console.log('on -> stateChange: ' + state);

	if (state === 'poweredOn') {
		bleno.startAdvertising('PM5', ['ec00']);
	} else {
		bleno.stopAdvertising();
	}
});

bleno.on('advertisingStart', function(error) {
	console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

	if (!error) {
		bleno.setServices([
			new BlenoPrimaryService({
				uuid: PM5Util.toLongUUID("0030"),
				characteristics: [
					new characteristicsPM5.characteristicPM531(),
					new characteristicsPM5.characteristicPM532(),
					new characteristicsPM5.characteristicPM535(),
					new characteristicsPM5.characteristicPM536(),
				]
			})
		]);
	}
});
      