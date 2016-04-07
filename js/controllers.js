app.controller('AppCtrl', function ($scope, Model, $location) {
    $scope.message = function(){
        return Model.getMessage();
    };
});

app.controller('homeScreenCtrl', function ($scope, Model, $location, $interval) {
    var timer;
    $scope.timeConstraints = Model.getTimeConstraints();

    $scope.startpageState = "default";

    $scope.timeleft = {
        minutes: 0,
        seconds: 0
    }

    $scope.timesUp = function(){
        if(($scope.timeleft.minutes < 1) && ($scope.timeleft.seconds < 1)){
            // console.log("Times up!");
            return true;
        } else {
            // console.log("Still got time to go!");
            return false;
        }
    }

    $scope.msecToMinSec = function(msec){
        return {
            minutes: Math.floor(msec/1000/60),
            seconds: Math.floor((msec/1000)%60),
        };
    }

    $scope.showWarning = function(){
        if($scope.timeleft.minutes < 0){
            if($scope.startpageState == "confirmBooking"){
                Model.cancelBooking();
            }
            return true;
        } else {
            return false;
        }
        // var showWarning = $scope.timeleft.minutes < 0 ? true : false;
        // return showWarning;
    }

    $scope.defaultTimer = function(min, sec){
        $scope.timeleft.minutes = min;
        $scope.timeleft.seconds = sec;
    }

    if( (Model.getBooking().unlockedAt != null) || (Model.getBooking().bookedAt != null) ){
        timer = $interval(function(){
            if(Model.getBooking().unlockedAt == null){
                var msecLeft = $scope.timeConstraints.reservationTime - (new Date() - Model.getBooking().bookedAt);
            } else {
                var msecLeft = $scope.timeConstraints.rentalTime - (new Date() - Model.getBooking().unlockedAt);
            }
            $scope.timeleft = $scope.msecToMinSec(msecLeft);
        }, 1000);
    } else {
        $interval.cancel(timer);
    };

    $scope.bookingConfirmed = function(){
        return Model.checkBookingConfirmation();   
    };

    $scope.booking = function(){
        return Model.getBooking();
    }

    $scope.confirmCancellation = function(){
        if (confirm("Are you sure you want to cancel your booking?") == true) {
            Model.cancelBooking();
        }
    }

    $scope.bikeUnlocked = function(){
        return Model.isBikeUnlocked();
    }

    $scope.showStartingpage = function(value){
        if(value == "default"){
            if(Model.checkBookingConfirmation() || Model.isBikeUnlocked()){
                return false;
            } else {
                $scope.startpageState = "default";
                return true;
            }
        } else if(value == "userHasBooking"){
            if(Model.checkBookingConfirmation()){
                if(Model.isBikeUnlocked()){
                    return false;
                } else {
                    $scope.startpageState = "confirmBooking";
                    return true;
                }
            }
        } else if(value == "ongoingRide"){
            if(Model.isBikeUnlocked()){
                $scope.startpageState = "ongoingRide";
                return true;
            }
        } else {
            console.error("No criteria fulfilled!");
        }
    }
});

app.controller('bookingCtrl', function ($scope, Model, $location) {
    // Cancel the booking if there is already one
    Model.cancelBooking();

    // Get all the locations
    $scope.locations = Model.allStations();

    // When the user clicks
    $scope.bookBike = function(location){
        var chosenLocation = location;
        var bestBike = {id: null, battery: 0};

        for (bike in location.availableBikes){
            if(location.availableBikes[bike].battery > bestBike.battery){
                bestBike = location.availableBikes[bike];
            }
        }

        Model.initializeBooking(location, bestBike);
        
        $location.path("/confirm");
    }
});

app.controller('confirmCtrl', function ($scope, Model, $location) {
    // If there is no booking to confirm
    // if(jQuery.isEmptyObject(Model.getBooking().location)){
    //     $location.path("/booking");   
    // };

    // Sets current time as bookedAt
    $scope.confirmBooking = function(){
        Model.confirmBooking();
    };

    // Get
    $scope.booking = function(){
        return Model.getBooking();
    };

});

app.controller('unlockCtrl', function ($scope, Model, $location) {
    $scope.unlockBike = function(){
        Model.unlockBike();
    }
});

app.controller('destinationCtrl', function ($scope, Model, $location) {
    $scope.destinations = Model.allStations();

    $scope.bookReturnAt = function(dest){
        console.log("Chose destination", dest);
        Model.setDestination(dest);
        $location.path("/navigation");
    }
});

app.controller('navigationCtrl', function ($scope, Model, $location) {
    $scope.destination = Model.getDestination();
    $scope.unsetDestination = function(){
        Model.unsetDestination();
    }
});

app.controller('returnCtrl', function ($scope, Model, $location) {
    $scope.retardedUser = true;

    $scope.userNotRetarded = function(){
        return !$scope.retardedUser;
    }
    $scope.userIsRetarded = function(val){
        $scope.retardedUser = val;
        console.log($scope.retardedUser);
    }

    $scope.returnBike = function(){
        Model.lockBike();
    }
});