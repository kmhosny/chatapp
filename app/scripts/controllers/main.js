'use strict';

/**
 * @ngdoc function
 * @name chatappApp.controller:MainCtrl
 * @description this is the main controller handling the chatting and message exchange
 * # MainCtrl
 * Controller of the chatappApp
 */
angular.module('chatappApp')
  .controller('MainCtrl',
  ['$rootScope','$scope','conversationsStorage','$window','loggedInUser','messagessStorage','usersStorage','imgurUpload','backend','currentCoversation',
  function ($rootScope,$scope, conversationsStorage,$window,loggedInUser,messagessStorage,usersStorage,imgurUpload,backend,currentCoversation) {

    var ctrl = this;
    ctrl.currentUser = loggedInUser.get();
    ctrl.currentConv = currentCoversation.get();
    ctrl.userMessages = backend.getMessages();
    ctrl.filteredMsgs = [];
    ctrl.message = {text:"",type:1};
    ctrl.usersToAdd = [];
    ctrl.availableUsers = backend.getAvailableUsers();
    ctrl.conversations = backend.getConversations();
    ctrl.emojifyConfig = {mode:'img',img_dir:'images/basic/'};
    emojify.setConfig(ctrl.emojifyConfig);
    emojify.run();
    ctrl.emojisString = [":)",":(",":O",":/"];
    ctrl.emojis = [];
    for(var i=0; i<ctrl.emojisString.length; i++)
    {
      ctrl.emojis.push({emoji:emojify.replace(ctrl.emojisString[i]),id:"emoji"+i});
    }

    angular.element("[data-toggle='tooltip']").tooltip();
    angular.element("#conversationLogo").hide();

    ctrl.addNewChat = function(isNewChat)
    {
      if(ctrl.message.type!=2){
        ctrl.message.text = emojify.replace(ctrl.textMessage);
      }
      backend.addNewChat(isNewChat,ctrl.usersToAdd,ctrl.message,ctrl.filteredMsgs);
      ctrl.currentConv = backend.getCurrentConv();
      ctrl.userMessages = backend.getMessages();
      ctrl.conversations = backend.getConversations();
      ctrl.message = {text:"",type:1};
      ctrl.message.text = "";
      ctrl.textMessage = "";
      for(var i=0; i<ctrl.availableUsers.length;i++)
      {
        if(angular.element("#user"+i).prop("checked"))
        {
          angular.element("#user"+i).prop("checked",false);
        }
      }
      var msgs  = [];
      for(var i=0; i<ctrl.getUserMessages().length; i++)//filter from the user's messages the ones for current conversation
      {
        if(ctrl.currentConv.convId == ctrl.getUserMessages()[i].convId)
        {
          msgs.push(ctrl.getUserMessages()[i]);
        }
      }
      ctrl.filteredMsgs = msgs;
      // var height = angular.element("#emptyChat").height();
      // if(height>0) {
      //   angular.element("#emptyChat").height(height-100);
      //   angular.element("#chatBody").height(angular.element("#chatBody").height()+100);
      // }
    };

    ctrl.showAddParticipant = function()
    {
      angular.element("#tempMsg").modal();

    };

    ctrl.addParticipants = function()
    {
      var particpants = [];
      for(var i=0; i<ctrl.availableUsers.length;i++)
        {
          if(angular.element("#user"+i).prop("checked"))
          {
            particpants.push(ctrl.availableUsers[i]);
          }
        }
        ctrl.usersToAdd = particpants;
        ctrl.addNewChat(true);
        angular.element("#tempMsg").modal("hide");
    };

    ctrl.setAvailableUsers = function()
    {
      ctrl.availableUsers = backend.getAvailableUsers();
      return ctrl.availableUsers;
    };

    ctrl.getAvailableUsers = function () {
      return ctrl.availableUsers;
    };

    ctrl.setConversations = function() {
      ctrl.conversations = backend.getConversations();
    };

    ctrl.getConversations = function() {
      return ctrl.conversations;
    };

    ctrl.setUserMessages = function(){
      ctrl.userMessages = backend.getMessages();
    };

    ctrl.getUserMessages = function(){
      return ctrl.userMessages;
    };

    ctrl.showSenderName = function()
    {

      if(ctrl.currentConv==null){
         return false;
      }
      return ctrl.currentConv.participants.length==2;
    };

    ctrl.getSenderName=function(sender)
    {
      //ctrl.setAvailableUsers(backend.getAvailableUsers());
      for(var i=0; i<ctrl.getAvailableUsers().length;i++)
      {
        if(sender==ctrl.getAvailableUsers()[i].id){
          return ctrl.getAvailableUsers()[i].username;
        }
      }
    };

//retrieve the last message in the conversation between 2 persons to display below the conversation name
    ctrl.getLastMessage = function(convId)
    {
      if(ctrl.currentUser==null){
        return null;
      }
      var maxDate = new Date(0);
      var lastMsg =null;
      var index = -1;
      for(var i=0; i<ctrl.getUserMessages().length; i++){
        var tempDate = new Date(ctrl.getUserMessages()[i].timeStamp);
          if((ctrl.getUserMessages()[i].convId==convId) && (tempDate>maxDate) && (ctrl.getUserMessages()[i].text!="")){
            maxDate = tempDate;
            index = i;
          }
      }
      if(index==-1){
        return null;
      }
      lastMsg = angular.copy(ctrl.getUserMessages()[index].text);
      if(lastMsg.type===2)
      {
        lastMsg.text="<div class='textIcon'></div>";
      }
      return lastMsg.text;
    };

//function returning boolean value to check if the last message was read by the current user or not
    ctrl.isUnread = function(convId)
    {
      if(ctrl.currentUser==undefined){
        return true;
      }
      var isUnread = null;
      var index = ctrl.getConversations().findIndex(function(u){
              return  u.convId == convId;
      });
      var i = ctrl.getConversations()[index].participants.findIndex(function(u){
              return  u == ctrl.currentUser.id;
      });
      isUnread = ctrl.getConversations()[index].isUnread[i];
      return isUnread;
    };


//register a click event on the conversations in conversation tab and keep track of current conversation
    $scope.convClicked = function($event)
    {
      // angular.element("#emptyChat").height(395);
      // angular.element("#emptyChat").collapse();
      var conv = null;
      for(var i=0; i<ctrl.getConversations().length;i++){
        if($event.currentTarget.id ==ctrl.getConversations()[i].convId){
            conv = ctrl.getConversations()[i];
            break;
          }
        }
      if(conv==null){ return null;
      }
      var msgs  = [];
      for(var i=0; i<ctrl.getUserMessages().length; i++)//filter from the user's messages the ones for current conversation
      {
        if($event.currentTarget.id == ctrl.getUserMessages()[i].convId)
        {
          msgs.push(ctrl.getUserMessages()[i]);
        }
      }
      ctrl.filteredMsgs = msgs;
      for(var i=0; i<conv.isUnread.length; i++)
      {
        if(ctrl.currentUser.id == conv.participants[i]){
          conv.isUnread[i]=false;
        }
      }
      //conversationsStorage.update(conv);
      backend.updateConversation(conv);
      currentCoversation.set(conv);
      ctrl.currentConv = conv;
      angular.element("#conversationLogo").show();

      // if(ctrl.filteredMsgs.length>=4){
      //   angular.element("#emptyChat").height(0);
      // }
      // else{
      //   var height = angular.element("#emptyChat").height();
      //   var newH = 50*ctrl.filteredMsgs.length;
      //   if(height>0){
      //     angular.element("#emptyChat").height(height-newH);
      //     angular.element("#chatBody").height(angular.element("#chatBody").height()+newH);
      //   }
      //}
    };

    ctrl.uploadImage = function()
    {
      angular.element("#fileDialog").click();
    };

    $scope.sendMsgAsImage = function(element)
    {
      console.log(element.files[0]);
      var res=backend.uploadImage(element.files[0]);
      var url="";
      res.then(function success(response){
         url = response.data.data.link;
        ctrl.message = {text:"<img src='"+url+"' class='img-thumbnail'>",type:2};
        ctrl.addNewChat(false);
        //$rootScope.$apply();

     },function error(response){
       url= "error";
     });

    };

    ctrl.getName = function(conv)//return the chat name
    {
      if(ctrl.currentUser==null){
        return "";
      }
      if(conv==null || conv==undefined){
        return "";
      }
      var filteredNames = [];
      for(var i=0; i<conv.name.length;i++)
      {
        if(conv.name[i]!=ctrl.currentUser.username){
          filteredNames.push(conv.name[i]);
        }
      }
      return filteredNames.toString();
    };

    ctrl.isEnter= function($event)
    {
      if($event.keyCode==13)
      {
        ctrl.addNewChat(false);
      }

    };

    $scope.emoClicked = function($event)
    {
      var html=angular.element("#"+$event.currentTarget.id).html();
      ctrl.textMessage+=html;
    };
    ctrl.openEmojis=function(){
      angular.element("#emojisDiv").toggle();
    };

    ctrl.clearPlaceholder=function($event)
    {
      if($event.type == "mouseover"){
        angular.element("#inputPlaceHolder").text("");
      }
      else if ($event.type =="mouseleave" && ctrl.textMessage=="") {
        angular.element("#inputPlaceHolder").text("Type a message");
      }
    };


    angular.element('#inputTextMessage').keyup(function(e){ ctrl.check_charcount('inputTextMessage', 100, e); });
    angular.element('#inputTextMessage').keydown(function(e){ ctrl.check_charcount('inputTextMessage', 100, e); });

      ctrl.check_charcount=function(content_id, max, e)
      {
          if(e.which != 8 && angular.element('#'+content_id).text().length > max)
          {
             // $('#'+content_id).text($('#'+content_id).text().substring(0, max));
             e.preventDefault();
          }
      };


//perform a watch over the storage data if it changes then the displayed messages should change
  angular.element($window).on("storage",function(event)
    {
      console.log("called");
      backend.updateValues();
      if(ctrl.currentUser!=null){
        if(event.originalEvent.key=='lastMID')
        {
          ctrl.setConversations();
          ctrl.setUserMessages();
          console.log(ctrl.currentUser);
          var msgs=[];
          if(ctrl.currentConv!=null){//filteredd message for chat area needs to be updated after sending new message
            for(var i=0; i<ctrl.getUserMessages().length; i++)//filter from the user's messages the ones for current conversation
            {
              if(ctrl.currentConv.convId == ctrl.getUserMessages()[i].convId)
              {
                msgs.push(ctrl.getUserMessages()[i]);
              }
            }
          }
          ctrl.filteredMsgs = msgs;
          $rootScope.$apply();
        }
        else if (event.originalEvent.key=='lastUID') {
          ctrl.setAvailableUsers();
        }
      }
    });
//signout the user before closing the window
    $window.onbeforeunload= function(){
      if(ctrl.currentUser != null){
        console.log(ctrl.currentUser);
        ctrl.currentUser.isOnline = false;
        usersStorage.update(ctrl.currentUser);
        ctrl.currentConv = null;
        backend.unload();
        console.log("signed out");
        $rootScope.$apply();
      }
    };

    $scope.getScope =function()
    {
      return $scope;
    };
  }]);
