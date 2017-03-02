portal.controller("mapController", function($scope, Map, Geo)
{
  $scope.states = [{city : "Aberdeen", coords : {y: 57.149651, x: -2.099075}}];
  $scope.selectedAttractionsText = 0;
  $scope.selectedAttractionsCounter = 0;

  $scope.searchCity = function()
  {
    $scope.results = [];
    $scope.enteredCity = myForm.enteredCity.value;

    for(var i = 0; i < $scope.states.length; i++)
    {
      console.log($scope.states[i].city)
      if($scope.states[i].city.toLowerCase().match(myForm.enteredCity.value.toLowerCase()))
        $scope.results.push($scope.states[i])
    }
   // var a = $scope.states.includes(myForm.enteredCity.value);
    //console.log(a)
  }

  $scope.goBack = function()
  {
    $scope.activeJustified = $scope.activeJustified - 1;
  }

  $scope.loadMap = function()
  {
    Map.loadMap(function()
    {

    });

    $scope.centerMap = function(x, y)
    {
      Map.centerMap(x, y)
      $scope.activeJustified = 1;
      console.log($scope.activeJustified);
      setTimeout(function()
      {
        
        
      })
      
    }

    $scope.test = function()
    {
      alert("Hallo")
    }

    $scope.selectAttraction = function(attraction)
    {
      if(attraction.selected == undefined)
      {
        attraction.selected = true;
        Map.addMarker(attraction.name, attraction.geo.location.lat, attraction.geo.location.lng, function(id)
        {
          attraction.markerID = id;

          $scope.selectedAttractionsCounter++;

          if(typeof $scope.selectedAttractionsText !== 'string')
          {
            if($scope.selectedAttractionsCounter > 9)
              $scope.selectedAttractionsText = "9+";
            else
              $scope.selectedAttractionsText++;
          }    
        });
      }
      else
      {
        delete attraction.selected;
        Map.removeMarker(attraction.markerID)
        $scope.selectedAttractionsCounter--;
        if(typeof $scope.selectedAttractionsText === 'string')
        {
          if($scope.selectedAttractionsCounter == 9)
          {
            $scope.selectedAttractionsText = 9;
          }
        }  

        if($scope.selectedAttractionsCounter < 9)
          {
            $scope.selectedAttractionsText--;
          }        
      }
    }

    //Obfuscated
    $scope.getLocation = function()
    {
      return $scope.states;
      /*Geo.getLocations(loc, function(res)
      {
        console.log(res)
        return res;
      })*/
    }
  }
})

portal.directive('myDirective', function (){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
           scope.$watch(function () {
              return ngModel.$modelValue;
           }, function(newValue) {
               console.log(newValue);
           });
        }
     };
});

portal.directive('rightClick',function($document, $uibModal){
    document.oncontextmenu = function (e) {
       if(e.target.hasAttribute('right-click')) {
           return false;
       }
    };
    return function(scope,el,attrs){
        el.bind('contextmenu',function(e){
            $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title-top',
              ariaDescribedBy: 'modal-body-top',
              templateUrl: 'showAttrDetails.html',
              size: 'lg',
              controller: function($scope) {
                $scope.location = scope.attraction.location;
                $scope.name = scope.attraction.name;  
                $scope.address = scope.attraction.address;
              }
            });         
        }) ;
    }
});