'use strict';

describe('Controller: MainCtrl', function () {

  var $httpBackend, $rootScope, createController, flickrPortfoliosRequestHandler, flickrDetailsRequestHandlerOne, flickrDetailsRequestHandlerTwo, flickrDetailsRequestHandlerThree, flickrDetailsRequestHandlerFour,
  expectedUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK',
  expectedPortfolioDetailsUrlOne = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=72157632368742743&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK',
  expectedPortfolioDetailsUrlTwo = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=72157632372714598&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK',
  expectedPortfolioDetailsUrlThree = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=72157632372725922&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK',
  expectedPortfolioDetailsUrlFour = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=72157647095408473&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK';

  beforeEach(module('krissyosheaApp'));

  beforeEach(inject(function($injector) {
     $httpBackend = $injector.get('$httpBackend');
     flickrPortfoliosRequestHandler = $httpBackend.when('JSONP', expectedUrl).respond({
        'photosets': {'photoset': [{'id':'72157632368742743','primary':'10381351283','secret':'71bf022d78','server':'7339','farm':8,'photos':'33','videos':0,'title':{'_content':'Tabletop & Still Life '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'5','count_comments':'0','can_comment':0,'date_create':'1356763330','date_update':'1428941037'},{'id':'72157632372714598','primary':'15828817816','secret':'23d1b470ee','server':'7503','farm':8,'photos':'33','videos':0,'title':{'_content':'Props & Food'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'2','count_comments':'0','can_comment':0,'date_create':'1356763244','date_update':'1428939421'},{'id':'72157647095408473','primary':'15667752320','secret':'5d9de509bd','server':'8669','farm':9,'photos':'14','videos':0,'title':{'_content':'Events'},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'0','count_comments':'0','can_comment':0,'date_create':'1416702306','date_update':'1416733779'},{'id':'72157632372725922','primary':'11056754986','secret':'1a07b4e1b3','server':'2808','farm':3,'photos':'21','videos':0,'title':{'_content':'Flowers '},'description':{'_content':''},'needs_interstitial':0,'visibility_can_see_set':1,'count_views':'1','count_comments':'0','can_comment':0,'date_create':'1356763400','date_update':'1427448846'}]}
     });
     flickrDetailsRequestHandlerOne = $httpBackend.when('JSONP', expectedPortfolioDetailsUrlOne).respond({
        'photoset': {'id': '123'}
     });
     flickrDetailsRequestHandlerTwo = $httpBackend.when('JSONP', expectedPortfolioDetailsUrlTwo).respond({
        'photoset': {'id': '124'}
     });
     flickrDetailsRequestHandlerThree = $httpBackend.when('JSONP', expectedPortfolioDetailsUrlThree).respond({
        'photoset': {'id': '125'}
     });
     flickrDetailsRequestHandlerFour = $httpBackend.when('JSONP', expectedPortfolioDetailsUrlFour).respond({
        'photoset': {'id': '126'}
     });
     
     $rootScope = $injector.get('$rootScope');
     var $controller = $injector.get('$controller');

     createController = function() {
       return $controller('MainCtrl', {'$scope' : $rootScope });
     };
   }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  it('should make a request to Flickr to retrieve the portfolios', function () {
    $httpBackend.expectJSONP(expectedUrl);
    var controller = createController();
    $httpBackend.flush();
  });

  it('should set the loading property to false once the API call to Flickr to retrieve the portfolios has succeeded', function () {
    $httpBackend.expectJSONP(expectedUrl);
    var controller = createController();
    $httpBackend.flush();
     expect($rootScope.loading).toBe(0);
  });
  
});
