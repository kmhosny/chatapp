'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatappApp
 */
angular.module('chatappApp')
  .controller('loginCtrl', ['$scope','usersStorage','$window','loggedInUser','$location','backend',function ($scope, usersStorage,$window,loggedInUser,$location,backend) {
    var ctrl = this;
    ctrl.userName = "";
    ctrl.currentUser = loggedInUser.get();
    ctrl.signIn = function()
    {
      if(ctrl.userName=="") {
        angular.element("#alert").show();
        return;
      }
      if(ctrl.currentUser!=null && ctrl.currentUser.isOnline){
        backend.unload();
      }
      var users = usersStorage.get();
      var searchUser = users.find(function(u){
        return u.username == ctrl.userName;
      });
      if(searchUser == undefined)
      {
        ctrl.currentUser=usersStorage.insert(ctrl.userName,true);
        loggedInUser.set(ctrl.currentUser);
        console.log("created new user");
        angular.element("#newUserCreated").show();
        backend.load();
        setTimeout(2000,$location.path("/main"));

        return;//create new user
      }
      if(searchUser.isOnline)
        {
          //error msg, already signed in
          console.log("already online");
          //return;
        }
      searchUser.isOnline = true;
      ctrl.currentUser = searchUser;
      usersStorage.update(searchUser);
      loggedInUser.set(ctrl.currentUser);
      console.log("successfully signed in");
      backend.load();
      $location.path("/main");
    };
  }]);
