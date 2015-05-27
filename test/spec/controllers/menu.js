'use strict';

describe('Controller: MenuCtrl', function () {

  var $rootScope, createController, location;

  beforeEach(module('krissyosheaApp'));

  beforeEach(inject(function($injector) {
     
     $rootScope = $injector.get('$rootScope');
     var $controller = $injector.get('$controller');
     location = {path: function() {return 'contact';}, search: function() {}};

     createController = function() {
       return $controller('MenuCtrl', {'$scope' : $rootScope,
        '$location': location,
        'portfolioService': {'portfoliosLoaded': 1, portfolioDetailsWithPortfolioId: function() {return portfolio;}}});
     };
   }));

  it('should have a portfolios property defined', function () {
    var controller = createController();
    expect($rootScope.portfolios).toBeDefined();
  });

  it('should set the portfolioMenuVisible property to false by default', function() {
    var controller = createController();
    expect($rootScope.portfolioMenuVisible).toBeDefined();
    expect($rootScope.portfolioMenuVisible).toBe(false);
  });

  it('should have an isActive function which is aware of where the user is in the navigation flow', function() {
    var controller = createController();
    expect($rootScope.isActive('contact')).toBe(true);
    expect($rootScope.isActive('portfolios')).toBe(false);
  });

  it('should navigate to portfolios when the user presses on one of the portfolio options', function() {
    spyOn(location, 'search');
    var controller = createController();
    $rootScope.portfolioMenuItemPressed({id: '123'});
    expect(location.search).toHaveBeenCalled();
  });

});