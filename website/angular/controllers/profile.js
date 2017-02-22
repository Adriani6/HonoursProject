portal.controller("profile", function($scope, Profile, $routeParams)
{
    $scope.profileData = {};
    var userid = $routeParams.id;

    Profile.getProfileData(userid, function(data)
    {
        console.log(data)
        $scope.profileData = data;
    })

})