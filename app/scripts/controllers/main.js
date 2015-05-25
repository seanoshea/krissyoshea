'use strict';

angular.module('krissyosheaApp')
  .controller('MainCtrl', function ($scope, $location, portfolioService) {
	$scope.loading = 0;
	$scope.randomizedPortfolioKey = 0;
	$scope.mainScreenImagePressed = function() {
        $location.search({'portfolioId': $scope.randomizedPortfolioKey.id});
		$location.path('/portfolio');
	};
	var randomiseMainScreenImage = function() {
		var index = Math.floor(Math.random() * portfolioService.portfolios.length - 1), url;
		angular.forEach(portfolioService.portfolios, function(value, key) {
			if (key === index) {
				var portfolioDetails = portfolioService.portfolioDetailsWithPortfolioId(value.id);
				if (portfolioDetails) {
					angular.forEach(portfolioDetails.photoset.photo, function(value, key) {
						if (parseInt(value.isprimary, 10) === 1) {
							url = value.url_o;
						}
					});
					$scope.randomizedPortfolioKey = value;
				}
			}
		}, this);
		return url;
	};
	$scope.$on(portfolioService.portfolioDetailsLoadedMessage, function() {
		$scope.loading = 0;
		$scope.mainScreenImage = randomiseMainScreenImage();
	});
  });
