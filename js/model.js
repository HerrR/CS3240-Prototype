app.factory('Model', function () {
	var bikes = [];

	// Time constraints for reservation and rental in milliseconds
	var timeConstraints = {
		reservationTime: 15*60*1000,
		rentalTime: 60*60*1000
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
			availableBikes: bikes.slice(0,21)
		},
		{
			id: 1,
			name: "PGP",
			numSlots: 30,
			availableBikes: bikes.slice(21,40)
		},
		{
			id: 2,
			name: "COM",
			numSlots: 40,
			availableBikes: bikes.slice(40,60)
		},
		{
			id: 3,
			name: "Yusuf Ishak House",
			numSlots: 30,
			availableBikes: bikes.slice(60,85)
		},
		{
			id: 4,
			name: "BIZ",
			numSlots: 30,
			availableBikes: bikes.slice(85,100)
		},
		{
			id: 5,
			name: "Central Library",
			numSlots: 50,
			availableBikes: bikes.slice(100,115)
		}
	];

	var returnDestination = null;

	// console.log("Generated", bikes.length, "bikes and", bikeStations.length, "bike stations");
	
	var resetBooking = function(){
		var booking = {
			location: {},
			bike: {},
			bookedAt: null,
			unlockedAt: null
		}
		return booking;
	};

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

	this.getStation = function(id){
		return bikeStations[id];
	};

	var booking = resetBooking();
	return this;
});