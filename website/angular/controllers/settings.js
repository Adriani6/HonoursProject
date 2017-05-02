portal.controller("settings", function($scope, Profile)
{
    //src="https://lut.im/7JCpw12uUT/mY0Mb78SvSIcjvkf.png"
    $scope.file = undefined;
    $scope.progress = 0;
    $scope.uploadingInProcess = false;

    $scope.updateProfile = function()
    {
        Profile.updateProfileData($scope.data, function(r)
        {
            if(r.nModified == 1)
            {
                $scope.$emit('pushAlert', {type : "success", title : "Success." , message: "Profile updated."})
                $scope.$emit('refreshSession');
            }
        })
    }

    $scope.changeProfilePic = function(file)
    {
        if(file != undefined)
        {
            $scope.uploadingInProcess = true;
            Profile.uploadProfilePicture(file, function(res, err)
            {
                if(err)
                    $scope.$emit('pushAlert', {type : "warning", title : "Couldn't upload Image" , message: res})
                else
                {
                    if(typeof res == 'number')
                    {
                        $scope.progress = res;
                    }
                    else
                    {
                        $scope.$emit('pushAlert', {type : "success", title : "Image changed" , message: res})
                        $scope.$emit('refreshSession');
                    }
                }
                    
            })
        }
        else
        {
            $scope.$emit('pushAlert', {type : "warning", title : "Couldn't upload Image" , message: "Click on the image to select a new picture."})
        }
    }

})