var portal = angular.module("portal", ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'chart.js', 'ngFileUpload']);

portal.controller("GlobalCtrl", function($scope, $uibModal, Requests, Map, Session, $timeout)
{
  $scope.alerts = []
  $scope.followers = []
  $scope.user = ""
  $scope.alertsCount = Session.getAlertsCount();

  $scope.searchPerson = function()
  {
    
  }
  // Move Filter function and implement search function inside mapController
  $scope.removeAlert = function(alert)
  { 
      $timeout(function() {
        for(var i = 0; i < $scope.alerts.length; i++)
        {
          if($scope.alerts[i].id == alert.id)
          {
            $scope.alerts.splice(i, 1)
          }
        }
      }, 5000);
  }

  $scope.$on('pushAlert', function(event, alert)
	{
    alert.id = $scope.alerts.length;
    $scope.alerts.push(alert);   

  })

  $scope.$on('refreshSession', function(event)
	{
     Session.retrieve(function(r)
    {
      $scope.user = r.data;
    })

  })

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
    obj.activity =  a.id;
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

    var attractions_backup = [];

    $scope.$on('applyFilters', function(event, filters)
    {
      if(filters.length > 0)
      {
        if(attractions_backup.length <= 0)
        {
          attractions_backup = $scope.attractions.slice();
        }
        
        $scope.attractions.splice(0, $scope.attractions.length);
        $scope.attractions = [];
        
        for(var i = 0; i < attractions_backup.length; i++)
        {
          for(var j = 0; j < filters.length; j++)
          {
            //console.log(attractions_backup[i].types, j)
            if(attractions_backup[i].types.indexOf(filters[j]) > -1)
            {
              if($scope.attractions.indexOf(attractions_backup[i]) < 0)
                $scope.attractions.push(attractions_backup[i]);
            }
          }
          
        }
      }
      else
      {
        $scope.attractions = attractions_backup.slice();
      }


    })

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
          controller: function($scope, $rootScope)
          {
            $scope.filters = self.allFilters;
            $scope.selectedFilters = {};
            var filtersToSend = [];

            $scope.filterResults = function()
            {
              for(var fil in $scope.selectedFilters)
              {
                if($scope.selectedFilters[fil])
                  filtersToSend.push(fil)
              }

              $rootScope.$broadcast("applyFilters", filtersToSend)
            }

            $scope.filterClear = function()
            {
              $scope.selectedFilters = {};
              $rootScope.$broadcast("applyFilters", {})
            }
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

    $scope.revSearchDialog = function()
    {
      $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'revSearchDialog.html',
            size: 'md',
            controller: function($scope, Requests) {
                $scope.isLoading = false;
                
                $scope.uploadImage = function(file)
                {
                  $scope.isLoading = true;
                  Requests.revImageSearch(file, function(resp)
                  {
                    $scope.isLoading = false;
                    console.log(resp)
                    alert("Check Console For response and put it into Alert.")
                  })
                  
                  console.log(file)
                }
            }
        }); 
    }

})


portal.directive('albumRightClick', function($document, $uibModal, Attraction)
{
  var offsetX, offsetY;
	document.oncontextmenu = function(e)
	{
    offsetX = e.offsetX;
    offsetY = e.offsetY;
		if (e.target.hasAttribute('right-click'))
		{
			return false;
		}
	};
	return function(scope, el, attrs)
	{
		el.bind('contextmenu', function(e)
		{
      console.log(e.offsetX, e.offsetY)
      var resizer = angular.element('<div class="" style="height: 50px; width: 50px; background: blue; position: absolute; top:'+e.offsetX+'px; right: '+e.offsetY+'px;"></div>')
                     .bind('mousedown', function ($event) {
                        console.log("Box clicked")
                     });
      el.append(resizer);
      console.log(scope.album)
    })
  }
})