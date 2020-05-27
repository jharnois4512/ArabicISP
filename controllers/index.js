var VLogin = angular.module('indexBody',[]);

VLogin.controller('indexCtrl', ['$scope',function($scope) {
    $scope.clicked = function(){   
        window.location = 'arabic';
    }
}]);