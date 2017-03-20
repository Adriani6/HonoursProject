portal.controller("profile", function($scope, Profile, $routeParams, $uibModalStack, $uibModal, Upload, Session)
{
    $scope.active = 1;
    $scope.profileData = {};
    var userid = $routeParams.id;

    $uibModalStack.dismissAll();

    Profile.getProfileData(userid, function(data)
    {
        console.log(data)
        $scope.profileData = data;
    })

    $scope.$watch("active", function()
    {
        if($scope.active == 2)
        {
            //Photos tab displaying
            Session.retrieve(function(sesh)
            {
                console.log(sesh)
                Profile.fetchAlbums(sesh.data._id, function(data)
                {
                    $scope.albums = data;
                })
            })
        }
    })

    $scope.newAlbum = function()
    {
        Profile.createAlbum(0, function(a)
        {
            //Complete this function to take album name as a parameter
        })
    }

    $scope.changeProfilePhoto = function()
    {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'imageUpload.html',
            size: 'md',
            controller: function($scope, Profile) {
                $scope.submit = function()
                {
                    console.log($scope.file);

                    Profile.uploadProfilePicture($scope.file, function(d)
                    {

                    })
                }
            }
        });
    }

})