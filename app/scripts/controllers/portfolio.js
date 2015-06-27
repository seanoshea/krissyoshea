'use strict';

angular.module('krissyosheaApp')
  .controller('PortfolioCtrl', function($scope, $location, portfolioService) {
    $scope.loading = !portfolioService.portfoliosLoaded;
    $scope.loadFirstPortfolio = function() {
      $scope.portfolio = portfolioService.firstPortfolio();
    };
    $scope.loadPortfolio = function() {
      var portfolioId = $location.search().portfolioId, portfolio;
      if (portfolioId) {
        portfolio = portfolioService.portfolioDetailsWithPortfolioId(portfolioId);
        if (portfolio) {
          $scope.portfolio = portfolio;
        } else {
          $scope.loadFirstPortfolio();
        }
      } else {
        $scope.loadFirstPortfolio();
      }
    };
    $scope.$on(portfolioService.portfolioDetailsLoadedMessage, function() {
		  $scope.loading = 0;
      $scope.loadPortfolio();
    });
  	$scope.portfolioMenuVisible = false;
  	if (portfolioService.portfoliosLoaded) {
      $scope.loadPortfolio();
  	}
  });
