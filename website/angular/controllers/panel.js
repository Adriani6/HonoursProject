portal.controller("panel", function($scope, Attraction)
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
                        var date = new Date($scope.selected.offers[j].stamp).toISOString().split("T");
                        var time = date[1].slice(0, 5);
                        var amPM = time[0] < 12 ? 'am' : 'pm';

                        $scope.selected.offers[j].stamp = date[0] + " (at " + time + amPM + ")";
                        
                        var startDate = new Date($scope.selected.offers[j].start);
                        var endDate = new Date($scope.selected.offers[j].end);

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

                        // what's left is seconds
                        var seconds = delta % 60;  // in theory the modulus is not required

                        alert(days + " days and " + hours + ":" + minutes + ":" + seconds);
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
})