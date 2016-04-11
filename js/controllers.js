app.controller('AppCtrl', function ($scope, Model, $location, $window) {
    $scope.mapsInitialized = false;
    $scope.positionUpdated = false;

    $window.googleMapsInitialized = function(){
        console.log("Google Maps initialized!");
        $scope.mapsInitialized = true;
        $scope.updateDistances(Model.getUserPosition());
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            $scope.positionUpdated = true;
            $scope.$apply(function(){
                Model.setUserPosition(position.coords);
            });
        });
    };

    $scope.$watch(function(){
        return Model.getUserPosition();
    },
    function(newVal){
        if($scope.mapsInitialized){
            $scope.updateDistances(newVal);  
        };
    });

    $scope.updateDistances = function(newPosition){
        var directionsService = new google.maps.DirectionsService();
        var stations = Model.allStations();
        var currentPosition = new google.maps.LatLng(newPosition.latitude, newPosition.longitude);

        for(i in stations){
            var start = currentPosition;
            var end = new google.maps.LatLng(stations[i].coordinates.latitude, stations[i].coordinates.longitude);

            findNewDistance(start, end, stations[i]["id"], directionsService);
        }
    }

    var findNewDistance = function(start, end, id, directionsService){
        // console.log(start, end, id, directionsService);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        };

        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                Model.updateDistanceInfo(id, result.routes[0].legs[0].distance.value);
                $scope.$apply();
            } else {
                console.log("Failed to get route somewhere ",status);
            }
        });

    };
});

app.controller('homeScreenCtrl', function ($scope, Model, $location) {
});

app.controller('bookingCtrl', function ($scope, Model, $location) {
    // Cancel the booking if there is already one
    Model.cancelBooking();
    $scope.userPositionMarker;

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
    };

    $scope.initializeMap = function(){
        var pos = Model.getUserPosition();
        var currentPosition = new google.maps.LatLng(pos.latitude, pos.longitude);
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: currentPosition,
            zoom: 16
        });

        $scope.userPositionMarker = new google.maps.Marker({
            position: currentPosition,
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            title: "User location"
        });

        for(var location in $scope.locations){
            var numAvailableBikes = $scope.locations[location].availableBikes.length;

            var image = {
              url: "img/bicons/bike-icon-"+numAvailableBikes+".png",
              scaledSize: new google.maps.Size(50, 50)
            };

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.locations[location].coordinates.latitude, $scope.locations[location].coordinates.longitude),
                map: $scope.map,
                icon: image,
                animation: google.maps.Animation.DROP,
                title: $scope.locations[location].name,
                location: $scope.locations[location]
            });

            marker.addListener('click', function() {
                var location = this["location"];
                $scope.$apply(function(){
                    $scope.bookBike(location);
                });
            });
        }
    };

    $scope.$watch(
        function(){
            return Model.getUserPosition() 
        }, 
        function(newVal){
            var newLocation = new google.maps.LatLng(newVal.latitude, newVal.longitude)
            $scope.map.panTo(newLocation);
            $scope.userPositionMarker.setPosition(newLocation);
        });

    $scope.initializeMap();
});

app.controller('activeBookingCtrl', function ($scope, Model, $location, $interval) {
    var timer;
    $scope.timeConstraints = Model.getTimeConstraints();

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
            Model.cancelBooking();
            return true;
        } else {
            return false;
        }
    }

    timer = $interval(function(){
        var msecLeft = $scope.timeConstraints.reservationTime - (new Date() - Model.getBooking().bookedAt);
        $scope.timeleft = $scope.msecToMinSec(msecLeft);
    }, 1000);
    

    $scope.booking = function(){
        return Model.getBooking();
    }

    $scope.confirmCancellation = function(){
        if (confirm("Are you sure you want to cancel your booking?") == true) {
            Model.cancelBooking();
            $location.path("/");
        }
    };

    var currentPosition = new google.maps.LatLng(Model.getUserPosition().latitude, Model.getUserPosition().longitude);
    var bookingLocation = new google.maps.LatLng($scope.booking().location.coordinates.latitude, $scope.booking().location.coordinates.longitude);
        
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPosition,
        zoom: 16
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var request = {
        origin: currentPosition,
        destination: bookingLocation,
        travelMode: google.maps.TravelMode.WALKING
    };

    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
});

app.controller('rideCtrl', function ($scope, Model, $location, $interval) {
   var timer;
    $scope.timeConstraints = Model.getTimeConstraints();

    $scope.startpageState = "default";

    $scope.timeleft = {
        minutes: 0,
        seconds: 0
    };

    $scope.timesUp = function(){
        if(($scope.timeleft.minutes < 1) && ($scope.timeleft.seconds < 1)){
            // console.log("Times up!");
            return true;
        } else {
            // console.log("Still got time to go!");
            return false;
        }
    };

    $scope.msecToMinSec = function(msec){
        return {
            minutes: Math.floor(msec/1000/60),
            seconds: Math.floor((msec/1000)%60),
        };
    };

    $scope.showWarning = function(){
        if($scope.timeleft.minutes < 0){
            if($scope.startpageState == "confirmBooking"){
                Model.cancelBooking();
            }
            return true;
        } else {
            return false;
        }
    };

    timer = $interval(function(){
        var msecLeft = $scope.timeConstraints.rentalTime - (new Date() - Model.getBooking().unlockedAt);
        $scope.timeleft = $scope.msecToMinSec(msecLeft);
    }, 1000);
    
    $scope.bookingConfirmed = function(){
        return Model.checkBookingConfirmation();   
    };

    $scope.booking = function(){
        return Model.getBooking();
    };
});

app.controller('confirmCtrl', function ($scope, Model, $location) {

    // Sets current time as bookedAt
    $scope.confirmBooking = function(){
        Model.confirmBooking();
    };

    // Get booking
    $scope.booking = function(){
        return Model.getBooking();
    };

});

app.controller('unlockCtrl', function ($scope, Model, $location) {

    $scope.stationNumber = Model.getBooking().bikeSlot;
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
    };

    // #################

    $scope.userPositionMarker;

    $scope.initializeMap = function(){
        var pos = Model.getUserPosition();
        var currentPosition = new google.maps.LatLng(pos.latitude, pos.longitude);
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: currentPosition,
            zoom: 16
        });

        $scope.userPositionMarker = new google.maps.Marker({
            position: currentPosition,
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            title: "User location"
        });

        for(var destination in $scope.destinations){
            var numAvailableSlots = $scope.destinations[destination].numSlots - $scope.destinations[destination].availableBikes.length;

            var image = {
              url: "img/bicons/bike-icon-"+numAvailableSlots+".png",
              scaledSize: new google.maps.Size(50, 50)
            };

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.destinations[destination].coordinates.latitude, $scope.destinations[destination].coordinates.longitude),
                map: $scope.map,
                icon: image,
                animation: google.maps.Animation.DROP,
                title: $scope.destinations[destination].name,
                location: $scope.destinations[destination]
            });

            marker.addListener('click', function() {
                var location = this["location"];
                $scope.$apply(function(){
                    $scope.bookReturnAt(location);
                });
            });
        }
    };

    $scope.$watch(
        function(){
            return Model.getUserPosition() 
        }, 
        function(newVal){
            var newLocation = new google.maps.LatLng(newVal.latitude, newVal.longitude)
            $scope.map.panTo(newLocation);
            $scope.userPositionMarker.setPosition(newLocation);
        });

    $scope.initializeMap();
});

app.controller('navigationCtrl', function ($scope, Model, $location) {
    $scope.destination = Model.getDestination();

    $scope.unsetDestination = function(){
        Model.unsetDestination();
    };

    var currentPosition = new google.maps.LatLng(Model.getUserPosition().latitude, Model.getUserPosition().longitude);
    var dropoffDestination = new google.maps.LatLng($scope.destination.coordinates.latitude, $scope.destination.coordinates.longitude);
        
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPosition,
        zoom: 16
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var request = {
        origin: currentPosition,
        destination: dropoffDestination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            // console.log(result);
        } else {
            console.log(result, status);
        }
    });

});

app.controller('returnCtrl', function ($scope, Model, $location) {
    $scope.retardedUser = true;

    $scope.userNotRetarded = function(){
        return !$scope.retardedUser;
    }
    $scope.userIsRetarded = function(val){
        $scope.retardedUser = val;
    }
});

app.controller('successCtrl', function ($scope, Model, $location) {
    var chargePerHourOverdue = Model.getChargeRates();
    var msecLeft = Model.getTimeConstraints().rentalTime - (new Date() - Model.getBooking().unlockedAt);
    
    if(msecLeft >= 0){
        $scope.rideCost = 0;
    } else {
        var penaltyCharge = Math.abs(msecLeft)/1000/60/60 * chargePerHourOverdue;
        $scope.rideCost = Math.round(penaltyCharge*100)/100;
    }

    Model.lockBike();
});




