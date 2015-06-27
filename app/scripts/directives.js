'use strict';

/* Directives */

angular.module('krissyosheaApp.directives', []).directive('responsive', function () {
    return {
        link: function(scope, element, attrs) {
            var dimension = window.screen.width > 320 ? 'url_o' : 'url_m';
            element[0].src = scope.photo[dimension];
        }
    };
});