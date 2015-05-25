'use strict';

angular.module('krissyosheaApp')
  .controller('PortfolioCtrl', function ($scope, $location, portfolioService) {
  	$scope.loading = !portfolioService.portfoliosLoaded;
	$scope.$on(portfolioService.portfolioDetailsLoadedMessage, function() {
		$scope.loading = 0;
	});
  	$scope.portfolioMenuVisible = false;
  	if (portfolioService.portfoliosLoaded) {
  		var portfolioId = $location.search().portfolioId;
  		var portfolio = portfolioService.portfolioDetailsWithPortfolioId(portfolioId);
  		if (portfolio) {
  			$scope.portfolio = portfolio;
  		} else {
  			// TODO
  		}
  	} else {
  		// TODO
  	}
  });