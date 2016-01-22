'use strict';

let bestFanApp = angular.module('bestFanApp', []);
let username = getUsernameFromURL() || 'BinaryBrain';

let secrets = "?client_id=893e4578ea3d2ae682a6&client_secret=2295a08d3545182af494410a7a516cc36090bc13";

let waitingRequests = 0;

bestFanApp.controller('mainController', function ($scope, $http) {
	$scope.fans = [];
	let stargazers = []

	$http.get(`https://api.github.com/users/${username}/repos` + secrets).then(response => {
		let data = response.data;
		let fanUrls = [];
		for (let repo of data) {
			if (repo.stargazers_count > 0) {
				fanUrls.push(repo.stargazers_url);

				waitingRequests++;
				$http.get(repo.stargazers_url + secrets).then(response => {
					for (let user of response.data) {
						stargazers.push(user);
					}

					waitingRequests--;
					
					if (waitingRequests == 0) {
						let fans = countFans(stargazers);
						$scope.fans = fans;
					};
				});
			}
		}
	});
});

function countFans(stargazers) {
	let init = true;
	if (stargazers.length == 1) {
		stargazers[0].counter = 1;
		return stargazers;
	}
	
	let output = stargazers.reduce((prev, curr) => {
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

	let fans = Array.from(output.values());
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

function getUsernameFromURL() {
	return document.location.href.split('?')[1];
}
