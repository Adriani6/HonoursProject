index.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "angular/views/index/index.html"
    })
    .when("/register", {
        templateUrl : "angular/views/index/reg.html"
    });
});