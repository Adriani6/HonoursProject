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
    })
    .when("/panel", {
        templateUrl : "views/portal/panel.html",
        controller: "panel"
    })
    .when("/organization", {
        templateUrl : "views/portal/organizations_portal.html",
        controller: "panel"
    });
});