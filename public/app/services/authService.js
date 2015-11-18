angular.module('authService', [])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================

// ===================================================
.factory('AuthToken',['$window', function($window) {

	var authTokenFactory = {};

	// get the token
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
		if (token) {
			$window.localStorage.setItem('token', token);
		} else {
			$window.localStorage.removeItem('token');
		}
	};

	// set the token or clear the token

	return authTokenFactory;

}])

.factory('Auth',['$http','$q','AuthToken', function($http, $q, AuthToken) {

	// create auth factory object
	var authFactory = {};

	// log a user in
	authFactory.login = function(username, password) {
		// return the promise object and its data
		return $http.post('/api/authenticate', {
					username: username,
					password: password
				})
				.success(function(data) {
					AuthToken.setToken(data.token);
					return data;
				});
	};

	// log a user out by clearing the token
	authFactory.logout = function() {
		// clear the token
		AuthToken.setToken();
	};

	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

	// get the logged in user
	authFactory.getUser = function() {
		if (AuthToken.getToken())
			return $http.get('/api/me',{ cache: true });
		else
			return $q.reject({ message: 'User has no token.' });
	};

	return authFactory;

}])

// ===================================================
// application configuration to integrate token into requests
// ===================================================

.factory('AuthInterceptor',['$q','$location','AuthToken', function($q, $location, AuthToken) {

	var interceptorFactory = {};

	// attach the token to every request
	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {

		// grab the token
		var token = AuthToken.getToken();

		// if the token exists, add it to the header as x-access-token
		if (token)
			config.headers['x-access-token'] = token;

		return config;
	};

	// redirect if a token doesn't authenticate
	// happens on response errors
	interceptorFactory.responseError = function(response) {

		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			$location.path('/login');
		}

		// return the errors from the server as a promise
		return $q.reject(response);
	}

	return interceptorFactory;

}]);

