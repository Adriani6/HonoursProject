angular.module('ng').service("Session", function($http) {
    //alert("Loadesd")
    var alerts = [];

    this.retrieve = function(callback)
    {
        $http.get("/api/user/session").then(function(r) {
            callback(r)
        })
    }

    this.signin = function(data, callback)
    {
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
        $http.get("/api/user/getFollowersRecentActivity?type=feed")
        .then(function(r)
        {
            callback(r.data);
        })
    }

    this.checkAlerts = function(callback)
    {
        $http.get("/api/user/getFollowersRecentActivity?type=alerts")
        .then(function(r)
        {
            alerts = r.data;
            callback(r.data);
        })
    }

    this.getAlertsCount = function()
    {
        return alerts.length;
    }

    this.like = function(data, callback)
    {
        data.type = "LIKE";
        console.log(data);

        $http.post("/api//activity/createAction", data).then(function(data)
        {
            //console.log(data)
            if(data.data == "Deleted" || data.data == "Inserted")
                callback(true);
            else
                callback(false);
        })
    }

});