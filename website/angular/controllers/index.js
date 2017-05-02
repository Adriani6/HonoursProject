var index = angular.module("index", ['ui.bootstrap', 'ngRoute']);

index.controller('LoginCtrl', function ($scope, $uibModal, $document, Session) {
  var $ctrl = this;
  $ctrl.alerts = [];

  $scope.$on('pushAlert', function(event, alert)
	{
    alert.id = $ctrl.alerts.length;
    $ctrl.alerts.push({timeout: 5000, msg : alert});   

  })

  $ctrl.closeAlert = function(index) {
        $ctrl.alerts.splice(index, 1);
    };

  $ctrl.animationsEnabled = true;


  $ctrl.open = function (size, parentSelector) {
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem
    });

  };
  
});

index.controller("ModalInstanceCtrl", function($uibModalInstance, Session, $window)
{
    var $ctrl = this;

    $ctrl.error = "";

    $ctrl.login = function(data)
    {

      Session.signin(data, function(res)
      {
        console.log("res")
        console.log(res)
        if(res.status == 200)
        {
            $window.location = '/portal';
        }
        else
        {
          $ctrl.error = res.data;
        }
      })
    }

})