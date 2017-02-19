portal.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/portal/social.html"
    })
    .when("/planner", {
        templateUrl : "views/portal/planner.html",
        controller: "mapController"
    })
    .when("/profile/:id", {
        templateUrl : "views/portal/profile.html",
        controller: "profile"
    });
});