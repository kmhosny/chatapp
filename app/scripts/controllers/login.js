'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatappApp
 */
angular.module('chatappApp')
  .controller('loginCtrl', ['$scope','usersStorage','$window','loggedInUser','$location',function ($scope, usersStorage,$window,loggedInUser,$location) {
    var ctrl = this;
    ctrl.userName = "";
    ctrl.currentUser = null;
    ctrl.signIn = function()
    {
      var users = usersStorage.get();
      var searchUser = users.find(function(u){
        return u.username == ctrl.userName;
      });
      if(searchUser == undefined)
      {
        ctrl.currentUser=usersStorage.insert(ctrl.userName,true);
        console.log("created new user");
        loggedInUser.set(ctrl.currentUser);
        $location.path("/main");
        return;//create new user
      }
      if(searchUser.isOnline)
        {
          //error msg, already signed in
          console.log("already online");
          return;
        }
      searchUser.isOnline = true;
      ctrl.currentUser = searchUser;
      usersStorage.update(searchUser);
      loggedInUser.set(ctrl.currentUser);
      console.log("successfully signed in");
      $location.path("/main");
    };
  }]);
