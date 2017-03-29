var portal = angular.module("portal", ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'chart.js', 'ngFileUpload']);

portal.controller("GlobalCtrl", function($scope, $uibModal, Requests, Map, Session)
{
  $scope.followers = []
  $scope.user = ""
  $scope.alertsCount = Session.getAlertsCount();
  // Move Filter function and implement search function inside mapController

  Session.getFollowersActivity(function(d)
  {
    for(var i = 0; i < d.length; i++)
    {
      if(!d[i].activity[0].aData)
      {
        d[i].activity[0].tooltipTxt = "Like Activity";
      }
      else
      {
        d[i].activity[0].tooltipTxt = "Unlike Activity";
      }
    }
    
    $scope.followers = d;
    //console.log(d)
  })

  Session.checkAlerts(function(d)
  {
    $scope.alertsCount = Session.getAlertsCount();
    $scope.alertDetails = d;
  })

  $scope.previewAlert = function(data)
  {
    if(data.data != undefined && data.type == "OFFER")
    {
      $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'previewOffer.html',
            size: 'md',
            controller: function($scope, Tool) {
                $scope.data = data;
                $scope.validFrom = Tool.preciseDate(data.data.start);
                $scope.validTill = Tool.preciseDate(data.data.end);
            }
        }); 
    }
    else if(data.title.indexOf("basket") > 0)
    {
        //Basket was liked
    }
    else if(data.title.indexOf("status") > 0)
    {
      //status
      $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'previewStatus.html',
            size: 'md',
            controller: function($scope) {
                $scope.data = data;
            }
        }); 
    }
    
    console.log(data);
  }

  Session.retrieve(function(r)
  {
    $scope.user = r.data;
  })

  $scope.like = function(a, p, type)
  {
    var obj = {};
    obj.activity =  a.ID;
    obj.receiver = p._id;
    obj.liked = type;

    if(!a.aData)
    {  
      Session.like(obj, function(success)
      {
        if(success)
        {
          a.aData = true;   
          a.tooltipTxt = "Unlike Activity";
        }
      }) 
    }
    else
    {
      Session.like(obj, function(success)
      {
        if(success)
        {
          a.aData = null;
          a.tooltipTxt = "Like Activity";
        }
      }) 
    }
  }

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