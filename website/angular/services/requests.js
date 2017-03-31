portal.service('Requests', function($http, Upload) {

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

    this.revImageSearch = function(file, callback)
    {
        Upload.upload({
            url: '/api/places/revSearch',
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

});