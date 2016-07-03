app.factory('Model', function () {
	var bikes = [];
	var userPosition = null;
	var initialUserPosition = {
		latitude: 1.298734,
		longitude: 103.772262
	}
	// var initialUserPosition = {latitude: 1.3052181999999999, longitude: 103.77421199999999};
	var chargePerHourOverdue = 3;
	var returnDestination = null;
	var userPosition = initialUserPosition;

	var timeConstraints = {
		reservationTime: 0.2*60*1000,
		rentalTime: 0.2*60*1000
		// reservationTime: 15*60*1000,
		// rentalTime: 60*60*1000
	};

	// Generate random bikes
	for(var i = 0; i<200; i++){
		var bike = {
			id: i,
			battery: Math.round(Math.random()*100)
		}
		bikes.push(bike);
	};

	var bikeStations = [
		{
			id: 0,
			name: "UTown",
			numSlots: 40,
			availableBikes: bikes.slice(0,20),
			coordinates: {
				latitude: 1.303511, 
				longitude: 103.774223
			},
			distance: 0
		},
		{
			id: 1,
			name: "PGP",
			numSlots: 30,
			availableBikes: bikes.slice(20,40),
			coordinates: {
				latitude: 1.290807, 
				longitude: 103.780311
			},
			distance: 0
		},
		{
			id: 2,
			name: "COM",
			numSlots: 40,
			availableBikes: bikes.slice(40,60),
			coordinates: {
				latitude: 1.294437, 
				longitude: 103.773766
			},
			distance: 0
		},
		{
			id: 3,
			name: "Yusuf Ishak House",
			numSlots: 30,
			availableBikes: bikes.slice(60,85),
			coordinates: {
				latitude: 1.298991, 
				longitude: 103.774710
			},
			distance: 0
		},
		{
			id: 4,
			name: "BIZ",
			numSlots: 30,
			availableBikes: bikes.slice(85,100),
			coordinates: {
				latitude: 1.292377, 
				longitude: 103.774001
			},
			distance: 0
		},
		{
			id: 5,
			name: "Central Library",
			numSlots: 50,
			availableBikes: bikes.slice(100,115),
			coordinates: {
				latitude: 1.296847, 
				longitude: 103.772880
			},
			distance: 0
		}
	];

	console.log("Generated", bikes.length, "bikes and", bikeStations.length, "bike stations");

	
	var resetBooking = function(){
		var booking = {
			location: {},
			bike: {},
			bikeSlot: null,
			bookedAt: null,
			unlockedAt: null
		}
		return booking;
	};

	this.updateDistanceInfo = function(id, distance){
		for(i in bikeStations){
			if(bikeStations[i].id == id){
				bikeStations[i].distance = distance;
				// console.log("Updated distance for station ", bikeStations[i].name, " to ", distance);
			}
		}
	}

	this.getChargeRates = function(){
		return chargePerHourOverdue;
	};

	this.setUserPosition = function(pos){
		userPosition = pos;
	}

	this.getUserPosition = function(){
		return userPosition;
	}

	this.setDestination = function(dest){
		returnDestination = dest;
	};

	this.unsetDestination = function(){
		returnDestination = null;
	};

	this.getDestination = function(){
		return returnDestination;
	};

	this.getTimeConstraints = function(){
		return timeConstraints;
	};

	this.getBooking = function(){
		return booking;
	};

	this.initializeBooking = function(loc, bike){
		// console.log("Initializing booking for location ", loc, "and bike ", bike);
		booking.location = loc;
		booking.bike = bike;
		booking.bikeSlot = Math.ceil(Math.random() * loc.numSlots);
	};

	this.confirmBooking = function(){
		booking.bookedAt = new Date();
		// console.log("Confirming booking ", booking);
	};

	this.cancelBooking = function(){
		// console.log("Booking ", booking, " cancelled");
		booking = resetBooking();
	};

	this.lockBike = function(){
		booking = resetBooking();
	};

	this.unlockBike = function(){
		booking.unlockedAt = new Date();
	};

	this.isBikeUnlocked = function(){
		if(booking.unlockedAt != null){
			return true;
		} else {
			return false;
		}
	};

	this.checkBookingConfirmation = function(){
		if(booking.bookedAt != null){
			return true;
		} else {
			return false;
		}
	};

	this.allStations = function(){
		return bikeStations;
	};

	var booking = resetBooking();
	return this;
});