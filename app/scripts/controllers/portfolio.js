'use strict';

angular.module('krissyosheaApp')
  .controller('PortfolioCtrl', function ($scope, $location, portfolioService) {
  	var portfolioId = $location.search().portfolioId;
  	var portfolio = portfolioService.portfolioDetailsWithPortfolioId(portfolioId);
  	$scope.portfolio = portfolio;
  });