var app = angular.module('prototype', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'partials/homeScreen.html',
			controller: 'homeScreenCtrl',
			activeTab: 'home'
		}).
		when('/booking', {
			templateUrl: 'partials/booking.html',
			controller: 'bookingCtrl',
			activeTab: 'booking'
		}).
		when('/unlock', {
			templateUrl: 'partials/unlock.html',
			controller: 'unlockCtrl',
			activeTab: 'unlock'
		}).
		when('/chooseDestination',{
			templateUrl: 'partials/destinations.html',
			controller: 'destinationCtrl',
			activeTab: 'choose destination'
		}).
		when('/navigation',{
			templateUrl: 'partials/navigation.html',
			controller: 'navigationCtrl',
			activeTab: 'navigation'
		}).
		otherwise({
			redirectTo: "/"
		})
	}
])
// .
// run(function($rootScope, $location, $cookies){
// 		console.log("Route change!");
// 	});
// });