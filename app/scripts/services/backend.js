'use strict';

angular.module('chatappApp').factory('backend',
['$rootScope','conversationsStorage','loggedInUser','messagessStorage','usersStorage','imgurUpload','currentCoversation',
function ( $rootScope,conversationsStorage,loggedInUser,messagessStorage,usersStorage,imgurUpload,currentCoversation) {
   var conversations = conversationsStorage.get();
   var messages = messagessStorage.get();
   var availableUsers = usersStorage.get();
   var backend = {
     updateValues: function()
     {
       conversations = conversationsStorage.get();
       messages = messagessStorage.get();
       availableUsers = usersStorage.get();
     },
     getAvailableUsers: function()
     {
       return availableUsers;
     },
     getCurrentConv: function(){
       return currentCoversation.get();
     }
     ,
     getConversations: function()
     {
       if(loggedInUser.get()==undefined)
         return [];
       var filteredConversations = [];
        for(var i=0; i<conversations.length;i++){
           if(conversations[i].participants.indexOf(loggedInUser.get().id)!=-1)
           {
              filteredConversations.push(conversations[i]);
           }
        }

       return filteredConversations;
     },
     getMessages: function()//get all messages related to this current user
     {
       var filteredConversations = backend.getConversations();
       var conversationsArrayIndex = [];
       for(var i=0; i<filteredConversations.length;i++){//convert it to array of indices for easier search
         conversationsArrayIndex.push(filteredConversations[i].convId);
       }
       var filteredMessages = [];
       for(var i=0; i<messages.length;i++){
          if(((conversationsArrayIndex.indexOf(messages[i].convId))!=-1) && (messages[i].text!=""))
          {
             filteredMessages.push(messages[i]);
          }
       }
       return filteredMessages;
     },
     updateConversation: function(conv)
     {
      conversationsStorage.update(conv);
     },
     uploadImage: function(imgFile){
       var img = imgurUpload.uploadImage(imgFile);
       return img;
       //return imgurUpload.fakeUrl();
     },
     addNewChat: function(isNewChat,usersToAdd,message,filteredMsgs)
     {
       var tempDate = new Date();
       var conv = null;
       var toUser = usersToAdd;
       var name = [loggedInUser.get().username];
       var ids = [loggedInUser.get().id];
       var isUnread = [false];

       for(var i=0; i<toUser.length;i++){
           name.push(toUser[i].username);
           ids.push(toUser[i].id);
           if(toUser[i].id==loggedInUser.get().id){
             isUnread.push(false);
           }
           else {
             isUnread.push(true);
           }
         }
         var idsString = ids.sort().toString();
         for(var i=0; i<conversations.length;i++)
         {
           if(idsString==(conversations[i].participants.sort().toString())){
             isNewChat = false;
             currentCoversation.set(conversations[i]);
             break;
           }
         }
         filteredMsgs = backend.getMessages();
       if(isNewChat){

            conv = conversationsStorage.insert(ids,isUnread,tempDate,name);
            currentCoversation.set(conv);
            filteredMsgs = [];
       }
       else{
             conv = currentCoversation.get();
       }
       for(var i=0; i<conv.isUnread.length; i++)
       {
         if(loggedInUser.get().id == conv.participants[i])
           conv.isUnread[i]=false;
         else
             conv.isUnread[i]=true;
       }
       conv.lastTimeStamp=tempDate;
       var tempMsg = messagessStorage.insert(conv.convId,loggedInUser.get().id,tempDate,message);
       conversationsStorage.update(conv);
       conversations = conversationsStorage.get();
       messages = messagessStorage.get();
       filteredMsgs.push(tempMsg);

       console.log("message sent");
       return filteredMsgs;
     },
     unload: function()
     {
        conversations = null;
        messages = null;
        availableUsers = null;
        currentCoversation.set(null);
        var cu = loggedInUser.get();
        cu.isOnline = false;
        loggedInUser.set(null);
        usersStorage.update(cu);
     },
     load: function()
     {
        conversations = conversationsStorage.get();
        messages = messagessStorage.get();
        availableUsers = usersStorage.get();
     }
   };
return backend;
}]);
