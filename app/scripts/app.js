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
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
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

//User class defining the User properties
var User = function(username,isOnline,id){
  this.username = username;
  this.id=id;
  this.isOnline=isOnline;
};

//Conversation class defining the conversation properties
var Conversation = function(convId,participants,isUnread,lastTimeStamp,name){
  this.convId = convId;
  this.participants=participants;
  this.isUnread = isUnread;
  this.lastTimeStamp = lastTimeStamp;
  this.name = name
};

//Message class defining the message properties
var Message = function(msgId,convId,sender,timeStamp,text)
{
  this.msgId = msgId;
  this.convId = convId;
  this.sender = sender;
  this.timeStamp = timeStamp;
  this.text = text;
};
