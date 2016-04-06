app.factory('Model', function () {
	var bookingConfirmed = false;
	var bikeUnlocked = false;

	this.confirmBooking = function(){
		bookingConfirmed = true;
	}

	this.cancelBooking = function(){
		bookingConfirmed = false;
	}

	this.isBikeUnlocked = function(){
		return bikeUnlocked;
	}

	this.lockBike = function(){
		bikeUnlocked = false;
	}

	this.unlockBike = function(){
		bookingConfirmed = false;
		bikeUnlocked = true;
	}

	this.checkBookingConfirmation = function(){
		return bookingConfirmed;
	}

	return this;
});