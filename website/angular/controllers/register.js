index.controller("registerCtrl", function($scope, $http, $window)
{
    $scope.errors = {};

    $scope.verify = 
    {
        firstname : function(firstname)
        {
            if(firstname != undefined)
            {
                if(firstname.length > 2)
                    delete $scope.errors.firstname
                else
                    $scope.errors.firstname = "First name is too short."
            }
        },

        surname : function(surname)
        {
            if(surname != undefined)
            {
                if(surname.length > 2)
                    delete $scope.errors.surname
                else
                    $scope.errors.surname = "Surname is too short."
            }
        },

        password : function(password, confirm)
        {

            if(password != undefined)
            {
                if(password.length > 6)
                    delete $scope.errors.password
                else
                    $scope.errors.password = "Password is too short."
            }

            if(confirm != undefined)
                {
                    if(password == confirm)
                        delete $scope.errors.confirm
                    else
                        $scope.errors.confirm = "Passwords do not match."
                }
        }
    }

    $scope.register = function(user)
    {
        /*
            Notes

            Quick verification client side before sending data to server to reduce bandwith usage and avoiding unecessary server traffic.

            Replace alert() with nice error popups
        */
        if(user != undefined)
        {

            if(Object.keys(user).length == 5)
            {
                console.log(user);
                $http({method: 'post', url: "/api/user/new", data: JSON.stringify(user)}).then(
                    function succ(res)
                    {
                        console.log(res)
                        $scope.$emit('pushAlert', res.data);

                    },
                    function err(err)
                    {
                        $scope.$emit('pushAlert', err.data);
                        console.log(err);
                    }
                )
            }
            else
                $scope.$emit('pushAlert', {type : "warning", title : "Registration" , message: " has failed."})
        }

       /* if(Object.keys($scope.errors).length)
            alert("There are errors");
            */
    }
})