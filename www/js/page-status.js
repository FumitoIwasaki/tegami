app.controller('SubController14',['$scope','$rootScope', function($scope, $rootScope) {

  var selectStatus = "";
  var item = localStorage.getItem("selectSTATUS");
  if (!item) {
    selectStatus = "";
  }else{
    var obj = JSON.parse(item);
    selectStatus = obj.name;
  }
  
  if (selectStatus == "1") {
    $scope.targetStatus1 = "●";
  }else{
    $scope.targetStatus1 = "　";
  }
  if (selectStatus == "2") {
    $scope.targetStatus2 = "●";
  }else{
    $scope.targetStatus2 = "　";
  }
  if (selectStatus == "3") {
    $scope.targetStatus3 = "●";
  }else{
    $scope.targetStatus3 = "　";
  }
  if (selectStatus == "4") {
    $scope.targetStatus4 = "●";
  }else{
    $scope.targetStatus4 = "　";
  }
  if (selectStatus == "5") {
    $scope.targetStatus5 = "●";
  }else{
    $scope.targetStatus5 = "　";
  }
  if (selectStatus == "6") {
    $scope.targetStatus6 = "●";
  }else{
    $scope.targetStatus6 = "　";
  }
  if (selectStatus == "7") {
    $scope.targetStatus7 = "●";
  }else{
    $scope.targetStatus7 = "　";
  }

  $scope.selectStatus = function(tmpStr) {
    var obj = { name: tmpStr };
    localStorage.setItem("selectSTATUS", JSON.stringify(obj));
    if (tmpStr == "1") {
      $scope.targetStatus1 = "●";
      $scope.targetStatus2 = "　";
      $scope.targetStatus3 = "　";
      $scope.targetStatus4 = "　";
      $scope.targetStatus5 = "　";
      $scope.targetStatus6 = "　";
      $scope.targetStatus7 = "　";
    }else if (tmpStr == "2") {
      $scope.targetStatus1 = "　";
      $scope.targetStatus2 = "●";
      $scope.targetStatus3 = "　";
      $scope.targetStatus4 = "　";
      $scope.targetStatus5 = "　";
      $scope.targetStatus6 = "　";
      $scope.targetStatus7 = "　";
    }else if (tmpStr == "3") {
      $scope.targetStatus1 = "　";
      $scope.targetStatus2 = "　";
      $scope.targetStatus3 = "●";
      $scope.targetStatus4 = "　";
      $scope.targetStatus5 = "　";
      $scope.targetStatus6 = "　";
      $scope.targetStatus7 = "　";
    }else if (tmpStr == "4") {
      $scope.targetStatus1 = "　";
      $scope.targetStatus2 = "　";
      $scope.targetStatus3 = "　";
      $scope.targetStatus4 = "●";
      $scope.targetStatus5 = "　";
      $scope.targetStatus6 = "　";
      $scope.targetStatus7 = "　";
    }else if (tmpStr == "5") {
      $scope.targetStatus1 = "　";
      $scope.targetStatus2 = "　";
      $scope.targetStatus3 = "　";
      $scope.targetStatus4 = "　";
      $scope.targetStatus5 = "●";
      $scope.targetStatus6 = "　";
      $scope.targetStatus7 = "　";
    }else if (tmpStr == "6") {
      $scope.targetStatus1 = "　";
      $scope.targetStatus2 = "　";
      $scope.targetStatus3 = "　";
      $scope.targetStatus4 = "　";
      $scope.targetStatus5 = "　";
      $scope.targetStatus6 = "●";
      $scope.targetStatus7 = "　";
    }else if (tmpStr == "7") {
      $scope.targetStatus1 = "　";
      $scope.targetStatus2 = "　";
      $scope.targetStatus3 = "　";
      $scope.targetStatus4 = "　";
      $scope.targetStatus5 = "　";
      $scope.targetStatus6 = "　";
      $scope.targetStatus7 = "●";
    }
  }

}]);