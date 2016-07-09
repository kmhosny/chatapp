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
  })

  .directive('contenteditable', ['$sce', function($sce) {
    return {
   restrict: 'A', // only activate on element attribute
   require: '?ngModel', // get a hold of NgModelController
   link: function(scope, element, attrs, ngModel) {
     if (!ngModel) return; // do nothing if no ng-model

     // Specify how UI should be updated
     ngModel.$render = function() {
       element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
       read(); // initialize
     };

     // Listen for change events to enable binding
     element.on('blur keyup change', function() {
       scope.$evalAsync(read);
     });


     // Write data to the model
     function read() {
       var html = element.html();
       // When we clear the content editable the browser leaves a <br> behind
       // If strip-br attribute is provided then we strip this out
       if ( attrs.stripBr && html == '<br>' ) {
         html = '';
       }
       html=html.replace("<br>","");
       ngModel.$setViewValue(html);
     }
   }
 };
  }]);

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
