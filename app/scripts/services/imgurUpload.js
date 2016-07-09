'use strict';

angular.module('chatappApp').factory('imgurUpload',['$http', function ($http ) {

  var clientToken = "6930816ec9608e5";
  var baseurl = "https://api.imgur.com/3/image";
  var fakeUrl = "http://i.imgur.com/eQlhK72.png";
  var imgur = {
      uploadImage: function(data)
    {
      var requestData = {
        method:'POST',
        url:baseurl,
        headers:{
          Authorization: "Client-ID "+ clientToken
        },
        data: data
      };
       return $http(requestData);
    },
    getFakeUrl: function()
    {
      return fakeUrl;
    }
  };
  return imgur;
}]);
