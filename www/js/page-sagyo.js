app.controller('SubController2',['$scope','$rootScope','$timeout','INQUIRE','INQUIRE2','PHONEINF','Authenticator', function($scope, $rootScope, $timeout, INQUIRE, INQUIRE2, PHONEINF, Authenticator) {

// *****************************************************************************
// 動静報告画面を表示したときに各欄の時間を抽出するための処理
// *****************************************************************************
  loadingModal.show();
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

//alert(tmpYear+tmpMonth+tmpDay);


  var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
              + "CASE "
              + "WHEN SAGYO1 IS NOT NULL THEN substr(SAGYO1,9,2) || ':' || substr(SAGYO1,11,2) "
              + "ELSE '' "
              + "END DEPARTURE, "
              + "CASE "
              + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN substr(SAGYO2,9,2) || ':' || substr(SAGYO2,11,2) "
              + "ELSE '' "
              + "END ARRIVE, "
              + "CASE "
              + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN substr(SAGYO3,9,2) || ':' || substr(SAGYO3,11,2) "
              + "ELSE '' "
              + "END STARTING, "
              + "CASE "
              + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN substr(SAGYO4,9,2) || ':' || substr(SAGYO4,11,2) "
              + "ELSE '' "
              + "END FINISH "
              + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
              + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
              + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
              + "from "
              + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
              + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
              + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//              + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
              + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
              + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
              + "where "
              + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
              + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
              + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
              + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//              + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
              + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
              + "and a.KOBAN='"+$scope.targetKoban+"' and a.KAISU='"+$scope.targetOiban+"' and a.YTANTO='"+$scope.targetGroupno+"' "
              + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
              + "order by a.KOBAN "
              + ") ";

//alert(SQLText);
  var SQL = encodeURIComponent(SQLText);
  var INQuire = INQUIRE.create();
  promise = INQuire.find(SQL);
  promise.then(function(INQuires) {
    $scope.targetDeparture = INQuires[0].DEPARTURE;
    $scope.targetArrival = INQuires[0].ARRIVE;
    $scope.targetStarting = INQuires[0].STARTING;
    $scope.targetEnd = INQuires[0].FINISH;
    loadingModal.hide();
  })
  .catch(function(error) {
    loadingModal.hide();
    ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
  });



// *****************************************************************************
//  出発ボタンをクリックしたときの処理
// *****************************************************************************
  $scope.DepartureDialog = function() {
    ons.notification.confirm({
      title: "作業時間報告(出発)",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      animation: 'default', // もしくは'none'
      primaryButtonIndex: 1,
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();


          // -----------------------------------------------------------------
          // 報告対象日付を取得する
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

          // -----------------------------------------------------------------
          // 報告日時を取得する
          var tmpDeparture = new Date();
          var tmpYear1 = tmpDeparture.getFullYear();
          var tmpMonth1 = tmpDeparture.getMonth()+1;
          var tmpDay1 = tmpDeparture.getDate();
          var tmpHour1 = tmpDeparture.getHours();
          var tmpMinutes1 = tmpDeparture.getMinutes();
          var tmpSeconds1 = tmpDeparture.getSeconds();

          if (tmpMonth1 < 10) {
            tmpMonth1 = '0' + tmpMonth1;
          }
          if (tmpDay1 < 10) {
            tmpDay1 = '0' + tmpDay1;
          }
          if (tmpHour1 < 10) {
            tmpHour1 = '0' + tmpHour1;
          }
          if (tmpMinutes1 < 10) {
            tmpMinutes1 = '0' + tmpMinutes1;
          }
          if (tmpSeconds1 < 10) {
            tmpSeconds1 = '0' + tmpSeconds1;
          }

          // -------------------------------------------------------------------
          // 緯度・経度の登録
 
          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
          navigator.geolocation.getCurrentPosition(function(position) {

//ons.notification.alert({ message: position.coords.latitude });
//ons.notification.alert({ message: position.coords.longitude });
//ons.notification.alert({ message: position.coords.accuracy });

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
//  測位誤差から制度を決定する
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
//ons.notification.alert({ message: tmpYear1 + tmpMonth1 + tmpDay1 + tmpHour1 + tmpMinutes1 + tmpSeconds1 });
//ons.notification.alert({ message: $scope.kojinc + '::' + $scope.simei });

// ----------------------------------------------------------------------------
// ステータスの変更
            var obj = { name: "4" };
            localStorage.setItem("selectSTATUS", JSON.stringify(obj));

// ----------------------------------------------------------------------------
// データベースへの書き込み

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

              var inquire = INQUIRE.create();
              inquire.MANAGE_NO=MAXNO;
              inquire.PHONE_NO=$scope.kojinc;
              inquire.SEND_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.HTTPRCODE="200";
              inquire.GPSDSTS="000";
              inquire.LONGITUDE=longitude3;
              inquire.LATITUDE=latitude3;
              inquire.TIMESTAMP=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.ACCURACY=seido;
              inquire.RESULT_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS="4";
              inquire.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS_DOC="移動中";
              inquire.SHORI="1";
              inquire.VERSION="2.0.2";
              inquire.SKOJIN_C=$scope.kojinc;
              promise = inquire.save();
              promise.then(function() {
              })
              .catch(function(error) {
              });
            })
            .catch(function(error) {
            });

          }, function(result) {
            // 動静管理の処理を行うためエラー処理は行わない
          }, options);

// ----------------------------------------------------------------------------
//  PHONEINF への登録

          var SQLText = "select PHONE_NO,VERSION,STATUS from PHONEINF where PHONE_NO='"+$scope.kojinc+"'";
          var SQL = encodeURIComponent(SQLText);
          var PHONEinf = PHONEINF.create();
          promise = PHONEinf.find(SQL);
          promise.then(function(PHONEinfs) {
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
              phoneinf.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
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

// *****************************************************************************
// 上記が緯度・経度を取得、データベースへの書き込み処理
// 下記は動静管理データベースへの書き込み処理
// *****************************************************************************

// -----------------------------------------------------------------------------
// MANAGE_NOを決定
          var MAXNO = 0;

          var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE2";
          var SQL = encodeURIComponent(SQLText);
          var INQuire2 = INQUIRE2.create();
          promise = INQuire2.find(SQL);
          promise.then(function(INQuire2s) {
            MAXNO = INQuire2s[0].CNT;
            MAXNO = MAXNO + 1;
//ons.notification.alert({ message: MAXNO });

            if ($scope.mySwitch.isChecked() == true) {
//ons.notification.alert({ message: '同一グループ内の分も書き込みする'});

              SQLText = "select YOTEI_KJC from MISUSER.YOTEI_DK c "
//                      + "where c.YOTEI_YM='"+tmpYear+tmpMonth+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "where c.YOTEI_YM='"+tmpYyyyMm+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "and c.YTANTO='"+$scope.targetGroupno+"' and c.YGROUP in ( "
                      + "select a.YGROUP "
                      + "from MISUSER.YOTEI_DK a,MISUSER.YOTEI_DG b "
                      + "where b.YOTEI_YM = a.YOTEI_YM and b.YOTEI_D = a.YOTEI_D and b.YTANTO = a.YTANTO and b.YGROUP = a.YGROUP "
//                      + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YTANTO='"+$scope.targetGroupno+"' "
                      + "and a.YOTEI_KJC='"+$scope.kojinc+"' "
                      + "and b.KOBAN='"+$scope.targetKoban+"' "
                      + "and b.KAISU='"+$scope.targetOiban+"')";

//alert(SQLText);
              var SQL = encodeURIComponent(SQLText);
              var PHONEinf = PHONEINF.create();
              promise = PHONEinf.find(SQL);
              promise.then(function(PHONEinfs) {
                var Cnt = PHONEinfs.length;
//alert(Cnt);
                for (i=0; i < Cnt; i++) {
//alert(PHONEinfs[i].YOTEI_KJC);
                  var inquire2 = INQUIRE2.create();
                  inquire2.MANAGE_NO=MAXNO;
                  inquire2.PHONE_NO=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOJIN_C=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOBAN=$scope.targetKoban;
                  inquire2.YTANTO=$scope.targetGroupno;
                  inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
                  inquire2.KAISU=$scope.targetOiban;
                  inquire2.SAGYOCODE="1";
                  inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
                  inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
                  inquire2.ORIGINAL=$scope.kojinc;
                  inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire2.VERSION="2.0.2";
                  promise = inquire2.save();
                  promise.then(function() {
                  })
                  .catch(function(error) {
                  });
                }
                $timeout(
                  function() {
                    $scope.targetDeparture = tmpHour1 + ':' + tmpMinutes1;
                    $scope.targetArrival = "";
                    $scope.targetStarting = "";
                    $scope.targetEnd = "";
                  }, 1000);
                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });
                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });

              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
              });

            }else{
//ons.notification.alert({ message: '書き込まない' });

              var inquire2 = INQUIRE2.create();
              inquire2.MANAGE_NO=MAXNO;
              inquire2.PHONE_NO=$scope.kojinc;
              inquire2.KOJIN_C=$scope.kojinc;
              inquire2.KOBAN=$scope.targetKoban;
              inquire2.YTANTO=$scope.targetGroupno;
              inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
              inquire2.KAISU=$scope.targetOiban;
              inquire2.SAGYOCODE="1";
              inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
              inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
              inquire2.ORIGINAL=$scope.kojinc;
              inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire2.VERSION="2.0.2";
              promise = inquire2.save();
              promise.then(function() {
                $timeout(
                  function() {
                    $scope.targetDeparture = tmpHour1 + ':' + tmpMinutes1;
                    $scope.targetArrival = "";
                    $scope.targetStarting = "";
                    $scope.targetEnd = "";
                  }, 1000);


                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });

                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });
              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
              });
            }
          })
          .catch(function(error) {
            loadingModal.hide();
            ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
          });

        }
      }
    });
  }



// *****************************************************************************
//  到着ボタンをクリックしたときの処理
// *****************************************************************************
  $scope.ArrivalDialog = function() {
    var tmpDep = $scope.targetDeparture;
    if (tmpDep == null) {
      ons.notification.alert({ title: "エラー", message: "出発を登録してください"});
      return false;
    }

    ons.notification.confirm({
      title: "作業時間報告(到着)",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();


          // -----------------------------------------------------------------
          // 報告対象日付を取得する
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

          // -----------------------------------------------------------------
          // 報告日時を取得する
          var tmpDeparture = new Date();
          var tmpYear1 = tmpDeparture.getFullYear();
          var tmpMonth1 = tmpDeparture.getMonth()+1;
          var tmpDay1 = tmpDeparture.getDate();
          var tmpHour1 = tmpDeparture.getHours();
          var tmpMinutes1 = tmpDeparture.getMinutes();
          var tmpSeconds1 = tmpDeparture.getSeconds();

          if (tmpMonth1 < 10) {
            tmpMonth1 = '0' + tmpMonth1;
          }
          if (tmpDay1 < 10) {
            tmpDay1 = '0' + tmpDay1;
          }
          if (tmpHour1 < 10) {
            tmpHour1 = '0' + tmpHour1;
          }
          if (tmpMinutes1 < 10) {
            tmpMinutes1 = '0' + tmpMinutes1;
          }
          if (tmpSeconds1 < 10) {
            tmpSeconds1 = '0' + tmpSeconds1;
          }

          // -------------------------------------------------------------------
          // 緯度・経度の登録
 
          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
          navigator.geolocation.getCurrentPosition(function(position) {

//ons.notification.alert({ message: position.coords.latitude });
//ons.notification.alert({ message: position.coords.longitude });
//ons.notification.alert({ message: position.coords.accuracy });

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
//  測位誤差から制度を決定する
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
//ons.notification.alert({ message: tmpYear1 + tmpMonth1 + tmpDay1 + tmpHour1 + tmpMinutes1 + tmpSeconds1 });
//ons.notification.alert({ message: $scope.kojinc + '::' + $scope.simei });

// ----------------------------------------------------------------------------
// ステータスの変更
            var obj = { name: "2" };
            localStorage.setItem("selectSTATUS", JSON.stringify(obj));

// ----------------------------------------------------------------------------
// データベースへの書き込み

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

              var inquire = INQUIRE.create();
              inquire.MANAGE_NO=MAXNO;
              inquire.PHONE_NO=$scope.kojinc;
              inquire.SEND_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.HTTPRCODE="200";
              inquire.GPSDSTS="000";
              inquire.LONGITUDE=longitude3;
              inquire.LATITUDE=latitude3;
              inquire.TIMESTAMP=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.ACCURACY=seido;
              inquire.RESULT_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS="2";
              inquire.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS_DOC="点検中";
              inquire.SHORI="1";
              inquire.VERSION="2.0.2";
              inquire.SKOJIN_C=$scope.kojinc;
              promise = inquire.save();
              promise.then(function() {
              })
              .catch(function(error) {
              });
            })
            .catch(function(error) {
            });

          }, function(result) {
            // 動静管理の処理を行うためエラー処理は行わない
          }, options);

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
              phoneinf.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
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

// *****************************************************************************
// 上記が緯度・経度を取得、データベースへの書き込み処理
// 下記は動静管理データベースへの書き込み処理
// *****************************************************************************

// -----------------------------------------------------------------------------
// MANAGE_NOを決定
          var MAXNO = 0;

          var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE2";
          var SQL = encodeURIComponent(SQLText);
          var INQuire2 = INQUIRE2.create();
          promise = INQuire2.find(SQL);
          promise.then(function(INQuire2s) {
            MAXNO = INQuire2s[0].CNT;
            MAXNO = MAXNO + 1;
//ons.notification.alert({ message: MAXNO });

            if ($scope.mySwitch.isChecked() == true) {
//ons.notification.alert({ message: '同一グループ内の分も書き込みする'});

              SQLText = "select YOTEI_KJC from MISUSER.YOTEI_DK c "
//                      + "where c.YOTEI_YM='"+tmpYear+tmpMonth+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "where c.YOTEI_YM='"+tmpYyyyMm+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "and c.YTANTO='"+$scope.targetGroupno+"' and c.YGROUP in ( "
                      + "select a.YGROUP "
                      + "from MISUSER.YOTEI_DK a,MISUSER.YOTEI_DG b "
                      + "where b.YOTEI_YM = a.YOTEI_YM and b.YOTEI_D = a.YOTEI_D and b.YTANTO = a.YTANTO and b.YGROUP = a.YGROUP "
//                      + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YTANTO='"+$scope.targetGroupno+"' "
                      + "and a.YOTEI_KJC='"+$scope.kojinc+"' "
                      + "and b.KOBAN='"+$scope.targetKoban+"' "
                      + "and b.KAISU='"+$scope.targetOiban+"')";

//alert(SQLText);
              var SQL = encodeURIComponent(SQLText);
              var PHONEinf = PHONEINF.create();
              promise = PHONEinf.find(SQL);
              promise.then(function(PHONEinfs) {
                var Cnt = PHONEinfs.length;
//alert(Cnt);
                for (i=0; i < Cnt; i++) {
//alert(PHONEinfs[i].YOTEI_KJC);
                  var inquire2 = INQUIRE2.create();
                  inquire2.MANAGE_NO=MAXNO;
                  inquire2.PHONE_NO=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOJIN_C=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOBAN=$scope.targetKoban;
                  inquire2.YTANTO=$scope.targetGroupno;
                  inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
                  inquire2.KAISU=$scope.targetOiban;
                  inquire2.SAGYOCODE="2";
                  inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
                  inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
                  inquire2.ORIGINAL=$scope.kojinc;
                  inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire2.VERSION="2.0.2";
                  promise = inquire2.save();
                  promise.then(function() {
                  })
                  .catch(function(error) {
                  });
                }
                $timeout(
                  function() {
                    $scope.targetArrival = tmpHour1 + ':' + tmpMinutes1;
                    $scope.targetStarting = "";
                    $scope.targetEnd = "";
                  }, 1000);
                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });
                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });

              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
              });

            }else{
//ons.notification.alert({ message: '書き込まない' });

              var inquire2 = INQUIRE2.create();
              inquire2.MANAGE_NO=MAXNO;
              inquire2.PHONE_NO=$scope.kojinc;
              inquire2.KOJIN_C=$scope.kojinc;
              inquire2.KOBAN=$scope.targetKoban;
              inquire2.YTANTO=$scope.targetGroupno;
              inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
              inquire2.KAISU=$scope.targetOiban;
              inquire2.SAGYOCODE="2";
              inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
              inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
              inquire2.ORIGINAL=$scope.kojinc;
              inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire2.VERSION="2.0.2";
              promise = inquire2.save();
              promise.then(function() {
                $timeout(
                  function() {
                    $scope.targetArrival = tmpHour1 + ':' + tmpMinutes1;
                    $scope.targetStarting = "";
                    $scope.targetEnd = "";
                  }, 1000);


                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });

                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });
              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
              });
            }
          })
          .catch(function(error) {
            loadingModal.hide();
            ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
          });

        }
      }
    });
  }



// *****************************************************************************
//  開始ボタンをクリックしたときの処理
// *****************************************************************************
  $scope.StartingDialog = function() {
    var tmpDep = $scope.targetDeparture;
    var tmpArr = $scope.targetArrival;

// 2016.10.24 Del
// 到着が登録されていなくても開始を登録できるように変更したため
// 下記エラー表示は不要となった。
//    if (tmpArr == null || tmpArr.length == 0) {
//      if (tmpDep != null && tmpDep.length > 0) {
//        ons.notification.alert({ title: "エラー", message: "到着を登録してください"});
//        return false;
//      }
//    }

    ons.notification.confirm({
      title: "作業時間報告(開始)",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();


          // -----------------------------------------------------------------
          // 報告対象日付を取得する
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

          // -----------------------------------------------------------------
          // 報告日時を取得する
          var tmpDeparture = new Date();
          var tmpYear1 = tmpDeparture.getFullYear();
          var tmpMonth1 = tmpDeparture.getMonth()+1;
          var tmpDay1 = tmpDeparture.getDate();
          var tmpHour1 = tmpDeparture.getHours();
          var tmpMinutes1 = tmpDeparture.getMinutes();
          var tmpSeconds1 = tmpDeparture.getSeconds();

          if (tmpMonth1 < 10) {
            tmpMonth1 = '0' + tmpMonth1;
          }
          if (tmpDay1 < 10) {
            tmpDay1 = '0' + tmpDay1;
          }
          if (tmpHour1 < 10) {
            tmpHour1 = '0' + tmpHour1;
          }
          if (tmpMinutes1 < 10) {
            tmpMinutes1 = '0' + tmpMinutes1;
          }
          if (tmpSeconds1 < 10) {
            tmpSeconds1 = '0' + tmpSeconds1;
          }

          // -------------------------------------------------------------------
          // 緯度・経度の登録
 
          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
          navigator.geolocation.getCurrentPosition(function(position) {

//ons.notification.alert({ message: position.coords.latitude });
//ons.notification.alert({ message: position.coords.longitude });
//ons.notification.alert({ message: position.coords.accuracy });

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
//  測位誤差から制度を決定する
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
//ons.notification.alert({ message: tmpYear1 + tmpMonth1 + tmpDay1 + tmpHour1 + tmpMinutes1 + tmpSeconds1 });
//ons.notification.alert({ message: $scope.kojinc + '::' + $scope.simei });

// ----------------------------------------------------------------------------
// ステータスの変更
            var obj = { name: "2" };
            localStorage.setItem("selectSTATUS", JSON.stringify(obj));

// ----------------------------------------------------------------------------
// データベースへの書き込み

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

              var inquire = INQUIRE.create();
              inquire.MANAGE_NO=MAXNO;
              inquire.PHONE_NO=$scope.kojinc;
              inquire.SEND_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.HTTPRCODE="200";
              inquire.GPSDSTS="000";
              inquire.LONGITUDE=longitude3;
              inquire.LATITUDE=latitude3;
              inquire.TIMESTAMP=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.ACCURACY=seido;
              inquire.RESULT_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS="2";
              inquire.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS_DOC="点検中";
              inquire.SHORI="1";
              inquire.VERSION="2.0.2";
              inquire.SKOJIN_C=$scope.kojinc;
              promise = inquire.save();
              promise.then(function() {
              })
              .catch(function(error) {
              });
            })
            .catch(function(error) {
            });

          }, function(result) {
            // 動静管理の処理を行うためエラー処理は行わない
          }, options);

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
              phoneinf.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
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

// *****************************************************************************
// 上記が緯度・経度を取得、データベースへの書き込み処理
// 下記は動静管理データベースへの書き込み処理
// *****************************************************************************

// 2016.10.24 add ↓↓↓↓
// 出発が登録されており到着が登録されていない場合に開始を押した場合
// 到着も同時に登録を行うように変更
          var MAXNO_first = 0;

          if (tmpArr == null || tmpArr.length == 0) {
            if (tmpDep != null && tmpDep.length > 0) {

              var MAXNO2 = 0;
              var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE2";
              var SQL = encodeURIComponent(SQLText);
              var INQuire2 = INQUIRE2.create();
              promise = INQuire2.find(SQL);
              promise.then(function(INQuire2s) {
                MAXNO2 = INQuire2s[0].CNT;
                MAXNO2 = MAXNO2 + 1;
                MAXNO_first = MAXNO2;

                if ($scope.mySwitch.isChecked() == true) {
                  SQLText = "select YOTEI_KJC from MISUSER.YOTEI_DK c "
                          + "where c.YOTEI_YM='"+tmpYyyyMm+"' and c.YOTEI_D='"+tmpDay+"' "
                          + "and c.YTANTO='"+$scope.targetGroupno+"' and c.YGROUP in ( "
                          + "select a.YGROUP "
                          + "from MISUSER.YOTEI_DK a,MISUSER.YOTEI_DG b "
                          + "where b.YOTEI_YM = a.YOTEI_YM and b.YOTEI_D = a.YOTEI_D and b.YTANTO = a.YTANTO and b.YGROUP = a.YGROUP "
                          + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' "
                          + "and a.YTANTO='"+$scope.targetGroupno+"' "
                          + "and a.YOTEI_KJC='"+$scope.kojinc+"' "
                          + "and b.KOBAN='"+$scope.targetKoban+"' "
                          + "and b.KAISU='"+$scope.targetOiban+"')";
                  var SQL = encodeURIComponent(SQLText);
                  var PHONEinf = PHONEINF.create();
                  promise = PHONEinf.find(SQL);
                  promise.then(function(PHONEinfs) {
                    var Cnt = PHONEinfs.length;
                    for (i=0; i < Cnt; i++) {
                      var inquire2 = INQUIRE2.create();
                      inquire2.MANAGE_NO=MAXNO2;
                      inquire2.PHONE_NO=PHONEinfs[i].YOTEI_KJC;
                      inquire2.KOJIN_C=PHONEinfs[i].YOTEI_KJC;
                      inquire2.KOBAN=$scope.targetKoban;
                      inquire2.YTANTO=$scope.targetGroupno;
                      inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
                      inquire2.KAISU=$scope.targetOiban;
                      inquire2.SAGYOCODE="2";
                      inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
                      inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
                      inquire2.ORIGINAL=$scope.kojinc;
                      inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                      inquire2.VERSION="2.0.2";
                      promise = inquire2.save();
                      promise.then(function() {
                      })
                      .catch(function(error) {
                      });
                    }
                    $timeout(
                      function() {
                        $scope.targetArrival = tmpHour1 + ':' + tmpMinutes1;
                        $scope.targetStarting = "";
                        $scope.targetEnd = "";
                      }, 1000);
                  })
                  .catch(function(error) {
                    loadingModal.hide();
                    ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
                  });
                }else{
                  var inquire2 = INQUIRE2.create();
                  inquire2.MANAGE_NO=MAXNO2;
                  inquire2.PHONE_NO=$scope.kojinc;
                  inquire2.KOJIN_C=$scope.kojinc;
                  inquire2.KOBAN=$scope.targetKoban;
                  inquire2.YTANTO=$scope.targetGroupno;
                  inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
                  inquire2.KAISU=$scope.targetOiban;
                  inquire2.SAGYOCODE="2";
                  inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
                  inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
                  inquire2.ORIGINAL=$scope.kojinc;
                  inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire2.VERSION="2.0.2";
                  promise = inquire2.save();
                  promise.then(function() {
                    $timeout(
                      function() {
                        $scope.targetArrival = tmpHour1 + ':' + tmpMinutes1;
                        $scope.targetStarting = "";
                        $scope.targetEnd = "";
                      }, 1000);
                  })
                  .catch(function(error) {
                    loadingModal.hide();
                    ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
                  });
                }
              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
              });

              $timeout(
                function() {
              }, 2000);
            }
          }

          var tmpDeparture2 = new Date();
          var tmpYear2 = tmpDeparture2.getFullYear();
          var tmpMonth2 = tmpDeparture2.getMonth()+1;
          var tmpDay2 = tmpDeparture2.getDate();
          var tmpHour2 = tmpDeparture2.getHours();
          var tmpMinutes2 = tmpDeparture2.getMinutes();
          var tmpSeconds2 = tmpDeparture2.getSeconds();
          if (tmpMonth2 < 10) {
            tmpMonth2 = '0' + tmpMonth2;
          }
          if (tmpDay2 < 10) {
            tmpDay2 = '0' + tmpDay2;
          }
          if (tmpHour2 < 10) {
            tmpHour2 = '0' + tmpHour2;
          }
          if (tmpMinutes2 < 10) {
            tmpMinutes2 = '0' + tmpMinutes2;
          }
          if (tmpSeconds2 < 10) {
            tmpSeconds2 = '0' + tmpSeconds2;
          }

// 2016.10.24 add ↑↑↑↑

// -----------------------------------------------------------------------------
// MANAGE_NOを決定
          var MAXNO = 0;

          var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE2";
          var SQL = encodeURIComponent(SQLText);
          var INQuire2 = INQUIRE2.create();
          promise = INQuire2.find(SQL);
          promise.then(function(INQuire2s) {
            MAXNO = INQuire2s[0].CNT;
            MAXNO = MAXNO + 1;
            
// 2016.10.24 add ↓↓↓↓
            if (MAXNO_first > 0) {
              if (MAXNO == MAXNO_first) {
                MAXNO = MAXNO + 1;
              }
            }
// 2016.10.24 add ↑↑↑↑

//ons.notification.alert({ message: MAXNO });

            if ($scope.mySwitch.isChecked() == true) {
//ons.notification.alert({ message: '同一グループ内の分も書き込みする'});

              SQLText = "select YOTEI_KJC from MISUSER.YOTEI_DK c "
//                      + "where c.YOTEI_YM='"+tmpYear+tmpMonth+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "where c.YOTEI_YM='"+tmpYyyyMm+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "and c.YTANTO='"+$scope.targetGroupno+"' and c.YGROUP in ( "
                      + "select a.YGROUP "
                      + "from MISUSER.YOTEI_DK a,MISUSER.YOTEI_DG b "
                      + "where b.YOTEI_YM = a.YOTEI_YM and b.YOTEI_D = a.YOTEI_D and b.YTANTO = a.YTANTO and b.YGROUP = a.YGROUP "
//                      + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YTANTO='"+$scope.targetGroupno+"' "
                      + "and a.YOTEI_KJC='"+$scope.kojinc+"' "
                      + "and b.KOBAN='"+$scope.targetKoban+"' "
                      + "and b.KAISU='"+$scope.targetOiban+"')";

//alert(SQLText);
              var SQL = encodeURIComponent(SQLText);
              var PHONEinf = PHONEINF.create();
              promise = PHONEinf.find(SQL);
              promise.then(function(PHONEinfs) {
                var Cnt = PHONEinfs.length;
//alert(Cnt);
                for (i=0; i < Cnt; i++) {
//alert(PHONEinfs[i].YOTEI_KJC);
                  var inquire2 = INQUIRE2.create();
                  inquire2.MANAGE_NO=MAXNO;
                  inquire2.PHONE_NO=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOJIN_C=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOBAN=$scope.targetKoban;
                  inquire2.YTANTO=$scope.targetGroupno;
                  inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
                  inquire2.KAISU=$scope.targetOiban;
                  inquire2.SAGYOCODE="3";
                  inquire2.SAGYODATE=""+tmpYear2+tmpMonth2+tmpDay2;
                  inquire2.SAGYOTIME=""+tmpHour2+tmpMinutes2;
                  inquire2.ORIGINAL=$scope.kojinc;
                  inquire2.GET_DATE=""+tmpYear2+tmpMonth2+tmpDay2+tmpHour2+tmpMinutes2+tmpSeconds2;
                  inquire2.VERSION="2.0.2";
                  promise = inquire2.save();
                  promise.then(function() {
                  })
                  .catch(function(error) {
                  });
                }
                $timeout(
                  function() {
                    $scope.targetStarting = tmpHour2 + ':' + tmpMinutes2;
                    $scope.targetEnd = "";
                  }, 1000);
                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });
                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });

              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
              });

            }else{
//ons.notification.alert({ message: '書き込まない' });
              var inquire2 = INQUIRE2.create();
              inquire2.MANAGE_NO=MAXNO;
              inquire2.PHONE_NO=$scope.kojinc;
              inquire2.KOJIN_C=$scope.kojinc;
              inquire2.KOBAN=$scope.targetKoban;
              inquire2.YTANTO=$scope.targetGroupno;
              inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
              inquire2.KAISU=$scope.targetOiban;
              inquire2.SAGYOCODE="3";
              inquire2.SAGYODATE=""+tmpYear2+tmpMonth2+tmpDay2;
              inquire2.SAGYOTIME=""+tmpHour2+tmpMinutes2;
              inquire2.ORIGINAL=$scope.kojinc;
              inquire2.GET_DATE=""+tmpYear2+tmpMonth2+tmpDay2+tmpHour2+tmpMinutes2+tmpSeconds2;
              inquire2.VERSION="2.0.2";
              promise = inquire2.save();
              promise.then(function() {
                $timeout(
                  function() {
                    $scope.targetStarting = tmpHour2 + ':' + tmpMinutes2;
                    $scope.targetEnd = "";
                  }, 1000);


                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });

                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });
              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
              });
            }
          })
          .catch(function(error) {
            loadingModal.hide();
            ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
          });
        }
      }
    });
  }



// *****************************************************************************
//  終了ボタンをクリックしたときの処理
// *****************************************************************************
  $scope.EndDialog = function() {
    var tmpSta = $scope.targetStarting;
    if (tmpSta == null || tmpSta.length == 0) {
      ons.notification.alert({ title: "エラー", message: "開始を登録してください" });
      return false;
    }
    
    ons.notification.confirm({
      title: "作業時間報告(終了)",
      message: "登録してもよろしいですか",
      buttonLabels: [ "いいえ" , "はい" ],
      cancelable: true,
      callback: function(index) {
        if (index == 1) {
          loadingModal.show();


          // -----------------------------------------------------------------
          // 報告対象日付を取得する
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

          // -----------------------------------------------------------------
          // 報告日時を取得する
          var tmpDeparture = new Date();
          var tmpYear1 = tmpDeparture.getFullYear();
          var tmpMonth1 = tmpDeparture.getMonth()+1;
          var tmpDay1 = tmpDeparture.getDate();
          var tmpHour1 = tmpDeparture.getHours();
          var tmpMinutes1 = tmpDeparture.getMinutes();
          var tmpSeconds1 = tmpDeparture.getSeconds();

          if (tmpMonth1 < 10) {
            tmpMonth1 = '0' + tmpMonth1;
          }
          if (tmpDay1 < 10) {
            tmpDay1 = '0' + tmpDay1;
          }
          if (tmpHour1 < 10) {
            tmpHour1 = '0' + tmpHour1;
          }
          if (tmpMinutes1 < 10) {
            tmpMinutes1 = '0' + tmpMinutes1;
          }
          if (tmpSeconds1 < 10) {
            tmpSeconds1 = '0' + tmpSeconds1;
          }

          // -------------------------------------------------------------------
          // 緯度・経度の登録
 
          var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true};
          navigator.geolocation.getCurrentPosition(function(position) {

//ons.notification.alert({ message: position.coords.latitude });
//ons.notification.alert({ message: position.coords.longitude });
//ons.notification.alert({ message: position.coords.accuracy });

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
//  測位誤差から制度を決定する
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
//ons.notification.alert({ message: tmpYear1 + tmpMonth1 + tmpDay1 + tmpHour1 + tmpMinutes1 + tmpSeconds1 });
//ons.notification.alert({ message: $scope.kojinc + '::' + $scope.simei });

// ----------------------------------------------------------------------------
// ステータスの変更
            var obj = { name: "4" };
            localStorage.setItem("selectSTATUS", JSON.stringify(obj));

// ----------------------------------------------------------------------------
// データベースへの書き込み

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

              var inquire = INQUIRE.create();
              inquire.MANAGE_NO=MAXNO;
              inquire.PHONE_NO=$scope.kojinc;
              inquire.SEND_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.HTTPRCODE="200";
              inquire.GPSDSTS="000";
              inquire.LONGITUDE=longitude3;
              inquire.LATITUDE=latitude3;
              inquire.TIMESTAMP=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.ACCURACY=seido;
              inquire.RESULT_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS="4";
              inquire.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire.STATUS_DOC="移動中";
              inquire.SHORI="1";
              inquire.VERSION="2.0.2";
              inquire.SKOJIN_C=$scope.kojinc;
              promise = inquire.save();
              promise.then(function() {
              })
              .catch(function(error) {
              });
            })
            .catch(function(error) {
            });

          }, function(result) {
            // 動静管理の処理を行うためエラー処理は行わない
          }, options);

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
              phoneinf.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
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

// *****************************************************************************
// 上記が緯度・経度を取得、データベースへの書き込み処理
// 下記は動静管理データベースへの書き込み処理
// *****************************************************************************

// -----------------------------------------------------------------------------
// MANAGE_NOを決定
          var MAXNO = 0;

          var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE2";
          var SQL = encodeURIComponent(SQLText);
          var INQuire2 = INQUIRE2.create();
          promise = INQuire2.find(SQL);
          promise.then(function(INQuire2s) {
            MAXNO = INQuire2s[0].CNT;
            MAXNO = MAXNO + 1;
//ons.notification.alert({ message: MAXNO });

            if ($scope.mySwitch.isChecked() == true) {
//ons.notification.alert({ message: '同一グループ内の分も書き込みする'});

              SQLText = "select YOTEI_KJC from MISUSER.YOTEI_DK c "
//                      + "where c.YOTEI_YM='"+tmpYear+tmpMonth+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "where c.YOTEI_YM='"+tmpYyyyMm+"' and c.YOTEI_D='"+tmpDay+"' "
                      + "and c.YTANTO='"+$scope.targetGroupno+"' and c.YGROUP in ( "
                      + "select a.YGROUP "
                      + "from MISUSER.YOTEI_DK a,MISUSER.YOTEI_DG b "
                      + "where b.YOTEI_YM = a.YOTEI_YM and b.YOTEI_D = a.YOTEI_D and b.YTANTO = a.YTANTO and b.YGROUP = a.YGROUP "
//                      + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' "
                      + "and a.YTANTO='"+$scope.targetGroupno+"' "
                      + "and a.YOTEI_KJC='"+$scope.kojinc+"' "
                      + "and b.KOBAN='"+$scope.targetKoban+"' "
                      + "and b.KAISU='"+$scope.targetOiban+"')";

//alert(SQLText);
              var SQL = encodeURIComponent(SQLText);
              var PHONEinf = PHONEINF.create();
              promise = PHONEinf.find(SQL);
              promise.then(function(PHONEinfs) {
                var Cnt = PHONEinfs.length;
//alert(Cnt);
                for (i=0; i < Cnt; i++) {
//alert(PHONEinfs[i].YOTEI_KJC);
                  var inquire2 = INQUIRE2.create();
                  inquire2.MANAGE_NO=MAXNO;
                  inquire2.PHONE_NO=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOJIN_C=PHONEinfs[i].YOTEI_KJC;
                  inquire2.KOBAN=$scope.targetKoban;
                  inquire2.YTANTO=$scope.targetGroupno;
                  inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
                  inquire2.KAISU=$scope.targetOiban;
                  inquire2.SAGYOCODE="4";
                  inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
                  inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
                  inquire2.ORIGINAL=$scope.kojinc;
                  inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire2.VERSION="2.0.2";
                  promise = inquire2.save();
                  promise.then(function() {
                  })
                  .catch(function(error) {
                  });
                }
                $timeout(
                  function() {
                    $scope.targetEnd = tmpHour1 + ':' + tmpMinutes1;
                  }, 1000);
                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });
                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });

              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
              });

            }else{
//ons.notification.alert({ message: '書き込まない' });

              var inquire2 = INQUIRE2.create();
              inquire2.MANAGE_NO=MAXNO;
              inquire2.PHONE_NO=$scope.kojinc;
              inquire2.KOJIN_C=$scope.kojinc;
              inquire2.KOBAN=$scope.targetKoban;
              inquire2.YTANTO=$scope.targetGroupno;
              inquire2.YOTEI_YMD=""+tmpYear+tmpMonth+tmpDay;
              inquire2.KAISU=$scope.targetOiban;
              inquire2.SAGYOCODE="4";
              inquire2.SAGYODATE=""+tmpYear1+tmpMonth1+tmpDay1;
              inquire2.SAGYOTIME=""+tmpHour1+tmpMinutes1;
              inquire2.ORIGINAL=$scope.kojinc;
              inquire2.GET_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
              inquire2.VERSION="2.0.2";
              promise = inquire2.save();
              promise.then(function() {
                $timeout(
                  function() {
                    $scope.targetEnd = tmpHour1 + ':' + tmpMinutes1;
                  }, 1000);


                var SQLText = "select KOBAN,KAISU,YTANTO,GRYAKUSHO,DEPARTURE || ' ' || ARRIVE || ' ' || STARTING || ' ' || FINISH AS DOUSEI from "
                            + "( "
                            + "select KOBAN,KAISU,YTANTO,GRYAKUSHO,SAGYO1,SAGYO2,SAGYO3,SAGYO4,RD1,RD2,RD3,RD4, "
                            + "CASE "
                            + "WHEN SAGYO1 IS NOT NULL THEN '出' "
                            + "ELSE '　' "
                            + "END DEPARTURE, "
                            + "CASE "
                            + "WHEN SAGYO2 IS NOT NULL AND RD1 <= RD2 THEN '着' "
                            + "ELSE '　' "
                            + "END ARRIVE, "
                            + "CASE "
                            + "WHEN SAGYO3 IS NOT NULL AND ((RD2 <= RD3 AND RD1 <= RD3) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '開' "
                            + "ELSE '　' "
                            + "END STARTING, "
                            + "CASE "
                            + "WHEN SAGYO4 IS NOT NULL AND RD3 <= RD4 AND ((RD2 <= RD4 AND RD1 <= RD4) OR (RD2 IS NULL AND RD1 IS NULL)) THEN '終' "
                            + "ELSE '　' "
                            + "END FINISH "
                            + "from (select a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + ",max(c.SAGYO1) AS SAGYO1,max(d.SAGYO2) AS SAGYO2,max(e.SAGYO3) AS SAGYO3,max(f.SAGYO4) AS SAGYO4 "
                            + ",max(c.RD1) AS RD1,max(d.RD2) AS RD2,max(e.RD3) AS RD3,max(f.RD4) AS RD4 "
                            + "from "
                            + "(select aa.KOBAN,aa.TOROKU,aa.YTANTO,aa.YOTEI_YM,aa.YOTEI_D,aa.YGROUP,aa.KAISU,aa.GRYAKUSHO,bb.YOTEI_KJC "
                            + "from MISUSER.YOTEI_DG aa,MISUSER.YOTEI_DK bb "
                            + "where aa.YOTEI_YM = bb.YOTEI_YM and aa.YOTEI_D = bb.YOTEI_D and aa.YTANTO = bb.YTANTO and aa.YGROUP = bb.YGROUP "
//                            + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                            + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                            + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                            + "where "
                            + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                            + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                            + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                            + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                            + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                            + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                            + "order by a.KOBAN "
                            + ")"
                            + ")";
                var SQL = encodeURIComponent(SQLText);
                var INQuire = INQUIRE.create();
                promise = INQuire.find(SQL);
                promise.then(function(INQuires) {
                  sharedScopes2['Veiw'].genbas = INQuires;
//alert('OK');
                })
                .catch(function(error) {
//alert('ERROR');
                });

                loadingModal.hide();
                ons.notification.alert({ title: "作業時間報告", message: "登録しました。" });
              })
              .catch(function(error) {
                loadingModal.hide();
                ons.notification.alert({ title: 'エラー', mesasge: '登録に失敗しました' });
              });
            }
          })
          .catch(function(error) {
            loadingModal.hide();
            ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
          });
        }
      }
    });
  }



// *****************************************************************************
// 同一グループ内の出勤簿を作成するかの是非ボタン動作処理
// *****************************************************************************
  $scope.switchClicked = function() {
    // 結果：trueかfalse
    $timeout(
      function() {
        if (mySwitch.isChecked() == true) {
          $scope.selectEnv = "はい";
        }else{
          $scope.selectEnv = "いいえ";
        }
      }, 500);
  };

}]);

