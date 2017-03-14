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
})