portal.service("Attraction", function($http)
{
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

})