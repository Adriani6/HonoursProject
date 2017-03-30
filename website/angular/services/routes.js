portal.service('Route', function($http) {

    this.getAllUsersRoutes = function(user, callback)
    {
        
        $http.get("/api/user/routes/get?user="+user).then(function(data)
        {
            
            console.log(data.data);
            callback(data.data);
        })
    }

});