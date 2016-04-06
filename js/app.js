var app = angular.module('prototype', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'partials/homeScreen.html',
			controller: 'homeScreenCtrl',
			activeTab: 'home'
		}).
		otherwise({
			redirectTo: "/"
		})

		// when('/login', {
		// 	templateUrl: 'partials/login.html',
		// 	controller: 'LoginCtrl',
		// 	activeTab: 'login'
		// }).
		// when('/register', {
		// 	templateUrl: 'partials/register.html',
		// 	controller: 'LoginCtrl',
		// 	activeTab: 'register'
		// }).
		// when('/viewStats', {
		// 	templateUrl: 'partials/topic.html',
		// 	controller: 'topicCtrl',
		// 	activeTab: 'topic'
		// }).
		// otherwise({
		// 	redirectTo: '/'
		// })
	}
]);