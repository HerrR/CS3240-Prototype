var app = angular.module('prototype', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'partials/homeScreen.html',
			controller: 'homeScreenCtrl',
			redirectURL: '/',
			requirements: null
		}).
		when('/booking', {
			templateUrl: 'partials/booking.html',
			controller: 'bookingCtrl',
			redirectURL: '/',
			requirements: null
		}).
		when('/confirm',{
			templateUrl: 'partials/confirm.html',
			controller: 'confirmCtrl',
			redirectURL: '/booking',
			requirements: ["activeBooking"]
		}).
		when('/unlock', {
			templateUrl: 'partials/unlock.html',
			controller: 'unlockCtrl',
			redirectURL: '/',
			requirements: ["activeBooking"]
		}).
		when('/destinations',{
			templateUrl: 'partials/destinations.html',
			controller: 'destinationCtrl',
			redirectURL: '/',
			requirements: ["activeBooking", "unlockedBike"]
		}).
		when('/navigation',{
			templateUrl: 'partials/navigation.html',
			controller: 'navigationCtrl',
			redirectURL: '/',
			requirements: ["activeBooking", "unlockedBike", "activeDestination"]
		}).
		when('/return',{
			templateUrl: 'partials/return.html',
			controller: 'returnCtrl',
			redirectURL: '/',
			requirements: ["activeBooking", "unlockedBike"]
		}).
		when('/success',{
			templateUrl: 'partials/success.html',
			controller: 'successCtrl',
			redirectURL: '/',
			requirements: null
		}).
		otherwise({
			redirectTo: "/"
		})
	}
])
// Comment this out to cancel navigation checks, might be useful for styling etc.
.run(function($rootScope, $location, $cookies, Model){
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		var routeRequirements = next.$$route.requirements;
		console.log(routeRequirements);
		
		if(routeRequirements != null){
			for(requirement in routeRequirements){
				if(routeRequirements[requirement] == "activeBooking"){
					if(jQuery.isEmptyObject(Model.getBooking().location)){
						$location.path(next.$$route.redirectURL);
					}
				} else if(routeRequirements[requirement] == "unlockedBike"){
					if(Model.getBooking().unlockedAt == null){
						$location.path(next.$$route.redirectURL);
					}
				} else if(routeRequirements[requirement] == "activeDestination"){
					if(Model.getDestination() == null){
						$location.path(next.$$route.redirectURL);
					}
				}
			}
		}
    });
});