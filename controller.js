'use strict';

let bestFanApp = angular.module('bestFanApp', []);
let username = "BinaryBrain";
let waitingRequests = 0;

bestFanApp.controller('mainController', function ($scope, $http) {
	$scope.fans = [];
	let stargazers = []

	$http.get(`https://api.github.com/users/${username}/repos`).then(response => {
		let data = response.data;
		let fanUrls = [];
		for (let repo of data) {
			if (repo.stargazers_count > 0) {
				fanUrls.push(repo.stargazers_url);

				waitingRequests++;
				$http.get(repo.stargazers_url).then(response => {
					for (let user of response.data) {
						stargazers.push(user);
					}

					waitingRequests--;
					
					if (waitingRequests == 0) {
						let init = true;
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

						console.info(fans);
						$scope.fans = fans;
					};
				});
			}
		}
	});
});
