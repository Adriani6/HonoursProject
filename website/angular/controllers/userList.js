portal.controller("userList", function($scope, Requests)
{
    Requests.searchUser($scope.searchQuery, function(data)
    {
      $scope.userList = data;
    })
})