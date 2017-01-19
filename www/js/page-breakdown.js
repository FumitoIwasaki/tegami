app.controller('SubController12',['$scope','$rootScope','INQUIRE1','Authenticator', function($scope, $rootScope, INQUIRE1, Authenticator) {

// ****************************************************************************
// 故障報告を起動したときに表示するデータを抽出する
// ****************************************************************************

  loadingModal.show();


  // ***** テスト用SQL *****
/*
  var SQLText = "select c.SQNO,c.BUILDING_NO,c.GENBAMEI"
              + ",to_char(c.R_DATE,'YY/MM/DD HH24:MI') as R_DATE,s.SK_CODE, "
              + "CASE "
              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '3' THEN '救出' "
              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '2' THEN '到着' "
              + "WHEN IQ.RESULT='2' THEN '到着' "
              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '1' THEN '移動中' "
              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '0' THEN '手配済' "
              + "ELSE '　' "
              + "END DOUSEI "
              + "from "
              + "CBUSER.CBLOG@SSNPDEV c,"
              + "KBMAS@SSNPDEV k,"
              + "GROUPRYAKUMAS@SSNPDEV r,"
              + "GENBAINFTOKYO@SSNPDEV g,"
              + "CB_INPUTCODE@SSNPDEV j,"
              + "CBUSER.SKLOG@SSNPDEV s,"
              + "SHAIN@SSNPDEV n,"
              + "INQUIRE1 IQ "
              + "where c.KOBAN = k.KOBAN "
              + "and c.SQNO = s.SQNO "
              + "and j.CODE = c.J_CODEI "
              + "and IQ.KEYWORD (+)= c.SQNO "
              + "and j.KIND = '1' "
              + "and c.P_CODE = '4' "
              + "and fnc_tjokyo_v2@SSNPDEV(c.SQNO) in ('0', '1', '2', '3') "
              + "and NVL(c.DELETE_FLAG,'0') = '0' "
              + "and g.GRPBANGO = k.HTANTO "
              + "and r.GROUP_NO(+) = g.GRPBANGO "
              + "and s.SK_CODE = n.KOJIN_C "
              + "and s.SKSTATUS <> 'D' "
              + "and s.sk_code ='"+$scope.kojinc+"' "
              + "and (IQ.RESULT is null or IQ.RESULT='0' or IQ.RESULT='-' or IQ.RESULT='2') "
              + "order by c.BUILDING_NO,c.R_DATE";
*/
  // ***** 本運用用SQL *****
  var SQLText = "select c.SQNO,c.BUILDING_NO,c.GENBAMEI"
              + ",to_char(c.R_DATE,'YY/MM/DD HH24:MI') as R_DATE,s.SK_CODE, "
              + "CASE "
              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '3' THEN '救出' "
              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '2' THEN '到着' "
              + "WHEN RESULT='2' THEN '到着' "
              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '1' THEN '移動中' "
              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '0' THEN '手配済' "
              + "ELSE '　' "
              + "END DOUSEI "
              + "from "
              + "CBUSER.CBLOG@SNCLINK c,"
              + "KBMAS@SNCLINK k,"
              + "GROUPRYAKUMAS@SNCLINK r,"
              + "GENBAINFTOKYO@SNCLINK g,"
              + "CB_INPUTCODE@SNCLINK j,"
              + "CBUSER.SKLOG@SNCLINK s,"
              + "SHAIN@SNCLINK n,"
              + "INQUIRE1 IQ "
              + "where c.KOBAN = k.KOBAN "
              + "and c.SQNO = s.SQNO "
              + "and j.CODE = c.J_CODEI "
              + "and IQ.KEYWORD (+)= c.SQNO "
              + "and j.KIND = '1' "
              + "and c.P_CODE = '4' "
              + "and fnc_tjokyo_v2@SNCLINK(c.SQNO) in ('0', '1', '2', '3') "
              + "and NVL(c.DELETE_FLAG,'0') = '0' "
              + "and g.GRPBANGO = k.HTANTO "
              + "and r.GROUP_NO(+) = g.GRPBANGO "
              + "and s.SK_CODE = n.KOJIN_C "
              + "and s.SKSTATUS <> 'D' "
              + "and c.R_DATE >= sysdate-1 "
              + "and s.sk_code ='"+$scope.kojinc+"' "
              + "and (IQ.RESULT is null or IQ.RESULT='0' or IQ.RESULT='-' or IQ.RESULT='2') "
              + "order by c.BUILDING_NO,c.R_DATE";
  var SQL = encodeURIComponent(SQLText);
  var INQuire1 = INQUIRE1.create();
  promise = INQuire1.find(SQL);
  promise.then(function(INQuire1s) {
    if (INQuire1s.length > 0) {
      $scope.bdgenbas = INQuire1s;
      loadingModal.hide();
    }else{
      loadingModal.hide();
      ons.notification.alert({ title: "確認", message: "報告対象の現場が見つかりません" });
    }
  })
  .catch(function(error) {
    loadingModal.hide();
    ons.notification.alert({ title: "エラー", message: "データベースへの接続に失敗しました" });
  });


// *****************************************************************************
// 現場リストをクリックしたときの処理
// *****************************************************************************
  $scope.genbaItemSelect = function(index) {
    var selectItem = $scope.bdgenbas[index];
    $scope.targetBuildingno = selectItem.BUILDING_NO;
    $scope.targetSqno = selectItem.SQNO;
  }

// *****************************************************************************
//  故障報告関連処理(処理No.:2)
// *****************************************************************************
  $scope.breakdownDialog = function(tmpStr) {
      var tmpStr2 = $scope.targetBuildingno;
        
      if (isFinite(tmpStr2) == false) {
        ons.notification.alert({ title: "エラー", message: "現場を選択してください。"　});
        return false;
      }
      if (tmpStr2.length != 7) {
        ons.notification.alert({ title: "エラー", message: "現場を選択してください。"});
        return false;
      }

      var Result_doc = "";
      if (tmpStr == "1") {
        Result_doc = "完了";
      }else if (tmpStr == "2") {
        Result_doc = "現着";
      }

      ons.notification.confirm({
        title: "故障報告",
        message: "登録してもよろしいですか",
        buttonLabels: [ "いいえ" , "はい" ],
        cancelable: true,
        callback: function(index) {
          if (index == 1) {
            loadingModal.show();


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

            var MAXNO;

            var SQLText = "select MANAGE_NO from INQUIRE1 "
                        + "where KEYWORD='" + $scope.targetSqno+"' "
                        + "and SHORI='2'";
            var SQL = encodeURIComponent(SQLText);
            var INQuire1 = INQUIRE1.create();
            promise = INQuire1.find(SQL);
            promise.then(function(INQuire1s) {
            
              // -------------------------------------------------
              // 結果の更新登録

              if (INQuire1s.length > 0) {

                var MAXNO = INQuire1s[0].MANAGE_NO;
//ons.notification.alert({ message: "MAXNO=" + MAXNO });

                var SQL = "MANAGE_NO="+MAXNO;
                var inquire1 = INQUIRE1.create();
                inquire1.MANAGE_NO=MAXNO;
                inquire1.RESULT_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                inquire1.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                inquire1.RESULT=""+tmpStr;
                inquire1.RESULT_DOC=Result_doc;
                promise = inquire1.update(SQL);
                promise.then(function() {

                  // --------------------------------------------
                  // データの再描画
/*
                  // ***** テスト用SQL *****
                  var SQLText = "select c.SQNO,c.BUILDING_NO,c.GENBAMEI"
                              + ",to_char(c.R_DATE,'YY/MM/DD HH24:MI') as R_DATE,s.SK_CODE, "
                              + "CASE "
                              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '3' THEN '救出' "
                              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '2' THEN '到着' "
                              + "WHEN IQ.RESULT='2' THEN '到着' "
                              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '1' THEN '移動中' "
                              + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '0' THEN '手配済' "
                              + "ELSE '　' "
                              + "END DOUSEI "
                              + "from "
                              + "CBUSER.CBLOG@SSNPDEV c,"
                              + "KBMAS@SSNPDEV k,"
                              + "GROUPRYAKUMAS@SSNPDEV r,"
                              + "GENBAINFTOKYO@SSNPDEV g,"
                              + "CB_INPUTCODE@SSNPDEV j,"
                              + "CBUSER.SKLOG@SSNPDEV s,"
                              + "SHAIN@SSNPDEV n,"
                              + "INQUIRE1 IQ "
                              + "where c.KOBAN = k.KOBAN "
                              + "and c.SQNO = s.SQNO "
                              + "and j.CODE = c.J_CODEI "
                              + "and IQ.KEYWORD (+)= c.SQNO "
                              + "and j.KIND = '1' "
                              + "and c.P_CODE = '4' "
                              + "and fnc_tjokyo_v2@SSNPDEV(c.SQNO) in ('0', '1', '2', '3') "
                              + "and NVL(c.DELETE_FLAG,'0') = '0' "
                              + "and g.GRPBANGO = k.HTANTO "
                              + "and r.GROUP_NO(+) = g.GRPBANGO "
                              + "and s.SK_CODE = n.KOJIN_C "
                              + "and s.SKSTATUS <> 'D' "
                              + "and s.sk_code ='"+$scope.kojinc+"' "
                              + "and (IQ.RESULT is null or IQ.RESULT='0' or IQ.RESULT='-' or IQ.RESULT='2') "
                              + "order by c.BUILDING_NO,c.R_DATE";
*/
                  // ***** 本運用用SQL *****
                  var SQLText = "select c.SQNO,c.BUILDING_NO,c.GENBAMEI"
                              + ",to_char(c.R_DATE,'YY/MM/DD HH24:MI') as R_DATE,s.SK_CODE, "
                              + "CASE "
                              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '3' THEN '救出' "
                              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '2' THEN '到着' "
                              + "WHEN RESULT='2' THEN '到着' "
                              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '1' THEN '移動中' "
                              + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '0' THEN '手配済' "
                              + "ELSE '　' "
                              + "END DOUSEI "
                              + "from "
                              + "CBUSER.CBLOG@SNCLINK c,"
                              + "KBMAS@SNCLINK k,"
                              + "GROUPRYAKUMAS@SNCLINK r,"
                              + "GENBAINFTOKYO@SNCLINK g,"
                              + "CB_INPUTCODE@SNCLINK j,"
                              + "CBUSER.SKLOG@SNCLINK s,"
                              + "SHAIN@SNCLINK n,"
                              + "INQUIRE1 IQ "
                              + "where c.KOBAN = k.KOBAN "
                              + "and c.SQNO = s.SQNO "
                              + "and j.CODE = c.J_CODEI "
                              + "and IQ.KEYWORD (+)= c.SQNO "
                              + "and j.KIND = '1' "
                              + "and c.P_CODE = '4' "
                              + "and fnc_tjokyo_v2@SNCLINK(c.SQNO) in ('0', '1', '2', '3') "
                              + "and NVL(c.DELETE_FLAG,'0') = '0' "
                              + "and g.GRPBANGO = k.HTANTO "
                              + "and r.GROUP_NO(+) = g.GRPBANGO "
                              + "and s.SK_CODE = n.KOJIN_C "
                              + "and s.SKSTATUS <> 'D' "
                              + "and c.R_DATE >= sysdate-1 "
                              + "and s.sk_code ='"+$scope.kojinc+"' "
                              + "and (IQ.RESULT is null or IQ.RESULT='0' or IQ.RESULT='-' or IQ.RESULT='2') "
                              + "order by c.BUILDING_NO,c.R_DATE";
                  var SQL = encodeURIComponent(SQLText);
                  var INQuire1 = INQUIRE1.create();
                  promise = INQuire1.find(SQL);
                  promise.then(function(INQuire1s) {
                    $scope.bdgenbas = INQuire1s;
                  })
                  .catch(function(error) {
                  });

                  $scope.targetBuildingno='';
                  $scope.targetSqno='';

                  loadingModal.hide();
                  ons.notification.alert({ title: "故障報告", message: "登録しました" });
                })
                .catch(function(error) {
                  loadingModal.hide();
                  ons.notification.alert({ title: 'エラー', message: '登録に失敗しました' });
                });

              // ------------------------------------------------
              // 結果の新規登録

              }else{

                // MANAGE_NOの最大値+1の値を決定する
                var SQLText = "select max(MANAGE_NO) AS CNT from INQUIRE1";
                var SQL = encodeURIComponent(SQLText);
                var INQuire1 = INQUIRE1.create();
                promise = INQuire1.find(SQL);
                promise.then(function(INQuire1s) {
                  MAXNO = INQuire1s[0].CNT;
                  MAXNO = MAXNO + 1;

//ons.notification.alert({ message: "MAXNO=" + MAXNO });

                  // 新規登録
                  var inquire1 = INQUIRE1.create();
                  inquire1.MANAGE_NO=MAXNO;
                  inquire1.PHONE_NO=$scope.kojinc;
                  inquire1.SEND_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire1.HTTPRCODE="200";
                  inquire1.GPSDSTS="000";
                  inquire1.RESULT_DATE=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire1.STATUS="3";
                  inquire1.KOSINBI=""+tmpYear1+tmpMonth1+tmpDay1+tmpHour1+tmpMinutes1+tmpSeconds1;
                  inquire1.STATUS_DOC="修理中";
                  inquire1.KEYWORD=$scope.targetSqno;
                  inquire1.SHORI="2";
                  inquire1.TOROKU=$scope.targetBuildingno;
                  inquire1.RESULT=tmpStr;
                  inquire1.RESULT_DOC=Result_doc;
                  inquire1.VERSION="2.0.2";
                  promise = inquire1.save();
                  promise.then(function() {

                    // ----------------------------------------
                    // 画面のデータ表示の再描画
/*
                    // ***** テスト用SQL *****
                    var SQLText = "select c.SQNO,c.BUILDING_NO,c.GENBAMEI"
                                + ",to_char(c.R_DATE,'YY/MM/DD HH24:MI') as R_DATE,s.SK_CODE, "
                                + "CASE "
                                + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '3' THEN '救出' "
                                + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '2' THEN '到着' "
                                + "WHEN IQ.RESULT='2' THEN '到着' "
                                + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '1' THEN '移動中' "
                                + "WHEN fnc_tjokyo_v2@SSNPDEV(c.SQNO) = '0' THEN '手配済' "
                                + "ELSE '　' "
                                + "END DOUSEI "
                                + "from "
                                + "CBUSER.CBLOG@SSNPDEV c,"
                                + "KBMAS@SSNPDEV k,"
                                + "GROUPRYAKUMAS@SSNPDEV r,"
                                + "GENBAINFTOKYO@SSNPDEV g,"
                                + "CB_INPUTCODE@SSNPDEV j,"
                                + "CBUSER.SKLOG@SSNPDEV s,"
                                + "SHAIN@SSNPDEV n,"
                                + "INQUIRE1 IQ "
                                + "where c.KOBAN = k.KOBAN "
                                + "and c.SQNO = s.SQNO "
                                + "and j.CODE = c.J_CODEI "
                                + "and IQ.KEYWORD (+)= c.SQNO "
                                + "and j.KIND = '1' "
                                + "and c.P_CODE = '4' "
                                + "and fnc_tjokyo_v2@SSNPDEV(c.SQNO) in ('0', '1', '2', '3') "
                                + "and NVL(c.DELETE_FLAG,'0') = '0' "
                                + "and g.GRPBANGO = k.HTANTO "
                                + "and r.GROUP_NO(+) = g.GRPBANGO "
                                + "and s.SK_CODE = n.KOJIN_C "
                                + "and s.SKSTATUS <> 'D' "
                                + "and s.sk_code ='"+$scope.kojinc+"' "
                                + "and (IQ.RESULT is null or IQ.RESULT='0' or IQ.RESULT='-' or IQ.RESULT='2') "
                                + "order by c.BUILDING_NO,c.R_DATE";
*/
                    // ***** 本運用用SQL *****
                    var SQLText = "select c.SQNO,c.BUILDING_NO,c.GENBAMEI"
                                + ",to_char(c.R_DATE,'YY/MM/DD HH24:MI') as R_DATE,s.SK_CODE, "
                                + "CASE "
                                + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '3' THEN '救出' "
                                + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '2' THEN '到着' "
                                + "WHEN RESULT='2' THEN '到着' "
                                + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '1' THEN '移動中' "
                                + "WHEN fnc_tjokyo_v2@SNCLINK(c.SQNO) = '0' THEN '手配済' "
                                + "ELSE '　' "
                                + "END DOUSEI "
                                + "from "
                                + "CBUSER.CBLOG@SNCLINK c,"
                                + "KBMAS@SNCLINK k,"
                                + "GROUPRYAKUMAS@SNCLINK r,"
                                + "GENBAINFTOKYO@SNCLINK g,"
                                + "CB_INPUTCODE@SNCLINK j,"
                                + "CBUSER.SKLOG@SNCLINK s,"
                                + "SHAIN@SNCLINK n,"
                                + "INQUIRE1 IQ "
                                + "where c.KOBAN = k.KOBAN "
                                + "and c.SQNO = s.SQNO "
                                + "and j.CODE = c.J_CODEI "
                                + "and IQ.KEYWORD (+)= c.SQNO "
                                + "and j.KIND = '1' "
                                + "and c.P_CODE = '4' "
                                + "and fnc_tjokyo_v2@SNCLINK(c.SQNO) in ('0', '1', '2', '3') "
                                + "and NVL(c.DELETE_FLAG,'0') = '0' "
                                + "and g.GRPBANGO = k.HTANTO "
                                + "and r.GROUP_NO(+) = g.GRPBANGO "
                                + "and s.SK_CODE = n.KOJIN_C "
                                + "and s.SKSTATUS <> 'D' "
                                + "and c.R_DATE >= sysdate-1 "
                                + "and s.sk_code ='"+$scope.kojinc+"' "
                                + "and (IQ.RESULT is null or IQ.RESULT='0' or IQ.RESULT='-' or IQ.RESULT='2') "
                                + "order by c.BUILDING_NO,c.R_DATE";
                    var SQL = encodeURIComponent(SQLText);
                    var INQuire1 = INQUIRE1.create();
                    promise = INQuire1.find(SQL);
                    promise.then(function(INQuire1s) {
                      $scope.bdgenbas = INQuire1s;
                    })
                    .catch(function(error) {
                    });

                    $scope.targetBuildingno='';
                    $scope.targetSqno='';

                    loadingModal.hide();
                    ons.notification.alert({ title: "故障報告", message: "登録しました" });
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
              }

            })
            .catch(function(error) {
              loadingModal.hide();
              ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
            });

          }
        }
      })
    }

}]);
