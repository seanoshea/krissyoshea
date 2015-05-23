'use strict';

angular.module('krissyosheaApp')
  .controller('MainCtrl', function ($scope, $http) {
  	$scope.portfolios = 0;
	$scope.loading = 0;
	$scope.errorMessage = 0;
	var loadPortfolios = function() {
		$scope.loading = 1;
		$http.jsonp('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK')
			.success(function(data) {
  				$scope.portfolios = data.photosets.photoset;
				$scope.loading = 0;
	    }).error(function() {
    	  $scope.errorMessage = 'There was an error when loading the portfolios';
    	});
	};
	loadPortfolios();
  });
