portal.controller("settings", function($scope, Profile)
{
    //src="https://lut.im/7JCpw12uUT/mY0Mb78SvSIcjvkf.png"
    $scope.file = undefined;

    $scope.updateProfile = function()
    {
        Profile.updateProfileData($scope.data, function(r)
        {
            console.log(r);
            alert("Check Console For response and put it into Alert.")
        })
        console.log($scope.data);
    }

    $scope.changeProfilePic = function(file)
    {
        Profile.uploadProfilePicture(file, function(res)
        {
            console.log(res)
            alert("Check Console For response and put it into Alert.")
        })
    }

})