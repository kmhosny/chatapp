'use strict';

/**
 * @ngdoc overview
 * @name chatappApp
 * @description
 * # chatappApp
 *
 * Main module of the application.
 */
angular
  .module('chatappApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
