'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatappApp
 */
angular.module('chatappApp')
  .controller('loginCtrl', ['$scope','usersStorage','$window',function ($scope, usersStorage,$window) {
    var ctrl = this;
    ctrl.userName = "";
    ctrl.lastChatId = usersStorage.lastChatId;
    ctrl.currentUser = undefined;
    ctrl.signIn = function()
    {
      $window.alert(ctrl.userName);
      var users = usersStorage.get();
      var searchUser = users.find(function(u){
        return u.name == ctrl.userName;
      });
      if(searchUser == undefined)
      {
        var user  = {name:ctrl.userName, isOnline:true};
        usersStorage.insert(user);
        ctrl.currentUser = user;
        $window.alert("created new user");
        return;//create new user
      }
      if(searchUser.isOnline)
        {
          //error msg, already signed in
          $window.alert("already online");
          return;
        }
      searchUser.isOnline = true;
      ctrl.currentUser = searchUser;
      usersStorage.update(searchUser);
    };

    $window.onbeforeunload= function(){
      $window.alert("b2fl");
      console.log(ctrl.currentUser);
      if(ctrl.currentUser != undefined){
        console.log(ctrl.currentUser);
        ctrl.currentUser.isOnline = false;
        usersStorage.update(ctrl.currentUser);
      }
    };
  }]);
