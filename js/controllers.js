app.controller('AppCtrl', function ($scope, Model, $location) {
    $scope.message = function(){
        return Model.getMessage();
    }
});

app.controller('homeScreenCtrl', function ($scope, Model, $location) {
    $scope.bookingConfirmed = function(){
        console.log(Model.checkBookingConfirmation());
        return Model.checkBookingConfirmation();   
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
                return true;
            }
        } else if(value == "userHasBooking"){
            if(Model.checkBookingConfirmation()){
                if(Model.isBikeUnlocked()){
                    return false;
                } else {
                    return true;
                }
            }
        } else if(value == "ongoingRide"){
            if(Model.isBikeUnlocked()){
                return true;
            }
        } else {
            console.log("No criteria fulfilled!");
        }
    }
});

app.controller('bookingCtrl', function ($scope, Model, $location) {
    $scope.bookBike = function(id){
        console.log("Booked bike", id);
        $location.path("/confirm")
    }
});

app.controller('confirmCtrl', function ($scope, Model, $location) {
    $scope.place = "UTown";
    $scope.confirmBooking = function(){
        Model.confirmBooking();
    }
});

app.controller('unlockCtrl', function ($scope, Model, $location) {
    $scope.unlockBike = function(){
        Model.unlockBike();
    }
});

app.controller('destinationCtrl', function ($scope, Model, $location) {
    $scope.bookReturnAt = function(id){
        console.log("Chose destination", id);
        $location.path("/navigation");
    }
});

app.controller('navigationCtrl', function ($scope, Model, $location) {

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