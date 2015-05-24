'use strict';

describe('krissyosheaApp.services', function() {

  var portfolioService;	
  // load modules
  beforeEach(module('krissyosheaApp.services'));
  beforeEach(function() {
  	inject(function($injector) {
    	portfolioService = $injector.get('portfolioService');
  	});
  });

  it('should have a property for telling interested parties that the portfolios have loaded', function () {
  	expect(portfolioService.portfolioLoadedMessage).toBeDefined();
  });

  it('should have a property for telling interested parties that the portfolios have failed to load', function () {
  	expect(portfolioService.portfolioLoadedFailedMessage).toBeDefined();
  });

  it('should have a property for storing the collection of portfolios', function () {
  	expect(portfolioService.portfolios).toBeDefined();
  });

});