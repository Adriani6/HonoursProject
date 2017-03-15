portal.controller("panel", function($scope, Attraction, $uibModal)
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

                        var date = new Date($scope.selected.offers[j].stamp).toISOString().split("T");
                        var time = date[1].slice(0, 5);
                        var amPM = time[0].split(":")[0] < 12 ? 'am' : 'pm';

                        $scope.selected.offers[j].stamp = date[0] + " (at " + time + amPM + ")";

                        date = new Date($scope.selected.offers[j].start).toISOString().split("T");
                        time = date[1].slice(0,5);
                        amPM = time[0].split(":")[0] < 12 ? 'am' : 'pm';

                        $scope.selected.offers[j].start = date[0] + " (at " + time + amPM + ")";

                        date = new Date($scope.selected.offers[j].end).toISOString().split("T");
                        time = date[1].slice(0,5);
                        amPM = time.split(":")[0] < 12 ? 'am' : 'pm';

                        $scope.selected.offers[j].end = date[0] + " (at " + time + amPM + ")";

                        var delta = Math.abs(endDate - startDate) / 1000;

                        // calculate (and subtract) whole days
                        var days = Math.floor(delta / 86400);
                        delta -= days * 86400;

                        // calculate (and subtract) whole hours
                        var hours = Math.floor(delta / 3600) % 24;
                        delta -= hours * 3600;

                        // calculate (and subtract) whole minutes
                        var minutes = Math.floor(delta / 60) % 60;
                        delta -= minutes * 60;

                        var string = "";

                        string += days > 0 ? days + " days, " : '';
                        string += hours > 0 ? hours + " hours " : '';
                        string += minutes > 0 ? minutes + " minutes" : '';

                        $scope.selected.offers[j].expiry = string;
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
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'newOffer.html',
            size: 'lg',
            controller: function($scope) {
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
        
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'confirmAction.html',
            size: 'sm',
            controller: function($scope) {
                $scope.offer = offer;

                $scope.acceptRemove = function()
                {
                    console.log($scope.offer)
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