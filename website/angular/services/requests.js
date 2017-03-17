portal.service('Requests', function($http) {

    this.getAttractionsByLocation = function(loc, callback)
    {
        var self = this;
        $http.get("/api/search/"+loc).then(function(r) { 

            self.createFilters(r.data, function(res)
            {
                var data = {};
                data.attractions = r.data;
                data.filters = res;

                callback(data)
            })
        });
    }

    this.createFilters = function(attractions, callback)
    {
        var types = [];

        for(var i = 0; i < attractions.length; i++)
        {
            for(var j = 0; j < attractions[i].types.length; j++)
            {
                if(!types.includes(attractions[i].types[j]))
                    types.push(attractions[i].types[j]);
            }
        }

        callback(types)
    }

});