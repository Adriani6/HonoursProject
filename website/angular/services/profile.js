portal.service("Profile", function($http, Upload)
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

    this.fetchFollowers = function(id, callback)
    {
        $http.get("/api/user/getFollowers?user="+id).then(function(r)
        {
            console.log(r.data)
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
        $http.post("/api/user/newBucket", {name : name}).then(function(r)
        {
            callback(r);
        })
    }

    this.addToBucket = function(data, callback)
    {
        $http.post("/api/user/addToBucket", data).then(function(r)
        {
            callback(r.data);
        })
    }

    this.uploadProfilePicture = function(file, callback)
    {
        Upload.upload({
            url: '/api/user/newProfilePic',
            data: {file: file}
        }).then(function (resp) {
            callback("Profile picture changed successfully.", false);
        }, function (resp) {
            callback("There was an issue uploading photo.", true);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            callback(progressPercentage)
        });
    }

    this.createAlbum = function(album, callback)
    {
        $http.post("/api/user/photos/album/create", {album: album}).then(function(r)
        {
            callback(r.data);
        })
    }

    this.follow = function(id, callback)
    {
        $http.post("/api/user/follow", {id: id, type : "following"}).then(function(r)
        {
            callback(r.data);
        })
    }

    this.Unfollow = function(id, callback)
    {
        $http.post("/api/user/unfollow", {id: id}).then(function(r)
        {
            callback(r.data);
        })
    }

    this.fetchAlbums = function(id, callback)
    {
        $http.get("/api/user/photos/album/getAll?user=" + id).then(function(r)
        {
            callback(r.data);
        })
    }

    this.isFollowing = function(id, callback)
    {     
        $http.get("/api/user/isFollowing?user=" + id).then(function(r)
        {
            callback(r.data);
        })
    }

    this.updateProfileData = function(data, callback)
    {
        $http.post("/api/user/updateProfile", data).then(function(r)
        {
            callback(r.data);
        })
    }

    this.newStatus = function(status, callback)
    {
        $http.post("/api/user/status/create", {statusText: status}).then(function(r)
        {
            callback(r.data);
        })
    }
})