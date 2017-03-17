portal.controller("panel", function($scope, Attraction, $uibModal, Tool)
{
    $scope.owned = [];
    $scope.selected = undefined;

    Attraction.getOwned(function(data)
    {
        $scope.owned = data;
    });

    $scope.selectAttraction = function(id)
    {
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

                        

                        $scope.selected.offers[j].expiry = Tool.calculateRemainingTime(startDate, endDate);
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

    $scope.newOffer = function()
    {
        var selected = $scope.selected;

        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'newOffer.html',
            size: 'lg',
            controller: function($scope) {
                //$scope.newOffer = {};

                $scope.createOffer = function(offer)
                {
                    if(offer != undefined && offer.start != undefined && offer.end != undefined && offer.time.start.hour != undefined && offer.time.start.minute != undefined && offer.time.end.hour != undefined && offer.time.end.minute != undefined)
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

                        console.log(offer);

                        Attraction.createOffer(offer, function(data)
                        {

                        })
                    }
                    else
                    {
                        alert("There are empty fields!");
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
            controller: function($scope, Attraction) {
                $scope.offer = offer;

                $scope.acceptRemove = function()
                {
                    Attraction.removeOffer({attr: selected["_id"], stamp: $scope.offer.originalStamp});
                } 
            }
        });
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