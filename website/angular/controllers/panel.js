portal.controller("panel", function($scope, Attraction, $uibModal, Tool)
{
    $scope.owned = [];
    $scope.selected = $scope.owned[0];
    var id = 0;

    function getOwned()
    {
        Attraction.getOwned(function(data)
        {
            $scope.owned = data;
        });
    }

    $scope.selectAttraction = function(id)
    {
        selectAttraction(id);
    }

    function selectAttraction(idParam)
    {
        id = idParam;
        $scope.futureOffers = 0;
        $scope.liveOffers = 0;

        for(var i = 0; i < $scope.owned.length; i++)
        {

            if($scope.owned[i]["_id"] == id)
            {
                if($scope.owned[i].selected == undefined)
                {
                    $scope.selected = $scope.owned[i];
                    $scope.owned[i].selected = true;

                    for(var j = 0; j < $scope.selected.offers.length; j++)
                    {
                        var startDate = new Date($scope.selected.offers[j].start);
                        var endDate = new Date($scope.selected.offers[j].end);

                        $scope.selected.offers[j].originalStamp = $scope.selected.offers[j].stamp;

                        $scope.selected.offers[j].stamp = Tool.preciseDate($scope.selected.offers[j].stamp);

                        $scope.selected.offers[j].start = Tool.preciseDate($scope.selected.offers[j].start);

                        $scope.selected.offers[j].end = Tool.preciseDate($scope.selected.offers[j].end);

                        $scope.selected.offers[j].status = {};

                        Tool.isOfferLive(startDate, endDate, function(text, label)
                        {
                            if(text == "Future")
                            {
                                $scope.futureOffers++;
                            }

                            if(text == "Live")
                            {
                                $scope.liveOffers++;
                            }

                            if(text != "Ended")
                            {
                                $scope.selected.offers[j].expiry = Tool.calculateRemainingTime(endDate);
                            }
                            else
                            {
                                $scope.selected.offers[j].expiry = "Expired";
                            }
                            
                            $scope.selected.offers[j].status.text = text;
                            $scope.selected.offers[j].status.color = label;
                        });
                        
                        
                    }
                }  
                else
                {
                    delete $scope.owned[i].selected;
                    $scope.selected = undefined;
                }     
            }
            else
            {
                delete $scope.owned[i].selected;
                $scope.selected = undefined;
            }
                
        }
    }

    getOwned();

    $scope.newOffer = function()
    {
        var scope = $scope;
        var selected = $scope.selected;

        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'newOffer.html',
            size: 'lg',
            controller: function($scope, Tool, $rootScope, $uibModalStack) {
                //$scope.newOffer = {};

                $scope.createOffer = function(offer)
                {
                    if(selected != undefined)
                    {
                        if(offer != undefined && offer.start != undefined && offer.end != undefined && offer.time.start.hour != undefined && offer.time.start.minute != undefined && offer.time.end.hour != undefined && offer.time.end.minute != undefined)
                        {
                            if(offer.time.start.hour <= 24 && offer.time.start.hour >= 0 && offer.time.start.minute <= 59 && offer.time.start.minute >= 0 && offer.time.end.hour <= 24 && offer.time.end.hour >= 0 && offer.time.end.minute <= 59 && offer.time.end.minute >= 0)
                            {
                                var startDate = new Date(offer.start);
                                startDate.setHours(offer.time.start.hour);
                                startDate.setMinutes(offer.time.start.minute);

                                var endDate = new Date(offer.end);
                                endDate.setHours(offer.time.end.hour);
                                endDate.setMinutes(offer.time.end.minute);
                                
                                offer.start = startDate.getTime();
                                offer.end = endDate.getTime();

                                delete offer.time;
                                offer.attraction = selected._id;

                                Attraction.createOffer(offer, function(data)
                                {
                                    console.log(data);
                                    $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "Offer created."});
                                    $uibModalStack.dismissAll();
                                    getOwned()
                                    console.log(id)
                                    selectAttraction(id);
                                    //alert("Check Console For response and put it into Alert.")
                                })
                            }
                            else
                            {
                                alert("Invalid Times");
                            }
                        }
                        else
                        {
                            alert("There are empty fields!");
                        }
                    }
                    else
                    {
                        alert("Select Place to apply offer to.");
                    }
                    
                }

                $scope.popup2 = {
                    opened: false
                };
                 $scope.open2 = function() {
                    $scope.popup2.opened = true;
                };

                $scope.popup1 = {
                    opened: false
                };
                 $scope.open1 = function() {
                    $scope.popup1.opened = true;
                };
            }
        });
    }

    $scope.removeOffer = function(offer)
    {
        var selected = $scope.selected;

        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'confirmAction.html',
            size: 'sm',
            controller: function($scope, $rootScope, Attraction, $uibModalStack) {
                $scope.offer = offer;

                $scope.acceptRemove = function()
                {
                    Attraction.removeOffer({attr: selected["_id"], stamp: $scope.offer.originalStamp}, function(res)
                    {
                        console.log(res);
                        $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "Offer removed."});
                        $uibModalStack.dismissAll();
                        //alert("Check Console For response and put it into Alert.")
                    });
                } 
            }
        });
    }

    $scope.uploadNewProfilePhoto = function(file)
    {
        console.log($scope.selected._id)
        Attraction.uploadProfilePic($scope.selected._id, file, function(data)
        {
            $rootScope.$broadcast("pushAlert", {type : "info", title : "Success" , message: "Picture updated."});
            console.log(data);
            //alert("Check Console For response and put it into Alert.")
        })
    }

    $scope.showDetails = function(offer)
    {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'offerDetails.html',
            size: 'lg',
            controller: function($scope) {
                $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                $scope.series = ['Total Views', 'From Notification'];

                $scope.data = [
                    [65, 59, 80, 81, 56, 55, 40],
                    [28, 48, 40, 19, 86, 27, 90]
                ];
            }
        });
    }
})