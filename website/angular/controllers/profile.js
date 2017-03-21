portal.controller("profile", function($scope, Profile, $routeParams, $uibModalStack, $uibModal, Upload, Session)
{
    $scope.active = 1;
    $scope.profileData = {};
    $scope.album = undefined;
    var userid = $routeParams.id;

    $uibModalStack.dismissAll();

    $scope.showAlbum = function(album)
    {
        console.log(album)
        $scope.album = album;
        $scope.active = 6;
    }

    $scope.uploadPhotos = function(album)
    {
        var album = $scope.album;
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'uploadPhotos.html',
            size: 'md',
            controller: function($scope, Profile) {
                $scope.uploadImages = function(images)
                {
                    if (images && images.length) {
                        for (var i = 0; i < images.length; i++) {
                            Upload.upload({
                                url: '/api/user/photos/upload?album='+album._id,
                                data: {file: images[i], album: album._id}
                            }).then(function (resp) {
                                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                            }, function (resp) {
                                console.log('Error status: ' + resp.status);
                            }, function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                            });
                        }
                    }
                }
            }
        }); 
    }

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
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'createAlbum.html',
            size: 'md',
            controller: function($scope, Profile) {
                $scope.submit = function(a)
                {
                    console.log(a)
                    
                    Profile.createAlbum(a, function(respo)
                    {
                        alert(respo);
                        //Complete this function to take album name as a parameter
                    })
                }
            }
        });    
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