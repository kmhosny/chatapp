"use strict";
angular.module('chatappApp').factory('usersStorage', function ( ) {
      var userStoreName = "users";
      var lastUIDStoreName = "lastUID";
      var store = {
        lastId:0,
        users:[],
        getStorage: function()
        {
            return JSON.parse(localStorage.getItem(userStoreName) || '[]');
        },

        saveStorage: function()
        {
          localStorage.setItem(userStoreName, JSON.stringify(store.users));
          localStorage.setItem(lastUIDStoreName, JSON.stringify(store.lastId));
        },

        get: function()
        {
          store.users = store.getStorage();
          store.lastId = JSON.parse(localStorage.getItem(lastUIDStoreName) || '[]');
          return store.users;
        },

        insert: function(user)
        {
          user.id = ++store.lastId;
          store.users.push(user);
          store.saveStorage();
        },

        update: function(user)
        {
          var index = store.users.findIndex(function(u){
            return u.name == user.name;
          });
          if(index==-1){
            return -1;
          }
          store.users[index] = user;
          store.saveStorage();
        }
      };
      return store;
    });
