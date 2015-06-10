/* globals angular, console */
  angular.module('dynamic-sports')
    .controller('HomeCtrl', ['$scope', 'geoLocationService', function ($scope, geoLocationService) {
      'use strict';
      $scope.recording = function (on) {
	    if (on) {
	      geoLocationService.start();
	    } else {
	      geoLocationService.stop();
	    }
	  };
    }]);