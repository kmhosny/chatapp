'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:MainCtrl
 * @description this is the main controller handling the chatting and message exchange
 * # MainCtrl
 * Controller of the chatappApp
 */
angular.module('chatappApp')
  .controller('MainCtrl', ['$rootScope','$scope','conversationsStorage','$window','loggedInUser','messagessStorage','usersStorage',
  function ($rootScope,$scope, conversationsStorage,$window,loggedInUser,messagessStorage,usersStorage) {

    var ctrl = this;
    ctrl.currentUser = loggedInUser.get();
    ctrl.conversations = conversationsStorage.get();
    ctrl.messages = messagessStorage.get();
    ctrl.filteredMsgs = [];
    ctrl.currentConv = null;
//when the current user is the one who clicks on new chat, its either a new conversation or new message
    ctrl.addNewChat = function(user,message)
    {
      var tempDate = new Date();
      var toUser  = usersStorage.get().find(function(u){
          return u.username == user;
      });
      if(toUser != undefined){
        var conv = ctrl.conversations.find(function(c)
        {
          var arr1 = c.participants.sort();
          var arr2 = [ctrl.currentUser.id,toUser.id].sort();
          return angular.equals(arr1,arr2);

        });
        if(conv==undefined){
            conv = conversationsStorage.insert([ctrl.currentUser.id,toUser.id],[false,true],tempDate,toUser.username);
            ctrl.currentConv = conv;
            ctrl.filteredMsgs = [];
        }

        for(var i=0; i<conv.isUnread.length; i++)
        {
          if(ctrl.currentUser.id == conv.participants[i])
            conv.isUnread[i]=false;
          else
              conv.isUnread[i]=true;
        }
        conv.lastTimeStamp=tempDate;
        var tempMsg = messagessStorage.insert(conv.convId,ctrl.currentUser.id,tempDate,message);
        ctrl.filteredMsgs.push(tempMsg);
        conversationsStorage.update(conv);
        console.log("message sent");
      }
      else {
        console.log("user not found");
      }
    };

//perform a watch over the storage data if it changes then the displayed messages should change
  angular.element($window).on("storage",function(event)
    {
      if(ctrl.currentUser!=null){
        if(event.originalEvent.key=='lastMID')
        {
          ctrl.conversations = conversationsStorage.get();
          ctrl.messages = messagessStorage.get();
          console.log(ctrl.currentUser);
          if(ctrl.currentConv!=null){//filteredd message for chat area needs to be updated after sending new message
            var msgs  = ctrl.messages.filter(function(c){
              return ctrl.currentConv.convId == c.convId;
            });
          }
          ctrl.filteredMsgs = msgs;
          $rootScope.$apply();
        }
      }
    });

//retrieve the last message in the conversation between 2 persons to display below the conversation name
    ctrl.getLastMessage = function(convId)
    {
      var maxDate = new Date(0);
      var lastMsg =null;
      for(var i=0; i<ctrl.messages.length; i++){
        var tempDate = new Date(ctrl.messages[i].timeStamp);
          if((ctrl.messages[i].convId == convId) && (tempDate>maxDate)){
            maxDate = tempDate;
            lastMsg  = ctrl.messages[i].text;
          }
      }
      return lastMsg;
    };

//function returning boolean value to check if the last message was read by the current user or not
    ctrl.isUnread = function(convId)
    {
      if(ctrl.currentUser==undefined)
        return true;
      var isUnread = null;
      var index = ctrl.conversations.findIndex(function(u){
              return  u.convId == convId;
      });
      var i = ctrl.conversations[index].participants.findIndex(function(u){
              return  u == ctrl.currentUser.id;
      });
      isUnread = ctrl.conversations[index].isUnread[i];
      return isUnread;
    };

//detect conversations that doesn't belong to current user to hide it
    ctrl.isNotParticipantConversation = function(convId)
    {
      if(ctrl.currentUser==undefined)
        return true;
      var isParticipant = false;
      var index = ctrl.conversations.findIndex(function(u){
              return  u.convId == convId;
      });
      var i = ctrl.conversations[index].participants.findIndex(function(u){
              return  u == ctrl.currentUser.id;
      });
      if(i!=-1)
        isParticipant=true;
      return !isParticipant;
    };

//detect messages that doesn't belong to current user to hide it
    ctrl.isNotParticipantMessage = function($index)
    {
      if(ctrl.currentUser==undefined)
        return true;
      var isParticipant = false;
      var conv = ctrl.currentConv;
      var i = conv.participants.findIndex(function(u){
              return  u == ctrl.currentUser.id;
      });
      if(i!=-1)
        isParticipant=true;
      return !isParticipant;
    };

//register a click event on the conversations in conversation tab and keep track of current conversation
    $scope.convClicked = function($event)
    {
      var conv  = ctrl.conversations.find(function(c){
        return $event.currentTarget.id == c.convId;
      });

      var msgs  = ctrl.messages.filter(function(c){
        return $event.currentTarget.id == c.convId;
      });
      ctrl.filteredMsgs = msgs;
      for(var i=0; i<conv.isUnread.length; i++)
      {
        if(ctrl.currentUser.id == conv.participants[i])
          conv.isUnread[i]=false;
      }
      conversationsStorage.update(conv);
      ctrl.currentConv = conv;
    };

//custom comparator to sort the date::there is still a bug in this part
    $scope.dateComparator = function(o1,o2)
    {
      console.log(o1);
      console.log(o2);
      var d1 = new Date(o1.value);
      var d2 = new Date(o2.value);
      if(d1>d2) return 1;
      if(d1<d2) return -1;
      return 0;
    };

//signout the user before closing the window
    $window.onbeforeunload= function(){
      if(ctrl.currentUser != null){
        console.log(ctrl.currentUser);
        ctrl.currentUser.isOnline = false;
        usersStorage.update(ctrl.currentUser);
        $rootScope.$apply();
        console.log("signed out");
      }
    };

    $scope.getCtrl =function()
    {
      return $scope;
    };
  }]);
