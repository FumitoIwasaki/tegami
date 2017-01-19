app.controller('SubController11',['$scope','$rootScope','INQUIRE1','Authenticator', function($scope, $rootScope, INQUIRE1, Authenticator) {
// -----------------------------------------------------------------------------
//  広域災害状況報告：ESC：詳細被害報告画面での報告時の処理

  $scope.disescDialog3 = function(tmpStr) {
    var result_doc = '';
    var latitude4 = '';
    var longitude4 = '';
    var damage_doc = '';
    var seido = '';

    if (tmpStr == '10') { damage_doc = "トラスの位置ずれ"; }
    if (tmpStr == '11') { damage_doc = "トラス本体の落下"; }
    if (tmpStr == '12') { damage_doc = "トラスの変形"; }
    if (tmpStr == '20') { damage_doc = "欄干(ｶﾞﾗｽ,ﾊﾟﾈﾙ)の破損,脱落,位置ずれ"; }
    if (tmpStr == '21') { damage_doc = "欄干照明の落下"; }
    if (tmpStr == '22') { damage_doc = "移動手すり用ﾚｰﾙ曲がり,破損"; }
    if (tmpStr == '23') { damage_doc = "ﾃﾞｯｷﾎﾞｰﾄﾞ,ｽｶｰﾄｶﾞｰﾄﾞの曲がり,破損"; }
    if (tmpStr == '30') { damage_doc = "ｽﾃｯﾌﾟの破損"; }
    if (tmpStr == '31') { damage_doc = "ﾗﾝﾃﾞｨﾝｸﾞﾌﾟﾚｰﾄの破損"; }
    if (tmpStr == '40') { damage_doc = "制御盤の移動,落下"; }
    if (tmpStr == '41') { damage_doc = "駆動機の移動,落下"; }
    if (tmpStr == '42') { damage_doc = "ﾁｪｰﾝ類の切断,破損"; }
    if (tmpStr == '50') { damage_doc = "冠水,浸水または津波による被害"; }
    if (tmpStr == '60') { damage_doc = "その他外部要因による損傷"; }
    if (tmpStr == '61') { damage_doc = "外装板,外装照明の外れ,脱落"; }
    if (tmpStr == '62') { damage_doc = "利用者に対する安全対策(三角部ｶﾞｰﾄﾞ等)の脱落"; }
    if (tmpStr == '70') { damage_doc = "その他"; }

    var item = localStorage.getItem("disTOROKU");
    var obj1 = JSON.parse(item);

    var item = localStorage.getItem("disRESULT");
    var obj2 = JSON.parse(item);

    if (obj2.disresult == '03') { result_doc = "完全復旧(被害あり)"; }
    if (obj2.disresult == '11') { result_doc = "応急復旧"; }
    if (obj2.disresult == '21') { result_doc = "未復旧(機器破損)"; }

    ons.notification.confirm({
      title: "広域災害状況報告",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();

// -----------------------------------------------------------------------------
//  日時を取得する
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
            inquire1.TOROKU=obj1.torokuno;
            inquire1.RESULT=obj2.disresult;
            inquire1.RESULT_DOC=result_doc;
            inquire1.VERSION="2.0.2";
            inquire1.SKOJIN_C=$scope.kojinc;
            inquire1.KISHU="2";
            inquire1.DAMAGE=tmpStr;
            inquire1.DAMAGE_DOC=damage_doc;
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
  
//                        ons.notification.alert({ message: latitude + '->' + latitude2 + '->' + latitude3 });
//                        ons.notification.alert({ message: longitude + '->' + longitude2 + '->' + longitude3 });
                        
//            latitude3 = Math.round(latitude3);
//            longitude3 = Math.round(longitude3);
//            latitude4 = String(latitude3);
//            longitude4 = String(longitude3);

//                        ons.notification.alert({ message: latitude + '->' + latitude2 + '->' + latitude4 });
//                        ons.notification.alert({ message: longitude + '->' + longitude2 + '->' + longitude4 });
//ons.notification.alert({ message: tmpStr + ':' + damage_doc + ':' + obj2.disresult + ':' + result_doc + ':' + obj1.torokuno + ':' + latitude4 + ':' + longitude4 });

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
//ons.notification.alert({ message: tmpStr + ':' + damage_doc + ':' + obj2.disresult + ':' + result_doc + ':' + obj1.torokuno + ':' + latitude4 + ':' + longitude4 });

//            loadingModal.hide();
            // -----------------------------------------------
            // データベースに登録


//          }, options);

//          ons.notification.alert({ title: "確認", message: "登録しました" });
          app.navi.popPage();
          app.navi.popPage();
        }
      }
    });

  }

}]);