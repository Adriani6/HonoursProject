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
})