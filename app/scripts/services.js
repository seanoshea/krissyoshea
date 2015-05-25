'use strict';

/* Services */

angular.module('krissyosheaApp.services', []).factory('portfolioService', function ($rootScope, $http) {
    return {
    	portfolioListLoadedMessage: 'portfolioListLoadedMessage',
        portfolioDetailsLoadedMessage: 'portfolioDetailsLoadedMessage',
        portfolios: {},
        portfolioDetails: [],
        getPortfolios: function() {
            var self = this;
			$http.jsonp('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK').success(function(data) {
				self.portfolios = data.photosets.photoset;
                self.getPortfolioDetails(self.portfolios);
				$rootScope.$broadcast(self.portfolioLoadedMessage);
	    	}).error(function() {
	    	  
    		});
        },
        getPortfolioDetails: function(portfolios) {
            angular.forEach(portfolios, function(value, key) {
                this.getPortfolio(value.id);
            }, this);
        },
        getPortfolio: function(portfolioId) {
            var self = this;
            $http.jsonp('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_sq,url_s,url_m,url_o&photoset_id=' + portfolioId + '&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSON_CALLBACK').success(function(data) {
                self.addPortfolioDetails(data)
            }).error(function() {

            });
        },
        addPortfolioDetails: function(data) {
            this.portfolioDetails.push(data);
            if (this.portfolioDetails.length == this.portfolios.length) {
                $rootScope.$broadcast(this.portfolioDetailsLoadedMessage);
            }
        },
        portfolioDetailsWithPortfolioId: function(id) {
            var portfolioDetails;
            angular.forEach(this.portfolioDetails, function(value, key) {
                if (value.photoset.id === id) {
                    portfolioDetails = value;
                }
            }, this);
            return portfolioDetails;
        }
    };
});