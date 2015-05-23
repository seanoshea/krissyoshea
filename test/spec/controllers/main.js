'use strict';

describe('Controller: MainCtrl', function () {

  var $httpBackend, $rootScope, createController, flickrRequestHandler;

  beforeEach(module('krissyosheaApp'));

  beforeEach(inject(function($injector) {
     $httpBackend = $injector.get('$httpBackend');
     flickrRequestHandler = $httpBackend.when('JSONP', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK').respond({
        data: {'photosets': {'photoset': []}}
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
    $httpBackend.expectJSONP('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK');
     var controller = createController();
     $httpBackend.flush();
  });

});
