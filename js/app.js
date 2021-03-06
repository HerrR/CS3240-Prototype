var app = angular.module('prototype', ['ngRoute', 'ngCookies']);
// , 'uiGmapgoogle-maps'
// 'ngAnimate',

app.config(['$routeProvider',
	function ($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'partials/homeScreen.html',
            controller: 'homeScreenCtrl',
            redirectURL: '/',
            requirements: null,
            status_message: "Hello!"
        }).
        when('/booking', {
            templateUrl: 'partials/booking.html',
            controller: 'bookingCtrl',
            redirectURL: '/',
            requirements: null,
            status_message: "Where do you want to pick up your bike?"
        }).
        when('/confirm', {
            templateUrl: 'partials/confirm.html',
            controller: 'confirmCtrl',
            redirectURL: '/booking',
            requirements: ["activeBooking"],
            status_message: "Are you sure?"
        }).
        when('/unlock', {
            templateUrl: 'partials/unlock.html',
            controller: 'unlockCtrl',
            redirectURL: '/myBooking',
            requirements: ["activeBooking"],
            status_message: "Unlock your bike"
        }).
        when('/destinations', {
            templateUrl: 'partials/destinations.html',
            controller: 'destinationCtrl',
            redirectURL: '/',
            requirements: ["activeBooking", "unlockedBike"],
            status_message: "Where do you want to go?"
        }).
        when('/navigation', {
            templateUrl: 'partials/navigation.html',
            controller: 'navigationCtrl',
            redirectURL: '/',
            requirements: ["activeBooking", "unlockedBike", "activeDestination"],
            status_message: "Navigation"
        }).
        when('/return', {
            templateUrl: 'partials/return.html',
            controller: 'returnCtrl',
            redirectURL: '/',
            requirements: ["activeBooking", "unlockedBike"],
            status_message: "Return bike"
        }).
        when('/success', {
            templateUrl: 'partials/success.html',
            controller: 'successCtrl',
            redirectURL: '/',
            requirements: ["activeBooking", "unlockedBike"],
            status_message: "Bike is returned!"
        }).
        when('/myRide', {
            templateUrl: 'partials/ride.html',
            controller: 'rideCtrl',
            redirectURL: '/',
            requirements: ["unlockedBike"],
            status_message: "Ride Overview"
        }).
        when('/myBooking', {
            templateUrl: 'partials/activeBooking.html',
            controller: 'activeBookingCtrl',
            redirectURL: '/',
            requirements: ["activeBooking"],
            status_message: "Go unlock your bike!"
        }).
        otherwise({
            redirectTo: "/"
        })
	}
])

.run(function ($rootScope, $location, Model) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var routeRequirements = next.$$route.requirements;
        var hasActiveBooking = !jQuery.isEmptyObject(Model.getBooking().location);
        var hasActiveRide = !(Model.getBooking().unlockedAt == null);
        var hasActiveDestination = !(Model.getDestination() == null);

        if (next.$$route.originalPath == "/") {
            if (hasActiveBooking && hasActiveRide) {
                $location.path("/myRide");
            } else if (hasActiveBooking && !hasActiveRide) {
                $location.path("/myBooking");
            }
        };

        if (routeRequirements != null) {
            for (requirement in routeRequirements) {
                if (routeRequirements[requirement] == "activeBooking") {
                    if (!hasActiveBooking) {
                        $location.path(next.$$route.redirectURL);
                    }
                } else if (routeRequirements[requirement] == "unlockedBike") {
                    if (!hasActiveRide) {
                        $location.path(next.$$route.redirectURL);
                    }
                } else if (routeRequirements[requirement] == "activeDestination") {
                    if (!hasActiveDestination) {
                        $location.path(next.$$route.redirectURL);
                    }
                }
            }
        }
    });
});