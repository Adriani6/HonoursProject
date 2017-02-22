portal.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/portal/social.html"
    })
    .when("/planner", {
        templateUrl : "views/portal/planner.html",
        controller: "mapController"
    })
    .when("/bucket", {
        templateUrl : "views/portal/bucket.html",
        controller: "bucketCtrl"
    })
    .when("/profile/:id", {
        templateUrl : "views/portal/profile.html",
        controller: "profile"
    });
});