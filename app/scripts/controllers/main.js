'use strict';

/**
 * @ngdoc function
 * @name krissyosheaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the krissyosheaApp
 */
angular.module('krissyosheaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
  });
