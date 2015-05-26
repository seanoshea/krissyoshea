'use strict';

describe('Controller: PortfolioCtrl', function () {

  var $rootScope, createController;

  beforeEach(module('krissyosheaApp'));

  beforeEach(inject(function($injector) {
     
     $rootScope = $injector.get('$rootScope');
     var $controller = $injector.get('$controller');

     createController = function() {
       return $controller('PortfolioCtrl', {'$scope' : $rootScope, 'portfolioService': {'portfoliosLoaded': 0} });
     };
   }));

  it('should set the loading property of the portfolio controller to be the opposite of the portfolioServices portfoliosLoaded property', function () {
    var controller = createController();
    expect($rootScope.loading).toBeDefined();
    expect($rootScope.loading).toBe(true);
  });
  
});