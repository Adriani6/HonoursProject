portal.controller("profile", function($scope, Profile, $routeParams, $uibModalStack, $uibModal, Upload, Session, Attraction)
{
    $scope.active = 1;
    $scope.profileData = {};
    $scope.album = undefined;
    $scope.imageCount = 0;
    var userid = $routeParams.id;
    $scope.selectedFilter = "Users";
    $scope.followingList = undefined;

    $uibModalStack.dismissAll();

    $scope.showAlbum = function(album)
    {
        console.log(album)
        $scope.album = album;
        $scope.active = 6;
    }

    $scope.filterList = function(filter)
    {
        $scope.selectedFilter = filter;

        if(filter == "Users")
        {
            $scope.followingList = $scope.profileData.following;
        }
        else if(filter == "Places")
        {
            $scope.followingList = $scope.profileData.following_attractions;
        }
    }

    $scope.backToAlbums = function()
    {
        $scope.active = 2;
    }

    $scope.showImage = function(img)
    {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'showImage.html',
            size: 'md',
            controller: function($scope) {
                img.time = new Date(img.time)
                $scope.photo = img;
            }
        });
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
        function setAttractionName(i, id)
        {
            Attraction.getData(data.following_attractions[i], function(data)
            {
                $scope.profileData.following_attractions[i] = data;
            })
        }

        function setUserName(i, id)
        {
            Profile.getProfileData(data.following[i], function(data)
            {
                var d = {};
                d.name = data.firstname + " " + data.surname;
                d.location = data.location;
                $scope.profileData.following[i] = d;
            })
        }

        $scope.profileData = data;

        if(data.following_attractions != undefined)
        {
            for(var i = 0; i < data.following_attractions.length; i++)
            {
                setAttractionName(i, data.following_attractions[i])
            }
        }

        if(data.following != undefined)
        {
            for(var i = 0; i < data.following.length; i++)
            {
                setUserName(i, data.following[i]);
            }
        }

        $scope.followingList = data.following;
        Profile.fetchAlbums(userid, function(data)
        {
            $scope.albums = data;
            console.log(data);
            for(var i = 0; i < data.length; i++)
            {
                if(data[i].photos != undefined)
                    $scope.imageCount += data[i].photos.length;
            }
        })

        Profile.fetchFollowers(userid, function(data)
        {
            $scope.followers = data;
        })

        Profile.isFollowing(userid, function(is)
        {
            $scope.followBtn = is;
        })
    })

    $scope.$watch("active", function()
    {
        if($scope.active == 2)
        {
           //Albums screen is displayed
        }       
    })

    $scope.unfollow = function(id)
    {
        alert(id);
    }

    $scope.follow = function(id)
    {
        alert(id);
    }

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