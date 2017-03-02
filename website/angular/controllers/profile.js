portal.controller("profile", function($scope, Profile, $routeParams, $uibModalStack)
{
    $scope.profileData = {};
    var userid = $routeParams.id;

    $uibModalStack.dismissAll();

    Profile.getProfileData(userid, function(data)
    {
        console.log(data)
        $scope.profileData = data;
    })

})