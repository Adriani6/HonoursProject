var portal = angular.module("portal", ['ui.bootstrap', 'ngRoute']);

portal.controller("GlobalCtrl", function($scope, $uibModal, Requests, Map, Session)
{
  $scope.followers = []
  $scope.user = ""
  // Move Filter function and implement search function inside mapController

  Session.getFollowersActivity(function(d)
  {
    $scope.followers = d;
  })

  Requests.getActivity("589dc479e7dc1c282ccb5596");

  Session.retrieve(function(r)
  {
    $scope.user = r.data;
  })

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

})