'use strict';

angular.module('krissyosheaApp')
  .controller('MainCtrl', function ($scope, portfolioService) {
	$scope.loading = 0;
	portfolioService.get();
	$scope.$on('portfolioLoadedMessage',function(){
		$scope.loading = 0;
	});
  });
