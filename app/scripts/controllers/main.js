'use strict';

angular.module('krissyosheaApp')
  .controller('MainCtrl', function($scope, $location, portfolioService, $window) {
	$scope.loading = 1;
	$scope.randomizedPortfolioKey = 0;
	$scope.mainScreenImagePressed = function() {
        $location.search({'portfolioId': $scope.randomizedPortfolioKey.id});
		$location.path('/portfolio');
	};
	$scope.getRandomizedPortfolioPhoto = function() {
		var index = Math.floor(Math.random() * portfolioService.portfolios.length), photo;
		angular.forEach(portfolioService.portfolios, function(portfolioValue, portfolioKey) {
			if (portfolioKey === index) {
				var portfolioDetails = portfolioService.portfolioDetailsWithPortfolioId(portfolioValue.id);
				if (portfolioDetails) {
					angular.forEach(portfolioDetails.photoset.photo, function(value, key) {
						if (parseInt(value.isprimary, 10) === 1) {
							photo = value;
						}
					});
					// just in case a portfolio has been set up which does not have a primray photo
					if (!photo) {
						photo = portfolioDetails.photoset.photo[0];
					}
					$scope.randomizedPortfolioKey = portfolioValue;
					$window.localStorage.setItem('randomizedPortfolioKey', portfolioValue);
					$window.localStorage.setItem('randomizedPortfolioPhoto', photo);
				}
			}
		}, this);
		return photo;
	};
	if (!portfolioService.portfoliosLoaded) {
		$scope.$on(portfolioService.portfolioDetailsLoadedMessage, function() {
			$scope.loading = 0;
			$scope.responsivePhoto = $scope.getRandomizedPortfolioPhoto();
		});
	} else {
		$scope.loading = 0;
		$scope.randomizedPortfolioKey = $window.localStorage.getItem('randomizedPortfolioKey');
		$scope.responsivePhoto = $window.localStorage.getItem('randomizedPortfolioPhoto');
	}
  });
