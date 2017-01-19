app.controller('SubController4',['$scope','$rootScope', function($scope, $rootScope) {

// *****************************************************************************
//  グループ登録関連処理
// *****************************************************************************

  $scope.groupDialog = function() {
//function groupDialog() {
    var tmpStr = document.SendData.groupinp.value;
        
    if (isFinite(tmpStr) == false) {
      ons.notification.alert({ title: "エラー", message: "グループは数字のみの入力となっています。"　});
      return false;
    }
    if (tmpStr.length < 1 || tmpStr.length > 2) {
      ons.notification.alert({ title: "エラー", message: "グループ番号は01 ~ 99までの数値を入力願います。"});
      return false;
    }
        
    if (tmpStr.length == 1) {
      tmpStr = '0' + tmpStr;
    }
        
    ons.notification.confirm({
      title: "グループ登録",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          groupdata = tmpStr;
          document.getElementById("groupdisp").textContent = groupdata;

          var obj = { name: groupdata };
          localStorage.setItem("disGROUP", JSON.stringify(obj));

//                    ons.notification.alert({ title: "", message: "登録しました" });
          app.navi.popPage();
        }
      }
    });
  }

}]);
