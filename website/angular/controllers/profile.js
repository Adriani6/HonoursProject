portal.controller("profile", function($scope, Profile, $routeParams, $uibModalStack, $uibModal, Upload, Session, Attraction, Route, Tool, $rootScope)
{
    $scope.active = 1;
    $scope.profileData = {};
    $scope.followers = [];
    $scope.album = undefined;
    $scope.imageCount = 0;
    var userid = $routeParams.id;
    $scope.selectedFilter = "Users";
    $scope.followingList = undefined;
    $scope.status = {};

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
            controller: function($scope, Profile, $rootScope) {
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

                    //Create a loading toolbar
                    $rootScope.$emit('pushAlert', {type : "success", title : "Images" , message: " have been successfully uploaded."})
                }
            }
        }); 
    }

    function loadProfile()
    {
        Profile.getProfileData(userid, function(data)
        {
            console.log(data.followers)
            $scope.followers = data.followers;

            if(data.activity && data.activity.length > 0)
                data.activity.reverse();

            if(data.profile != undefined && data.profile.dob != undefined)
            {
                data.profile.dob.month = Tool.getMonthText(data.profile.dob.month);
            }

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
                    
                    if(data.profile && data.profile.photo)
                        d.photo = data.profile.photo;

                    d._id = data._id;
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
                for(var i = 0; i < data.length; i++)
                {
                    if(data[i].photos != undefined)
                        $scope.imageCount += data[i].photos.length;
                }
            })

            /*Profile.fetchFollowers(userid, function(data)
            {
                //= data;
                for(var i = 0; i < data.length; i++)
                {
                    if(userid != data[i]._id)
                    {
                        //$scope.followers.push(data[i]);
                    }
                }
            })*/

            Profile.isFollowing(userid, function(is)
            {
                $scope.followBtn = is;
            })

            // Get Data for Routes
            Route.getAllUsersRoutes(userid, function(data)
            {
                $scope.routeCounter = data.length;
                $scope.routes = data;
            })
        })
    }

    $scope.showRoute = function(route)
    {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'showRoute.html',
            size: 'lg',
            controller: function($scope, Map) {
                $scope.loadMap = function()
                {
                    Map.loadMap(function() {

                    });
                }
                $scope.route = route;
            }
        });
        
    }

    $scope.$watch("active", function()
    {
        if($scope.active == 2)
        {
           //Albums screen is displayed
        }

        if($scope.active == 5)
        {
            for(var i = 0; i < $scope.routes.length; i++)
            {
                for(var j = 0; j < $scope.routes[i].places.length; j++)
                {
                    addPhoto(i, j);
                }
            }

            function addPhoto(i, j)
            {
                console.log(i, j)
                Attraction.getData($scope.routes[i].places[j].id, function(data)
                {
                    if(data.profile != undefined && data.profile.photo != undefined)
                        $scope.routes[i].places[j].photo = data.profile.photo;

                    $scope.routes[i].places[j].name = data.name;
                })
            }
        }       
    })

    $scope.unfollow = function(id)
    {
        //Implement Function
        Profile.Unfollow(id, function(resp)
        {
            if(resp.nModified == 1)
            {
                $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "User unfollowed."});
                loadProfile();
            }
        })
    }

    $scope.follow = function(id)
    {
        //Implement Function
        if(id != undefined)
        {
            Profile.follow(id, function(data)
            {
                if(data.nModified == 1)
                {
                    $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "You're following this user now."});
                    loadProfile();
                }
                
            })
        }
        //alert(id);
    }

    $scope.newAlbum = function()
    {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'createAlbum.html',
            size: 'md',
            controller: function($scope, Profile, $rootScope) {
                $scope.submit = function(a)
                {
                    console.log(a)
                    
                    Profile.createAlbum(a, function(respo)
                    {
                        if(respo != undefined && respo.insertedCount > 0)
                        {
                            $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "Album Created"});
                        }
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
                        console.log(d);
                        $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "Profile Photo Changed"});
                    })
                }
            }
        });
    }

    $scope.newStatus = function(status)
    {
        Profile.newStatus($scope.status.statusText, function(response)
        {
            $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: response});
            $scope.status.statusText = "";
            loadProfile();
        })
    }

    loadProfile();
})