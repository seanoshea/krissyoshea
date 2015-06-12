'use strict';

angular.module('krissyosheaApp')
  .controller('MenuCtrl', function($scope, $location, portfolioService) {
  	$scope.portfolios = [];
  	$scope.portfolioMenuVisible = false;
	$scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
	$scope.portfolioMenuPressed = function() {
		$scope.portfolioMenuVisible = !$scope.portfolioMenuVisible;
	};
	$scope.portfolioMenuItemPressed = function(portfolio) {
        $location.search({'portfolioId': portfolio.id});
		$location.path('/portfolio');
		$scope.portfolioMenuPressed();
	};
	$scope.$on(portfolioService.portfolioDetailsLoadedMessage, function() {
		$scope.portfolios = portfolioService.portfolios;
	});
	$scope.$on('$locationChangeStart', function(event, next, current) {
		if ($scope.portfolioMenuVisible && next.indexOf('portfolio') === -1) {
			$scope.portfolioMenuPressed();
		}
	});
  });
