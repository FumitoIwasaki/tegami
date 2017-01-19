app.controller('MainController',['$scope','$rootScope','GPSDSTS','INQUIRE','PHONEINF','SettingsService','Authenticator', function($scope, $rootScope, GPSDSTS, INQUIRE, PHONEINF, SettingsService, Authenticator) {



// *****************************************************************************
// 現在の年、月、日を取得
// *****************************************************************************
  //loadingModal.show(); //ぐるぐる回るやつ
  $scope.targetDate = new Date();
  var tmpYear = $scope.targetDate.getFullYear();
  var tmpMonth = $scope.targetDate.getMonth()+1;
  var tmpDay = $scope.targetDate.getDate();

  if (tmpMonth < 10) {
    tmpMonth = '0' + tmpMonth;
  }
  if (tmpDay < 10) {
    tmpDay = '0' + tmpDay;
  }

  var tmpYyyyMm = ""+tmpYear+tmpMonth;
  var tmpYyyyMmDd = ""+tmpYear+tmpMonth+tmpDay;

//ons.notification.alert({ message: tmpYear+tmpMonth+tmpDay });



// *****************************************************************************
//  ログイン機能を実装するまで個人コードならびに氏名を固定とする
// *****************************************************************************
//  $rootScope.kojinc = '9999';
//  $rootScope.simei = '富士太郎';

// *****************************************************************************
//  位置情報取得関連処理
//    緯度           : latitude3
//    経度           : longitude3
//    測位精度       : seido
//    測位日時       : tmpYear , tmpMonth , tmpDay , tmpHour , tmpMinutes , tmpSeconds
//    ログイン者情報 : $scope.kojinc , $scope.simei
// *****************************************************************************
  $scope.GPSlocationsearch = function() {
    ons.notification.confirm({
      title: "GPS位置検索",
      message: "報告してもよろしいですか",
      buttonLabels: ["いいえ", "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();

          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
          navigator.geolocation.getCurrentPosition(function(position) {

            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var accuracy = position.coords.accuracy;

// -----------------------------------------------------------------------------
// 世界測地系から日本測地系に変更
// 日本測地系緯度(latitude) =世界測地系緯度 + 0.00010696*世界測地系緯度 - 0.000017467*世界測地系経度 - 0.0046020
// 日本測地系経度(longitude) =世界測地系経度 + 0.000046047*世界測地系緯度 + 0.000083049*世界測地系経度 - 0.010041
            var latitude2 = latitude + 0.00010696 * latitude - 0.000017467 * longitude - 0.0046020;
            var longitude2 = longitude + 0.000046047 * latitude + 0.000083049 * longitude - 0.010041;
//ons.notification.alert({ message: latitude + '->' + latitude2 });
//ons.notification.alert({ message: longitude + '->' + longitude2 });
                        
// -----------------------------------------------------------------------------
//  日本測地系からKDDIの測位値体系に変更
            var latitude3 = latitude2 + 0.003229472222;
            latitude3 = latitude3 * 33554432;
            latitude3 = latitude3 / 180;
                        
            var longitude3 = longitude2 - 0.003234;
            longitude3 = longitude3 * 67108864;
            longitude3 = longitude3 / 360;
  
//ons.notification.alert({ message: latitude + '->' + latitude2 + '->' + latitude3 });
//ons.notification.alert({ message: longitude + '->' + longitude2 + '->' + longitude3 });
                        
            latitude3 = Math.round(latitude3);
            longitude3 = Math.round(longitude3);

//ons.notification.alert({ message: 'latitude3=' + latitude3 + '::longitude3=' + longitude3 });

// -----------------------------------------------------------------------------
//  測位誤差から精度を決定する
　　　　　　var seido = 1;
            if (accuracy <= 50) {
              seido = 6;
            }
            else if (51 <= accuracy && accuracy <= 400) {
              seido = 5;
            }
            else if (401 <= accuracy && accuracy <= 600) {
              seido = 4;
            }
            else if (601 <= accuracy && accuracy <= 1000) {
              seido = 3;
            }
            else if (1001 <= accuracy) {
              seido = 2;
            }

//ons.notification.alert({ message: 'seido=' + seido });

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
              else { selectDocument = "その他"; }
            }

// -----------------------------------------------------------------------------
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

//ons.notification.alert({ message: tmpYear + tmpMonth + tmpDay + tmpHour + tmpMinutes + tmpSeconds });
//ons.notification.alert({ message: $scope.kojinc + '::' + $scope.simei });



// ----------------------------------------------------------------------------
//  PHONEINF への登録

            var SQLText = "select PHONE_NO,VERSION,STATUS from PHONEINF where PHONE_NO='"+$scope.kojinc+"'";
            var SQL = encodeURIComponent(SQLText);
            var PHONEinf = PHONEINF.create();
            promise = PHONEinf.find(SQL);
            promise.then(function(PHONEinfs) {
//console.log(PHONEinfs.length);
              if (PHONEinfs.length > 0) {
                var Phone_no = PHONEinfs[0].PHONE_NO;
                var Version = PHONEinfs[0].VERSION;
                var Pstatus = PHONEinfs[0].STATUS;
                if (Phone_no == $scope.kojinc) {
                  if ((Version != "2.0.2") || (Pstatus != "1")) {
                    var SQL = "PHONE_NO="+$scope.kojinc;
                    var phoneinf = PHONEINF.create();
                    phoneinf.PHONE_NO=$scope.kojinc;
                    phoneinf.STATUS="1";
                    phoneinf.VERSION="2.0.2";
                    promise = phoneinf.update(SQL);
                    promise.then(function() {
//console.log("PHONEINF成功");
                    })
                    .catch(function(error) {
//console.log("PHONEINF失敗");
                    });
                  }
                }
              }else{
                var phoneinf = PHONEINF.create();
                phoneinf.PHONE_NO=$scope.kojinc;
                phoneinf.KOJIN_C=$scope.kojinc;
                phoneinf.STATUS="1";
                phoneinf.KOSINBI=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
                phoneinf.KOSIN_KJC=$scope.kojinc;
                phoneinf.KOSIN_NAME=$scope.simei;
                phoneinf.VERSION="2.0.2";
                promise = phoneinf.save();
                promise.then(function() {
                })
                .catch(function(error) {
                });
              }
            })
            .catch(function(error) {
//console.log("SELECT失敗");
            });

// -----------------------------------------------------------------------------
// MANAGE_NOを決定
            var MAXNO = 0;

            var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE";
            var SQL = encodeURIComponent(SQLText);
            var INQuire = INQUIRE.create();
            promise = INQuire.find(SQL);
            promise.then(function(INQuires) {
              MAXNO = INQuires[0].CNT;
              MAXNO = MAXNO + 1;
//ons.notification.alert({ message: MAXNO });

// -----------------------------------------------------------------------------
// データベースへの書き込み

              var inquire = INQUIRE.create();
              inquire.MANAGE_NO=MAXNO;
              inquire.PHONE_NO=$scope.kojinc;
              inquire.SEND_DATE=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
              inquire.HTTPRCODE="200";
              inquire.GPSDSTS="000";
              inquire.LONGITUDE=longitude3;
              inquire.LATITUDE=latitude3;
              inquire.TIMESTAMP=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
              inquire.ACCURACY=seido;
              inquire.RESULT_DATE=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
//              inquire.STATUS="7";
              inquire.STATUS=selectStatus;
              inquire.KOSINBI=""+tmpYear+tmpMonth+tmpDay+tmpHour+tmpMinutes+tmpSeconds;
//              inquire.STATUS_DOC="その他";
              inquire.STATUS_DOC=selectDocument;
              inquire.SHORI="1";
              inquire.VERSION="2.0.2";
              inquire.SKOJIN_C=$scope.kojinc;
              promise = inquire.save();
              promise.then(function() {
                loadingModal.hide();
                ons.notification.alert({ title: "GPS位置検索", message: "登録しました" });
              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
    	      });
            })
            .catch(function(error) {
              loadingModal.hide();
              ons.notification.alert({ title: "エラー", message: "データベースへの接続に失敗しました" });
            });

//console.log(latitude3);
//console.log(longitude3);
//console.log(seido);

          }, function(result) {

// -----------------------------------------------------------------------------
// 測位失敗時の処理（エラー表示）
            loadingModal.hide();
            onError(result);

          }, options);
        }
      }
    })
  }

// *****************************************************************************
//  メインメニューから広域災害状況報告をクリックした場合の処理
// *****************************************************************************
  $scope.Disaster = function() {
    app.navi.pushPage('disindex.html');
    $(document).on('pageinit','#disindex', function() {
      var groupno = "";
      var item = localStorage.getItem("disGROUP");
      if (!item) {
        groupno = "";
      }else{
        var obj = JSON.parse(item);
        groupno = obj.name;
      }
      document.getElementById("groupdisp").textContent = groupno;
    })
  }

// *****************************************************************************
//  ログアウトをクリックした場合の処理
// *****************************************************************************
  $scope.logout = function() {
    ons.notification.confirm({
      title: "Pick&Ship",
      message: "ログアウトします。よろしいですか？",
      buttonLabels: ["いいえ", "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
//          var loginScope = sharedScopes3["Login"];
          var loginScope = SettingsService.getSharedScope("Login");
          if (loginScope != void 0) {
            loginScope.logoutFromGoogle();
          }
        }
      }
    });
  }

}]);

app.controller('MainController2',['$scope','$rootScope', function($scope, $rootScope) {
}]);
