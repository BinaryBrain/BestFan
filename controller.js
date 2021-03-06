'use strict';

var bestFanApp = angular.module('bestFanApp', []);

var username = getUsernameFromURL();
var secrets = "?client_id=893e4578ea3d2ae682a6&client_secret=2295a08d3545182af494410a7a516cc36090bc13";
var waitingRequests = 0; // Used to sync requests
var randomColors = [];

// Main Controller
bestFanApp.controller('mainController', function ($scope, $http) {
	$scope.fans = [];
	$scope.isUsernameDefined = !!username;

	var stargazers = [];
	var totalStars = 0;

	// Get the list of repos
	$http.get('https://api.github.com/users/' + username + '/repos' + secrets).then(function(response) {
		var data = response.data;
		var fanUrls = [];
		
		// Loop on every repo
		for (var repo of data) {
			if (repo.stargazers_count > 0) {
				fanUrls.push(repo.stargazers_url);

				waitingRequests++;

				// Get every stargazers
				$http.get(repo.stargazers_url + secrets).then(function(response) {
					// Loop on every stargazers of the given repo
					for (var user of response.data) {
						if (username !== user.login) {
							totalStars++;
							stargazers.push(user);
						}
					}

					waitingRequests--;
					
					if (waitingRequests == 0) {
						var fans = countFans(stargazers);
						$scope.fans = fans;
						$scope.totalStars = totalStars;
						randomColors = generateRandomColors(fans.length);
					};
				});
			}
		}
	}, function (response) {
		if (response.status === 404) {
			$scope.error = 'the user "' + username + '" doesn\'t exist.';
		} else {
			$scope.error = response.status + " - " + response.data.message;
		}
	});

	$scope.onKeypress = function (event) {
		if (event.keyCode !== 13) {
			return;
		}

		console.log($scope.username)

		document.location.href = '?' + $scope.username;
	}

	$scope.getColor = function (index) {
		return randomColors[index];
	}
});

function generateRandomColors(number) {
	return randomColor({ luminosity: 'light', count: number });
}

// Count how many times a fan is in the array
function countFans(stargazers) {
	var init = true;
	if (stargazers.length == 1) {
		stargazers[0].counter = 1;
		return stargazers;
	}
	
	var output = stargazers.reduce(function (prev, curr) {
		// Init
		if (init) {
			prev.counter = 1;
			prev = new Map([[prev.login, prev]]);
			init = false;
		}

		// Reduce
		if (prev.has(curr.login)) {
			prev.get(curr.login).counter++;
		} else {
			curr.counter = 1;
			prev.set(curr.login, curr);
		}

		return prev;
	});

	var fans = Array.from(output.values());
	return fans.sort(compareFans);
}

function compareFans(a, b) {
	if (a.counter > b.counter) {
		return -1;
	} else if (a.counter < b.counter) {
		return 1;
	} else {
		return 0;
	}
}

// Allow us to copy/paste the link for a given user
function getUsernameFromURL() {
	return document.location.href.split('?')[1];
}
