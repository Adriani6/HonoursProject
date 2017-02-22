portal.controller("bucketCtrl", function($scope, $uibModal, $document)
{

    $scope.open = function (size, parentSelector) {
        var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'newBucket.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem
        });
    }

})

portal.controller("ModalInstanceCtrl", function($scope, $uibModalInstance, Profile)
{
    $scope.create = function(bucketName)
    {
        alert(bucketName);
        Profile.newBucket(bucketName, function(r)
        {
            alert(r);
        })

    }

});