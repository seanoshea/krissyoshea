'use strict';

describe('krissyosheaApp.services', function() {

  var portfolioService, rs;
  // load modules
  beforeEach(module('krissyosheaApp.services'));
  beforeEach(function() {
  	inject(function($injector) {
    	portfolioService = $injector.get('portfolioService');
      rs = $injector.get('$rootScope');
  	});
  });

  it('should have a property for telling interested parties that the portfolios have loaded', function () {
  	expect(portfolioService.portfolioListLoadedMessage).toBeDefined();
  });

  it('should have a property for telling interested parties that the portfolio details have loaded', function () {
    expect(portfolioService.portfolioDetailsLoadedMessage).toBeDefined();
  });

  it('should have a property for storing the collection of portfolios', function () {
  	expect(portfolioService.portfolios).toBeDefined();
  });

  it('should have a property for storing the collection of portfolio details', function () {
    expect(portfolioService.portfolioDetails).toBeDefined();
  });

  it('should broadcast a message when all the portfolio details have been retrieved', function () {

    spyOn(rs, '$broadcast');
    portfolioService.portfolios = [{'id':'72157632368742743','primary':'10381351283','secret':'71bf022d78','server':'7339','farm':8,'photos':'33','videos':0,'title':{'_content':'Tabletop & Still Life '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'5','count_comments':'0','can_comment':0,'date_create':'1356763330','date_update':'1428941037'},{'id':'72157632372714598','primary':'15828817816','secret':'23d1b470ee','server':'7503','farm':8,'photos':'33','videos':0,'title':{'_content':'Props & Food'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'2','count_comments':'0','can_comment':0,'date_create':'1356763244','date_update':'1428939421'},{'id':'72157647095408473','primary':'15667752320','secret':'5d9de509bd','server':'8669','farm':9,'photos':'14','videos':0,'title':{'_content':'Events'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'0','count_comments':'0','can_comment':0,'date_create':'1416702306','date_update':'1416733779'},{'id':'72157632372725922','primary':'11056754986','secret':'1a07b4e1b3','server':'2808','farm':3,'photos':'21','videos':0,'title':{'_content':'Flowers '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'1','count_comments':'0','can_comment':0,'date_create':'1356763400','date_update':'1427448846'}];
    portfolioService.portfolioDetails.push({photoset:{}});
    portfolioService.portfolioDetails.push({photoset:{}});
    portfolioService.portfolioDetails.push({photoset:{}});

    portfolioService.addPortfolioDetails({photoset:{}});
    
    expect(rs.$broadcast).toHaveBeenCalled();
  });

  it('should not broadcast a message to indicate that all portfolio details have been retrieved until ALL of them have been retrieved', function () {

    spyOn(rs, '$broadcast');
    portfolioService.portfolios = [{'id':'72157632368742743','primary':'10381351283','secret':'71bf022d78','server':'7339','farm':8,'photos':'33','videos':0,'title':{'_content':'Tabletop & Still Life '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'5','count_comments':'0','can_comment':0,'date_create':'1356763330','date_update':'1428941037'},{'id':'72157632372714598','primary':'15828817816','secret':'23d1b470ee','server':'7503','farm':8,'photos':'33','videos':0,'title':{'_content':'Props & Food'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'2','count_comments':'0','can_comment':0,'date_create':'1356763244','date_update':'1428939421'},{'id':'72157647095408473','primary':'15667752320','secret':'5d9de509bd','server':'8669','farm':9,'photos':'14','videos':0,'title':{'_content':'Events'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'0','count_comments':'0','can_comment':0,'date_create':'1416702306','date_update':'1416733779'},{'id':'72157632372725922','primary':'11056754986','secret':'1a07b4e1b3','server':'2808','farm':3,'photos':'21','videos':0,'title':{'_content':'Flowers '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'1','count_comments':'0','can_comment':0,'date_create':'1356763400','date_update':'1427448846'}];
    portfolioService.portfolioDetails.push({photoset:{}});
    portfolioService.portfolioDetails.push({photoset:{}});

    portfolioService.addPortfolioDetails({photoset:{}});
    
    expect(rs.$broadcast).not.toHaveBeenCalled();
  });

  it('should return a portfolio details object if portfolioDetailsWithPortfolioId is invoked with an id which is present', function () {

    portfolioService.portfolios = [{'id':'72157632368742743','primary':'10381351283','secret':'71bf022d78','server':'7339','farm':8,'photos':'33','videos':0,'title':{'_content':'Tabletop & Still Life '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'5','count_comments':'0','can_comment':0,'date_create':'1356763330','date_update':'1428941037'},{'id':'72157632372714598','primary':'15828817816','secret':'23d1b470ee','server':'7503','farm':8,'photos':'33','videos':0,'title':{'_content':'Props & Food'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'2','count_comments':'0','can_comment':0,'date_create':'1356763244','date_update':'1428939421'},{'id':'72157647095408473','primary':'15667752320','secret':'5d9de509bd','server':'8669','farm':9,'photos':'14','videos':0,'title':{'_content':'Events'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'0','count_comments':'0','can_comment':0,'date_create':'1416702306','date_update':'1416733779'},{'id':'72157632372725922','primary':'11056754986','secret':'1a07b4e1b3','server':'2808','farm':3,'photos':'21','videos':0,'title':{'_content':'Flowers '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'1','count_comments':'0','can_comment':0,'date_create':'1356763400','date_update':'1427448846'}];
    portfolioService.portfolioDetails.push({photoset:{id:'72157632368742743'}});

    expect(portfolioService.portfolioDetailsWithPortfolioId('72157632368742743')).toBeDefined();
  });

  it('should not return a portfolio details object if portfolioDetailsWithPortfolioId is invoked with an id which is not present', function () {

    portfolioService.portfolios = [{'id':'72157632368742743','primary':'10381351283','secret':'71bf022d78','server':'7339','farm':8,'photos':'33','videos':0,'title':{'_content':'Tabletop & Still Life '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'5','count_comments':'0','can_comment':0,'date_create':'1356763330','date_update':'1428941037'},{'id':'72157632372714598','primary':'15828817816','secret':'23d1b470ee','server':'7503','farm':8,'photos':'33','videos':0,'title':{'_content':'Props & Food'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'2','count_comments':'0','can_comment':0,'date_create':'1356763244','date_update':'1428939421'},{'id':'72157647095408473','primary':'15667752320','secret':'5d9de509bd','server':'8669','farm':9,'photos':'14','videos':0,'title':{'_content':'Events'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'0','count_comments':'0','can_comment':0,'date_create':'1416702306','date_update':'1416733779'},{'id':'72157632372725922','primary':'11056754986','secret':'1a07b4e1b3','server':'2808','farm':3,'photos':'21','videos':0,'title':{'_content':'Flowers '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'1','count_comments':'0','can_comment':0,'date_create':'1356763400','date_update':'1427448846'}];
    portfolioService.portfolioDetails.push({photoset:{id:'1'}});

    expect(portfolioService.portfolioDetailsWithPortfolioId('72157632368742743')).not.toBeDefined();
  });

});