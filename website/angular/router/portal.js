portal.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/portal/social.html"
    })
    .when("/planner", {
        templateUrl : "views/portal/planner.html",
        controller: "mapController"
    });
});