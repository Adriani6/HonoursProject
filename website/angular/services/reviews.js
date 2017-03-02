portal.service("Reviews", function($http)
{
    this.fetch = function(id, callback)
    {
        $http.get("/api/reviews?attraction="+id).then(function(r)
        {
            callback(r.data);
        })
    }
})