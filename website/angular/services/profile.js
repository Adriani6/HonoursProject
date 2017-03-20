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
            callback(r.data);
        })
    }

    this.uploadProfilePicture = function(file, callback)
    {
        Upload.upload({
            url: '/api/user/newProfilePic',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }

    this.createAlbum = function(album, callback)
    {
        $http.post("/api/user/photos/album/create", {album: "Aberdeen"}).then(function(r)
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
})