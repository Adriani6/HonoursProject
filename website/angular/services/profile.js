portal.service("Profile", function($http)
{
    this.getRecentActivity = function(id, callback)
    {
        $http.get("/api/user/getRecentActivity?user="+id).then(function(r)
        {
            callback(r);
        })
    }

    this.getProfileData = function(id, callback)
    {
        $http.get("/api/user/getProfile?user="+id).then(function(r)
        {
            //console.log(r.data.profile)
            callback(r.data)
        })
    }

    this.getBuckets = function(callback)
    {
        $http.get("/api/user/retrieveBuckets").then(function(r)
        {
            callback(r.data);
        })
    }

    this.newBucket = function(name, callback)
    {
        alert("Service: " + name)
        $http.post("/api/user/newBucket", {name : name}).then(function(r)
        {
            callback(r);
        })
    }

    this.addToBucket = function(data, callback)
    {
        $http.post("/api/user/addToBucket", data).then(function(r)
        {
            callback(r);
        })
    }
})