"use strict";
//this file contains all the services needed by the application, it acts as the backend simulator, it handles storing and retrieving
//data from localStorage unit and sharing data between controllers, it contains following services
//usersStorage for the users data
//conversationsStorage for storing the conversations data
//messagessStorage for storing the messages
//loggedInUser for sharing the user object between controllers
angular.module('chatappApp').factory('usersStorage', function ( ) {
      var userStoreName = "users";
      var lastUIDStoreName = "lastUID";
      var store = {
        lastId:0,
        users:[],

        saveStorage: function()
        {
          localStorage.setItem(userStoreName, angular.toJson(store.users));
          localStorage.setItem(lastUIDStoreName, angular.toJson(store.lastId));
        },

        get: function()
        {
          store.users = JSON.parse(localStorage.getItem(userStoreName) || '[]');
          store.lastId = JSON.parse(localStorage.getItem(lastUIDStoreName) || 0);
          return store.users;
        },

        insert: function(username,isOnline)
        {
          var user  = new User(username, isOnline,++store.lastId);
          store.users.push(user);
          store.saveStorage();
          return user;
        },

        update: function(user)
        {
          var index = store.users.findIndex(function(u){
            return u.id == user.id;
          });
          if(index==-1){
            return -1;
          }
          store.users[index] = user;
          store.saveStorage();
        }
      };
      return store;
    })
    .factory("loggedInUser",function(){
      var loggedIn = {
        user:null,
        set: function(user) {
          loggedIn.user = user;
        },
        get: function()
        {
          return loggedIn.user;
        }
      };
      return loggedIn;
  })
  .factory("conversationsStorage", function(){
    var conversationsStoreName = "conversations";
    var lastCIDStoreName = "lastCID";
    var store ={
      conversations : [],
      lastId : 0,
      saveStorage: function()
      {
        localStorage.setItem(conversationsStoreName, angular.toJson(store.conversations));
        localStorage.setItem(lastCIDStoreName, angular.toJson(store.lastId));
      },
      get: function()
      {
        store.conversations = JSON.parse(localStorage.getItem(conversationsStoreName) || '[]');
        store.lastId = JSON.parse(localStorage.getItem(lastCIDStoreName) || 0);
        /*store.conversations.sort(function(o1,o2)
        {
          var d1 = new Date(o1);
          var d2 = new Date(o2);
          if(d1>d2) return 1;
          if(d1<d2) return -1;
          return 0;
        });*/
        return store.conversations;
      },
      insert: function(participants,isUnread,lastTimeStamp,name)
      {
        var conv  = new Conversation(++store.lastId,participants,isUnread,lastTimeStamp,name);
        store.conversations.push(conv);
        store.saveStorage();
        return conv;
      },
      update: function(conv)
      {
        var index = store.conversations.findIndex(function(c){
          return c.convId == conv.convId;
        });
        if(index==-1){
          return -1;
        }
        store.conversations[index] = conv;
        store.saveStorage();
      }
    };
    return store;
  })
.factory("messagessStorage", function(){
  var messagesStoreName = "messages";
  var lastMIDStoreName = "lastMID";
  var store ={
    messages : [],
    lastId : 0,
    saveStorage: function()
    {
      localStorage.setItem(messagesStoreName, angular.toJson(store.messages));
      localStorage.setItem(lastMIDStoreName, angular.toJson(store.lastId));
    },
    get: function()
    {
      store.messages = JSON.parse(localStorage.getItem(messagesStoreName) || '[]');
      store.lastId = JSON.parse(localStorage.getItem(lastMIDStoreName) || 0);
      return store.messages;
    },
    insert: function(convId,sender,timeStamp,message)
    {
      var msg  = new Message(++store.lastId,convId,sender,timeStamp,message);
      store.messages.push(msg);
      store.saveStorage();
      return msg;
    }
  };
  return store;
}).
factory("currentCoversation",function()
{
  var conversation = {
    c:null,
    set: function(conv) {
      conversation.c = conv;
    },
    get: function()
    {
      return conversation.c;
    }
  };
  return conversation;
});
