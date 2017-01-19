app.controller('SubController5',['$scope','$rootScope','INQUIRE1','Authenticator', function($scope, $rootScope, INQUIRE1, Authenticator) {

// *****************************************************************************
//  点検開始報告関連処理(処理No:5)
// *****************************************************************************
  $scope.menstartDialog = function(tmpStr) {
//  function menstartDialog(tmpStr) {
    var result_doc = '';
    var latitude4 = '';
    var longitude4 = '';
    var groupno = '';

    if (tmpStr == '1') {
      result_doc = "点検実施開始";
    }
    if (tmpStr == '2') {
      result_doc = "点検実施不可";
    }

    var item = localStorage.getItem("disGROUP");
    if (!item) {
      groupno = "";
    }else{
      var obj = JSON.parse(item);
      groupno = obj.name;
    }

// -----------------------------------------------------------------------------
// ステータスを取得する
    var selectStatus = "";
    var selectDocument = "";
    var item = localStorage.getItem("selectSTATUS");
    if (!item) {
      selectStatus = "7";
      selectDocument = "その他";
    }else{
      var obj = JSON.parse(item);
      selectStatus = obj.name;
      if (selectStatus == "1") { selectDocument = "事務所"; }
      else if (selectStatus == "2") { selectDocument = "点検中"; }
      else if (selectStatus == "3") { selectDocument = "修理中"; }
      else if (selectStatus == "4") { selectDocument = "移動中"; }
      else if (selectStatus == "5") { selectDocument = "休憩中"; }
      else if (selectStatus == "6") { selectDocument = "帰社中"; }
      else {
        selectStatus = "7";
        selectDocument = "その他";
      }
    }

    // -------------------------------------------------------------------------
    //  測位した日時を取得する
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


    ons.notification.confirm({
      title: "点検開始報告",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();
//          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
//          navigator.geolocation.getCurrentPosition(function(position) {
//            var latitude = position.coords.latitude;
//            var longitude = position.coords.longitude;
//            var accuracy = position.coords.accuracy;

// 日本測地系緯度(latitude) =世界測地系緯度 + 0.00010696*世界測地系緯度 - 0.000017467*世界測地系経度 - 0.0046020
// 日本測地系経度(longitude) =世界測地系経度 + 0.000046047*世界測地系緯度 + 0.000083049*世界測地系経度 - 0.010041
//            var latitude2 = latitude + 0.00010696 * latitude - 0.000017467 * longitude - 0.0046020;
//            var longitude2 = longitude + 0.000046047 * latitude + 0.000083049 * longitude - 0.010041;
                        
//            var latitude3 = latitude2 + 0.003229472222;
//            latitude3 = latitude3 * 33554432;
//            latitude3 = latitude3 / 180;
                        
//            var longitude3 = longitude2 - 0.003234;
//            longitude3 = longitude3 * 67108864;
//            longitude3 = longitude3 / 360;
  
//            latitude3 = Math.round(latitude3);
//            longitude3 = Math.round(longitude3);
//            latitude4 = String(latitude3);
//            longitude4 = String(longitude3);

// -----------------------------------------------------------------------------
//  測位誤差から制度を決定する
//　　　　　　var seido = 1;
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

            // -----------------------------------------------
            // データベースに登録

            // -----------------------------------------------
            // MANAGE_NOを決定
//            var MAXNO = 0;

//            var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE1";
//            var SQL = encodeURIComponent(SQLText);
//            var INQuire1 = INQUIRE1.create();
//            promise = INQuire1.find(SQL);
//            promise.then(function(INQuire1s) {
//              MAXNO = INQuire1s[0].CNT;
//              MAXNO = MAXNO + 1;

//              var inquire1 = INQUIRE1.create();
//              inquire1.MANAGE_NO=MAXNO;
//              inquire1.PHONE_NO=$scope.kojinc;
//              inquire1.SEND_DATE=tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
//              inquire1.HTTPRCODE="200";
//              inquire1.GPSDSTS="000";
//              inquire1.LONGITUDE=longitude4;
//              inquire1.LATITUDE=latitude4;
//              inquire1.TIMESTAMP=tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
//              inquire1.ACCURACY=seido;
//              inquire1.RESULT_DATE=tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
//              inquire1.STATUS=selectStatus;
//              inquire1.KOSINBI=tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
//              inquire1.STATUS_DOC=selectDocument;
//              inquire1.SHORI="5";
//              inquire1.RESULT=""+tmpStr;
//              inquire1.RESULT_DOC=result_doc;
//              inquire1.VERSION="2.0.2";
//              inquire1.SKOJIN_C=$scope.kojinc;
//              inquire1.GROUPNO=groupno;
//              promise = inquire1.save();
//              promise.then(function() {
//                loadingModal.hide();
//                ons.notification.alert({ title: "点検開始報告", message: "登録しました" });
//              })
//              .catch(function(error) {
//                loadingModal.hide();
//                ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
//              });
//            })
//            .catch(function(error) {
//              loadingModal.hide();
//              ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
//            });


//          }, function(result) {

            // ---------------------------------------
            // 測位エラーの場合の処理

            // -----------------------------------------------
            // データベースに登録
            // -----------------------------------------------
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
              inquire1.STATUS=selectStatus;
              inquire1.KOSINBI=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
              inquire1.STATUS_DOC=selectDocument;
              inquire1.SHORI="5";
              inquire1.RESULT=""+tmpStr;
              inquire1.RESULT_DOC=result_doc;
              inquire1.VERSION="2.0.2";
              inquire1.SKOJIN_C=$scope.kojinc;
              inquire1.GROUPNO=groupno;
              promise = inquire1.save();
              promise.then(function() {
                loadingModal.hide();
                ons.notification.alert({ title: "点検開始報告", message: "登録しました" });
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


//          }, options);

        }
      }
    });
  }

}]);

