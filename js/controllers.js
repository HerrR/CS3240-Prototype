app.controller('AppCtrl', function ($scope, Model, $location) {
    $scope.message = function(){
        return Model.getMessage();
    }

});

app.controller('homeScreenCtrl', function ($scope, Model, $location) {

});