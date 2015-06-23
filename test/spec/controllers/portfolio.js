'use strict';

describe('Controller: PortfolioCtrl', function () {

  var $rootScope, createController, portfolio;

  beforeEach(module('krissyosheaApp'));

  beforeEach(inject(function($injector) {
     
     $rootScope = $injector.get('$rootScope');
     portfolio = {};
     var $controller = $injector.get('$controller');

     createController = function() {
       return $controller('PortfolioCtrl', {'$scope' : $rootScope, 'portfolioService': {'portfoliosLoaded': 1, firstPortfolio: function() {return portfolio;}, portfolioDetailsWithPortfolioId: function() {return portfolio;}} });
     };
   }));

  it('should set the loading property of the portfolio controller to be the opposite of the portfolioServices portfoliosLoaded property', function () {
    var controller = createController();
    expect($rootScope.loading).toBeDefined();
    expect($rootScope.loading).toBe(false);
  });

  it('should set the portfolio property on the controller to be equal to the return value of portfolioDetailsWithPortfolioId', function () {
    var controller = createController();
    expect($rootScope.portfolio).toBeDefined();
    expect($rootScope.portfolio).toEqual(portfolio);
  });
  
});