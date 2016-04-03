'use strict';

angular.module('krissyosheaApp')
  .controller('MainCtrl', function($scope, $location) {
	$scope.mainScreenImagePressed = function() {
		console.warn(arguments[0])
        $location.search({'portfolioId': arguments[0]});
		$location.path('/portfolio');
	};
	$scope.portfolio = {};
	$scope.portfolio.photoset = {};
	$scope.portfolio.photoset.photo = [{'portfolioId': '72157632368742743', 'id':'19726518409','secret':'d455ee3de5','server':'503','farm':1,'title':'stilllife5.krissyosheaphotography.2015','isprimary':'1','ispublic':1,'isfriend':0,'isfamily':0,'url_m':'https:\/\/farm1.staticflickr.com\/503\/19726518409_d455ee3de5.jpg','height_m':'500','width_m':'334','url_o':'https:\/\/farm1.staticflickr.com\/503\/19726518409_d30d379b7a_o.jpg','height_o':'670','width_o':'447'},
		{'portfolioId': '72157632372714598', 'id':'15828817816','secret':'23d1b470ee','server':'7503','farm':8,'title':'brod','isprimary':'1','ispublic':1,'isfriend':0,'isfamily':0,'url_m':'https:\/\/farm8.staticflickr.com\/7503\/15828817816_23d1b470ee.jpg','height_m':'500','width_m':'396','url_o':'https:\/\/farm8.staticflickr.com\/7503\/15828817816_c106b12bbe_o.jpg','height_o':'670','width_o':'531'},
		{'portfolioId': '72157647095408473', 'id':'19289871374','secret':'fb86efd0c2','server':'302','farm':1,'title':'KinfolkInPraiseofSlowness.krissyosheaphotography.2015-9','isprimary':'0','ispublic':1,'isfriend':0,'isfamily':0,'url_m':'https:\/\/farm1.staticflickr.com\/302\/19289871374_fb86efd0c2.jpg','height_m':'301','width_m':'500','url_o':'https:\/\/farm1.staticflickr.com\/302\/19289871374_51287239d1_o.jpg','height_o':'404','width_o':'670'},
		{'portfolioId': '72157632372725922', 'id':'11056754986','secret':'1a07b4e1b3','server':'2808','farm':3,'title':'DSC_3696','isprimary':'1','ispublic':1,'isfriend':0,'isfamily':0,'url_m':'https:\/\/farm3.staticflickr.com\/2808\/11056754986_1a07b4e1b3.jpg','height_m':'500','width_m':'381','url_o':'https:\/\/farm3.staticflickr.com\/2808\/11056754986_177eca2156_o.jpg','height_o':'670','width_o':'511'}];
  });
