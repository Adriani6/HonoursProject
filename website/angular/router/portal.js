portal.config(function($routeProvider) {
    $routeProvider
    .when("/portal", {
        templateUrl : "views/portal/index.html"
    })
    .when("/planner", {
        templateUrl : "views/portal/planner.html",
        controller: "mapController"
    });
});