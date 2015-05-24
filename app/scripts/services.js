'use strict';

/* Services */

angular.module('krissyosheaApp.services', []).factory('portfolioService', function ($rootScope, $http) {
    return {
    	portfolioLoadedMessage: 'portfolioLoadedMessage',
    	portfolioLoadedFailedMessage: 'portfolioLoadedFailedMessage',
        portfolios: {},
        get: function() {
            var self = this;
			$http.jsonp('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK').success(function(data) {
				self.portfolios = data.photosets.photoset;
				$rootScope.$broadcast(self.portfolioLoadedMessage);
	    	}).error(function() {
	    	  $rootScope.$broadcast(self.portfolioLoadedFailedMessage);
    		});
        }
    };
});