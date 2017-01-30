yachtApp.controller('RoomController', function RoomController($scope) {
  $.getJSON("/users", function(data){
    console.log(data.users);
    $scope.users = data.users;
    $scope.$apply();
  });
});
