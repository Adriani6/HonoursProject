portal.controller("mapController", function($scope, $uibModal, Requests, Map)
{
  var self = this;
  var allFilters = undefined;
  var filters = [];

    $scope.isCollapsedHorizontal = true;
    $scope.foundCount = 0;

    Requests.getAttractionsByLocation("Aberdeen", function(data)
    {
      console.log(data)
      self.allFilters = data.filters;

      $scope.filters = data.filters.slice(0, 4);
      if(data.attractions.length > 4)
        $scope.showMoreAttractions = true;

        $scope.filter_count = data.filters.length - 4
        $scope.foundCount = data.attractions.length

        $scope.attractions = data.attractions;
    })

    $scope.showMoreFilters = function(parentSelector)
    {
          var parentElem = parentSelector ? 
          angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
          var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'filtersPopup.html',
          size: 'sm',
          appendTo: parentElem,
          controller: function($scope)
          {
            $scope.filters = self.allFilters;
          }

        });
    }

    $scope.updateFilters = function(filter)
    {
      if(filters.includes(filter))
      {
        var index = filters.indexOf(filter);
        if (index > -1) {
          filters.splice(index, 1);
        }
      }
      else
        filters.push(filter)
    }  

    $scope.selectAttraction = function(attraction)
    {
      if(attraction.selected == undefined)
      {
        attraction.selected = true;
        Map.addMarker(attraction.name, attraction.geo.location.lat, attraction.geo.location.lng, function(id)
        {
          attraction.markerID = id;
        });
      }
      else
      {
        delete attraction.selected;
        Map.removeMarker(attraction.markerID)
      }
    }
})
