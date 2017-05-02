portal.controller("admin", function($scope, Requests, $rootScope)
{
    $scope.address = 0;
    $scope.phone = 0;
    $scope.map = 0;
    $scope.other = 0;


    function loadReports()
    {
        $scope.address = 0;
        $scope.phone = 0;
        $scope.map = 0;
        $scope.other = 0;

        Requests.loadReports(function(reports)
        {
            $scope.reports = reports;

            for(var i = 0; i < reports.length; i++)
            {
                for(var j = 0; j < reports[i].reporting.length; j++)
                {
                    if(reports[i].reporting[j] == "Wrong Address")
                    {
                        $scope.address++;
                    }

                    if(reports[i].reporting[j] == "Wrong Phone Number")
                    {
                        $scope.phone++;
                    }

                    if(reports[i].reporting[j] == "Inaccurate Map Placement")
                    {
                        $scope.map++;
                    }

                    if(reports[i].reporting[j] == "Other")
                    {
                        $scope.other++;
                    }
                }
            }
        })
    }

    loadReports();
    
    $scope.resolveReport = function(id)
    {
        Requests.resolveReport(id, function(resp)
        {
            $rootScope.$broadcast('pushAlert', {type : "success", title : "Resolved" , message: "Report has been resolved."})
            loadReports();
        })
    }
})