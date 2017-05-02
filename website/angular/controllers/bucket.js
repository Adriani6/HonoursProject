portal.controller("bucketCtrl", function($scope, $uibModal, $document, Profile)
{
    $scope.buckets = [];

    function loadBuckets()
    {
        Profile.getBuckets(function(buckets)
        {
            $scope.buckets = buckets;
        })
    }

    $scope.open = function (size, parentSelector) {
        var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'newBucket.html',
        controller: 'ModalInstanceCtrl',
        scope:$scope,
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem
        });
    }

    $scope.finishedCreating = function()
    {
        $scope.$emit('pushAlert', {type : "success", title : "Basket Created" , message: " has been created."})
        loadBuckets()
    }

    loadBuckets()

})

portal.controller("ModalInstanceCtrl", function($scope, $uibModalInstance, Profile, $uibModalStack, $rootScope)
{
    $scope.create = function(bucketName)
    {
        Profile.newBucket(bucketName, function(r)
        {
            //Close All modals
            //alert("Check Console For response and put it into Alert.")
            console.log(r);
        })

        
        
        $uibModalStack.dismissAll();
        

        $scope.finishedCreating();
        
    }

});