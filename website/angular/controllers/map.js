portal.controller("mapController", function($scope, Map)
{
  $scope.loadMap = function()
  {
    Map.loadMap();
  }

})
