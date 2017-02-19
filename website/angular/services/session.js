angular.module('ng').service("Session", function($http) {

    this.retrieve = function(callback)
    {
        $http.get("/api/user/session").then(function(r) {
            callback(r)
        })
    }

    this.signin = function(data, callback)
    {
        console.log(data)
        $http.post("/api/user/signin", JSON.stringify(data)).then(function mySucces(response) {
            callback(response)
        }, function myError(response) {
            callback(response)
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