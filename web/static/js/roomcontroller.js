yachtApp.controller('RoomController', function RoomController($scope) {
  $.getJSON("/users", function(data){
    $scope.users = data.users;
    $scope.$apply();
  });
});
