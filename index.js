'use strict';
let queue = [];
let parkLot = [];

function start(cars, spaces, time) {
	queue = carFactory(cars);
	parkLot = lotFactory(spaces);
	clock(time);
}

//
function carFactory(num) {
	let cars = [];
	for (let i = 0; i < num; i++) {
		cars.push(new Vehicle());
	}
	return cars;
}
function Vehicle() {
	this.color = colorFactory();
	this.make = makeFactory();
	this.plate = plateFactory();
	this.timer = timerFactory();
	this.tickClock = function() {
		return --this.timer;
	};
}
function colorFactory() {
	let color = '';
	for (let i = 0; i < 6; i++) {
		color += Math.floor(Math.random() * 10);
	}
	return color;
}
function makeFactory() {
	let make = '';
	let possible = [ 'Honda', 'Jeep', 'Chevrolet', 'Ford', 'Toyota', 'BMW', 'Tesla', 'Volkswagen', 'Kia', 'Fiat' ];

	make = possible[Math.floor(Math.random() * 10)];
	return make;
}
function colorFactoy() {}
function plateFactory() {
	let plate = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789';
	for (var i = 0; i < 7; i++) {
		plate += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return plate;
}

//
function timerFactory() {
	return Math.ceil(Math.random() * 50);
}
function updateLot() {
	for (let i in parkLot) {
		if (parkLot[i] == 'OPEN' && queue.length > 0) {
			parkLot[i] = queue.shift();
		} else if (parkLot[i].timer < 0) {
			parkLot[i] = 'OPEN';
		}
	}
}
function lotFactory(spaces) {
	let lot = [];
	for (let i = 0; i < spaces; i++) {
		lot.push('OPEN');
	}
	return lot;
}
//Clock
function clock(millis) {
	let event = new CustomEvent('tick');
	let proxy = document.getElementById('proxy');
	setInterval(function() {
		proxy.dispatchEvent(event);
	}, millis);
}
function tickDown() {
	for (let i in parkLot) {
		if (parkLot[i] != 'OPEN') {
			parkLot[i].tickClock();
		}
	}
	updateLot();
}
//UI
function updateUI() {
	//Parking Lot
	document.getElementById('parkingLot').innerHTML = '';
	for (let i in parkLot) {
		if (parkLot[i] != 'OPEN') {
			document.getElementById('parkingLot').innerHTML += `<div class='space'>
			<h2>${parkLot[i].make}</h2>
			<h3>Plate #${parkLot[i].plate}</h3>
			<h2 style="background-color:#${parkLot[i].color};"> </h2>
			<h4>Time:${parkLot[i].timer / 10}</h4>
			</div>`;
		} else {
			document.getElementById('parkingLot').innerHTML += `<div class='space open'></div>`;
		}
	}
	//Queue
	let queueUI = '';
	if (queue.length > 5) {
		queueUI = `${queue.length - 5} ...<br>`;
	} else {
		queueUI = `<br>`;
	}
	for (let i = 11; i >= 0; i--) {
		if (queue[i] != undefined) {
			queueUI += `<div style="text-align: center; border:solid 5px #${queue[i].color};">${queue[i].make}</div>`;
		}
	}
	document.getElementById('queue').innerHTML = queueUI;
}

proxy.addEventListener('tick', updateUI);
proxy.addEventListener('tick', tickDown);
