portal.service("Attraction", function($http, Upload)
{
    this.getData = function(attraction, callback)
    {
        $http.get("/api/attraction/getName?attraction="+attraction).then(function(data)
        {
            console.log(data)
            callback(data.data);
        })
    }

        var reportTypes = Object.freeze({Address: 0, Phone: 1, MapInaccurate: 2, Other: 3});

    this.report = function(attraction, type)
    {
        var attraction_id = attraction.attraction['_id'];
    }

    this.getOwned = function(callback)
    {
        $http.get("/api/panel/getOwnedAttractions").then(function(data)
        {
            callback(data.data);
        })
    }

    this.createOffer = function(offer, callback)
    {  
        console.log(offer);
        //if(offer.start)
        $http.post("/api/attraction/offer/create", offer).then(function(data)
        {
            callback(data.data);
        })
    }

    this.removeOffer = function(data, callback)
    {
        console.log("Hello");
        $http.post("/api/attraction/offer/remove", data).then(function(data)
        {
            callback(data.data);
        })
    }

    this.uploadProfilePic = function(id, file, callback)
    {
        Upload.upload({
            url: '/api/org/photo/profile?attraction='+id,
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

})