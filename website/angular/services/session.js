angular.module('ng').service("Session", function($http) {
    //alert("Loadesd")
    this.retrieve = function(callback)
    {
        $http.get("/api/user/session").then(function(r) {
            callback(r)
        })
    }

    this.signin = function(data, callback)
    {
        console.log(data)
        alert("Clicked")

        $http({
            method: 'POST',
            url: "/api/user/signin",
            data: data
        }).then(function successCallback(response) {
            callback(response);
        }, function errorCallback(response) {
            callback(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    this.getFollowersActivity = function(callback)
    {
        $http.get("/api/user/getFollowersRecentActivity")
        .then(function(r)
        {
            callback(r.data);
        })
    }

});