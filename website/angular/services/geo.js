portal.service('Geo', function($http) {

    this.getLocations = function(loc, callback)
    {
        callback(["Aberdeen"])
        /*$http.get("/api/geocode?address=" + loc).then(function(r)
        {
            console.log(r.data)
            callback(r);
        })*/
    }
})