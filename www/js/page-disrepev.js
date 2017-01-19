app.controller('SubController8',['$scope','$rootScope','INQUIRE1','Authenticator', function($scope, $rootScope, INQUIRE1, Authenticator) {

// -----------------------------------------------------------------------------
//  広域災害状況報告：EV：初期画面での報告時の処理

  $scope.disevDialog1 = function(tmpStr) {
    var result_doc = '';
    var latitude4 = '';
    var longitude4 = '';
    var seido = '';

    if (tmpStr == '01') { result_doc = "非停止(正常運転)"; }
    if (tmpStr == '02') { result_doc = "完全復旧(被害なし)"; }
    if (tmpStr == '22') { result_doc = "未復旧(停電)"; }
    if (tmpStr == '23') { result_doc = "未復旧(建物封鎖)"; }
    if (tmpStr == '24') { result_doc = "未復旧(地域封鎖)"; }
    if (tmpStr == '31') { result_doc = "建物損壊"; }
    if (tmpStr == '41') { result_doc = "状態不明(建物閉鎖)"; }
    if (tmpStr == '42') { result_doc = "状態不明(地域閉鎖)"; }

    var item = localStorage.getItem("disTOROKU");
    var obj = JSON.parse(item);

    ons.notification.confirm({
      title: "広域災害状況報告",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();

          var tmpDeparture = new Date();
          var tmpYear = tmpDeparture.getFullYear();
          var tmpMonth = tmpDeparture.getMonth()+1;
          var tmpDay = tmpDeparture.getDate();
          var tmpHour = tmpDeparture.getHours();
          var tmpMinutes = tmpDeparture.getMinutes();
          var tmpSeconds = tmpDeparture.getSeconds();

          if (tmpMonth < 10) {
            tmpMonth = '0' + tmpMonth;
          }
          if (tmpDay < 10) {
            tmpDay = '0' + tmpDay;
          }
          if (tmpHour < 10) {
            tmpHour = '0' + tmpHour;
          }
          if (tmpMinutes < 10) {
            tmpMinutes = '0' + tmpMinutes;
          }
          if (tmpSeconds < 10) {
            tmpSeconds = '0' + tmpSeconds;
          }

//ons.notification.alert({ message: tmpYear + tmpMonth + tmpDay + tmpHour + tmpMinutes + tmpSeconds });
//ons.notification.alert({ message: $scope.kojinc + ':' + obj.torokuno + ':' + $scope.simei });

          // -------------------------------------------------------------------
          // データベースに登録
          // -------------------------------------------------------------------
          // MANAGE_NOを決定
          var MAXNO = 0;


          var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE1";
          var SQL = encodeURIComponent(SQLText);
          var INQuire1 = INQUIRE1.create();
          promise = INQuire1.find(SQL);
          promise.then(function(INQuire1s) {
            MAXNO = INQuire1s[0].CNT;
            MAXNO = MAXNO + 1;
//ons.notification.alert({ message: MAXNO });

            var inquire1 = INQUIRE1.create();
            inquire1.MANAGE_NO=MAXNO;
            inquire1.PHONE_NO=$scope.kojinc;
            inquire1.SEND_DATE=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
            inquire1.RESULT_DATE=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
            inquire1.STATUS="7";
            inquire1.KOSINBI=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
            inquire1.STATUS_DOC="その他";
            inquire1.SHORI="4";
            inquire1.TOROKU=obj.torokuno;
            inquire1.RESULT=""+tmpStr;
            inquire1.RESULT_DOC=result_doc;
            inquire1.VERSION="2.0.2";
            inquire1.SKOJIN_C=$scope.kojinc;
            inquire1.KISHU="1";
            promise = inquire1.save();
            promise.then(function() {
              loadingModal.hide();
              ons.notification.alert({ title: "広域災害状況報告", message: "登録しました" });
            })
            .catch(function(error) {
              loadingModal.hide();
              ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
            });
          })
          .catch(function(error) {
            loadingModal.hide();
            ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
          });








//          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
//          navigator.geolocation.getCurrentPosition(function(position) {
//                        ons.notification.alert({ message: position.coords.latitude });
//                        ons.notification.alert({ message: position.coords.longitude });
//            var latitude = position.coords.latitude;
//            var longitude = position.coords.longitude;
//            var accuracy = position.coords.accuracy;

// 日本測地系緯度(latitude) =世界測地系緯度 + 0.00010696*世界測地系緯度 - 0.000017467*世界測地系経度 - 0.0046020
// 日本測地系経度(longitude) =世界測地系経度 + 0.000046047*世界測地系緯度 + 0.000083049*世界測地系経度 - 0.010041
//            var latitude2 = latitude + 0.00010696 * latitude - 0.000017467 * longitude - 0.0046020;
//            var longitude2 = longitude + 0.000046047 * latitude + 0.000083049 * longitude - 0.010041;
//                        ons.notification.alert({ message: latitude + '->' + latitude2 });
//                        ons.notification.alert({ message: longitude + '->' + longitude2 });
                        
//            var latitude3 = latitude2 + 0.003229472222;
//            latitude3 = latitude3 * 33554432;
//            latitude3 = latitude3 / 180;
                        
//            var longitude3 = longitude2 - 0.003234;
//            longitude3 = longitude3 * 67108864;
//            longitude3 = longitude3 / 360;
  
//                       ons.notification.alert({ message: latitude + '->' + latitude2 + '->' + latitude3 });
//                        ons.notification.alert({ message: longitude + '->' + longitude2 + '->' + longitude3 });
                        
//            latitude3 = Math.round(latitude3);
//            longitude3 = Math.round(longitude3);
//            latitude4 = String(latitude3);
//            longitude4 = String(longitude3);

//                        ons.notification.alert({ message: latitude + '->' + latitude2 + '->' + latitude4 });
//                        ons.notification.alert({ message: longitude + '->' + longitude2 + '->' + longitude4 });
//ons.notification.alert({ message: tmpStr + ':' + result_doc + ':' + obj.torokuno + ':' + latitude4 + ':' + longitude4 });

// -----------------------------------------------------------------------------
//  測位誤差から制度を決定する
//            var seido = 1;
//            if (accuracy <= 50) {
//              seido = 6;
//            }
//            else if (51 <= accuracy && accuracy <= 400) {
//              seido = 5;
//            }
//            else if (401 <= accuracy && accuracy <= 600) {
//              seido = 4;
//            }
//            else if (601 <= accuracy && accuracy <= 1000) {
//              seido = 3;
//            }
//            else if (1001 <= accuracy) {
//              seido = 2;
//            }

//ons.notification.alert({ message: 'seido=' + seido });

//            loadingModal.hide();

            // -----------------------------------------------
            // データベースに登録


//          }, function(result) {
//ons.notification.alert({ message: tmpStr + ':' + result_doc + ':' + obj.torokuno + ':' + latitude4 + ':' + longitude4 });

//            loadingModal.hide();

            // -----------------------------------------------
            // データベースに登録


//          }, options);
  
          app.navi.popPage();
        }
      }
    });

  }

// -----------------------------------------------------------------------------
//  広域災害状況報告：EV：初期画面から詳細報告画面に遷移する場合の処理

  $scope.disevDialog2 = function(tmpStr) {
    var obj = { disresult: tmpStr };
    localStorage.setItem("disRESULT", JSON.stringify(obj));

    app.navi.pushPage('disrepevdetail.html', { animation : 'slide' } );
  }

}]);
