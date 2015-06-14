'use strict';

angular.module('krissyosheaApp')
  .controller('MainCtrl', function($scope, $location, portfolioService, $window) {
	$scope.loading = 1;
	$scope.randomizedPortfolioKey = 0;
	$scope.mainScreenImagePressed = function() {
        $location.search({'portfolioId': $scope.randomizedPortfolioKey.id});
		$location.path('/portfolio');
	};
	$scope.randomiseMainScreenImage = function() {
		var index = Math.floor(Math.random() * portfolioService.portfolios.length), url;
		angular.forEach(portfolioService.portfolios, function(portfolioValue, portfolioKey) {
			if (portfolioKey === index) {
				var portfolioDetails = portfolioService.portfolioDetailsWithPortfolioId(portfolioValue.id);
				if (portfolioDetails) {
					angular.forEach(portfolioDetails.photoset.photo, function(value, key) {
						if (parseInt(value.isprimary, 10) === 1) {
							url = value.url_o;
						}
					});
					// just in case a portfolio has been set up which does not have a primray photo
					if (!url) {
						url = portfolioDetails.photoset.photo[0];
					}
					$scope.randomizedPortfolioKey = portfolioValue;
					$window.localStorage.setItem('randomizedPortfolioKey', portfolioValue);
					$window.localStorage.setItem('randomizedPortfolioUrl', url);
				}
			}
		}, this);
		return url;
	};
	if (!portfolioService.portfoliosLoaded) {
		$scope.$on(portfolioService.portfolioDetailsLoadedMessage, function() {
			$scope.loading = 0;
			$scope.mainScreenImage = $scope.randomiseMainScreenImage();
		});
	} else {
		$scope.loading = 0;
		$scope.randomizedPortfolioKey = $window.localStorage.getItem('randomizedPortfolioKey');
		$scope.mainScreenImage = $window.localStorage.getItem('randomizedPortfolioUrl');
	}
  });
