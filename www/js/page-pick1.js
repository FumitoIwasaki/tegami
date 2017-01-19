// This is a JavaScript file

app.controller('SubController_Pick1',['$scope','$rootScope','INQUIRE','FJ01sql','Authenticator', function($scope, $rootScope, INQUIRE,FJ01sql, Authenticator) {

  sharedScopes2 = {};
  sharedScopes2["Veiw"] = $scope;
  
  //document.tPackage_No.setfocus;
  
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
  //FJ01Xへの接続テスト
// *****************************************************************************
/*
  SQLText="SELECT TKOBAN FROM JCD_JUCHU WHERE PROJECT_NO ='2015610002X'";
  var SQL = encodeURIComponent(SQLText);
  var FJ01sqlA = FJ01sql.create();
  promise = FJ01sqlA.find(SQL);
  promise.then(function(FJ01sqlA) {
    if (FJ01sqlA.length > 0) {
      $scope.genbas = FJ01sqlA;
      loadingModal.hide();
    }else{
      $scope.genbas = "";
      loadingModal.hide();
      ons.notification.alert({ title: "確認", message: "FJ01Xにデータなし" });
    }
  })
  .catch(function(error) {
    $scope.genbas = "";
    loadingModal.hide();
    ons.notification.alert({ title: "エラー", message: "データベースへの接続に失敗しました" });
  });
  */
      
// *****************************************************************************
// 検索ボタンをクリックしたときの処理
// *****************************************************************************
  $scope.Pick1_go = function() {

    //検索項目の変数をクリア（グローバル変数のためクリアしておく）
    main_package_no="";
    //alert("pick1_go入ったよ2");            
    //No tPackage_No tPackage_No tPackage_No
    
    //alert(document.Pick1.tPackage_No.value);
    main_package_no = document.Pick1.tPackage_No.value; 

　　//=====================================
    //iwf追加箇所==========================
　　//=====================================
    SQLText="";
    SQLText=SQLText + " SELECT '12345' as PACKAGE_NO, ";
    SQLText=SQLText + "   TKOBAN,BLOCK ";
    SQLText=SQLText + " FROM BRPACKLOC " ;
    SQLText=SQLText + " WHERE  ";
    SQLText=SQLText + " TKOBAN='EHA3751' AND BLOCK='CA' AND BLOCK_SEQ_NO='01' ";
    var SQL = encodeURIComponent(SQLText);
    var FJ01sqlA = FJ01sql.create();
    promise = FJ01sqlA.find(SQL);
    alert("1");
    promise.then(function(FJ01sqlA) {
      if (FJ01sqlA.length > 0) {
        //$scope.genbas = FJ01sqlA;
        loadingModal.hide();
        alert("2");
      }else{
        //$scope.genbas = "";
        loadingModal.hide();
　　    ons.notification.alert({ title: "確認", message: "PackageNo.に誤りがあります。" });
        exit;        
        //ons.notification.alert({ title: "確認", message: "データがありません。" });
        alert("3");
      }
    })
　　//=====================================
    //iwf追加箇所==========================
　　//=====================================


    //main_package_no="111";

    //alert("pick1_go入ったよ3"+main_package_no);      
    //データ確認
    console.log(main_package_no); 
    //alert("pick1_go入ったよ4");      
     
    app.navi.pushPage('Pick2.html');
    
    //alert("pick1_go入ったよ5");      

  }
  $scope.Pick2_go = function() {

    //検索項目の変数をクリア（グローバル変数のためクリアしておく）
    //main_package_no="";
          
    //No
    //main_package_no=document.Pick1.tPackage_No.value; 
    
    //データ確認
    console.log(main_package_no); 
     
    app.navi.pushPage('Pick2.html');
    /*
    $(document).on('pageinit','#Pick2', function() {
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
    */
  }
      
// *****************************************************************************
// フォーム内容をリセット
// *****************************************************************************
      
  $scope.resetForm = function() {
      document.Main_Search.reset();
  }      
  
      


// *****************************************************************************
// 本日・前日のボタンをクリックしたときの処理
// *****************************************************************************
  $scope.addDays = function(days) {


// -----------------------------------------------------------------------------
// 本日のボタンをクリックしたときの現場情報セット
    if (days == 0) {
      loadingModal.show();
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
//                  + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                  + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                  + "where "
                  + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                  + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                  + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                  + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                  + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                  + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                  + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                  + "order by a.KOBAN "
                  + ")"
                  + ")";
      var SQL = encodeURIComponent(SQLText);
      var INQuire = INQUIRE.create();
      promise = INQuire.find(SQL);
      promise.then(function(INQuires) {
        if (INQuires.length > 0) {
          $scope.genbas = INQuires;
          loadingModal.hide();
        }else{
          $scope.genbas = "";
          loadingModal.hide();
          ons.notification.alert({ title: "確認", message: "日次手配表aに登録されている現場が見つかりません" });
        }
      })
      .catch(function(error) {
        $scope.genbas = "";
        loadingModal.hide();
        ons.notification.alert({ title: "エラー", message: "データベースへの接続に失敗しました" });
      });
    }
// -----------------------------------------------------------------------------
// 昨日のボタンをクリックしたときの現場情報のセット
    if (days == -1) {
      loadingModal.show();

      $scope.targetDate = new Date();
      $scope.targetDate.setDate($scope.targetDate.getDate()+days);

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
//                  + "and aa.YOTEI_YM='"+tmpYear+tmpMonth+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
                  + "and aa.YOTEI_YM='"+tmpYyyyMm+"' and aa.YOTEI_D='"+tmpDay+"' and bb.YOTEI_KJC='"+$scope.kojinc+"' and substr(aa.TOROKU, 1, 1) <> 'Z') a, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='1') c, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='2') d, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='3') e, "
//                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYear+tmpMonth+tmpDay+"' and SAGYOCODE='4') f "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO1,GET_DATE AS RD1 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='1') c, "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO2,GET_DATE AS RD2 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='2') d, "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO3,GET_DATE AS RD3 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='3') e, "
                  + "(select d.*,d.SAGYODATE || d.SAGYOTIME AS SAGYO4,GET_DATE AS RD4 from gpsuser.INQUIRE2 d where YOTEI_YMD='"+tmpYyyyMmDd+"' and SAGYOCODE='4') f "
                  + "where "
                  + "c.KOJIN_C (+)= a.YOTEI_KJC and c.KOBAN (+)= a.KOBAN and c.YTANTO (+)= a.YTANTO and c.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and c.KAISU (+)= a.KAISU "
                  + "and d.KOJIN_C (+)= a.YOTEI_KJC and d.KOBAN (+)= a.KOBAN and d.YTANTO (+)= a.YTANTO and d.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and d.KAISU (+)= a.KAISU "
                  + "and e.KOJIN_C (+)= a.YOTEI_KJC and e.KOBAN (+)= a.KOBAN and e.YTANTO (+)= a.YTANTO and e.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and e.KAISU (+)= a.KAISU "
                  + "and f.KOJIN_C (+)= a.YOTEI_KJC and f.KOBAN (+)= a.KOBAN and f.YTANTO (+)= a.YTANTO and f.YOTEI_YMD (+)= a.YOTEI_YM || a.YOTEI_D and f.KAISU (+)= a.KAISU "
//                  + "and a.YOTEI_YM='"+tmpYear+tmpMonth+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "
                  + "and a.YOTEI_YM='"+tmpYyyyMm+"' and a.YOTEI_D='"+tmpDay+"' and a.YOTEI_KJC='"+$scope.kojinc+"' and substr(a.TOROKU, 1, 1) <> 'Z' "                  + "group by a.KOBAN,a.KAISU,a.TOROKU,a.YOTEI_YM,a.YOTEI_D,a.YTANTO,a.YGROUP,a.YOTEI_KJC,a.GRYAKUSHO "
                  + "order by a.KOBAN "
                  + ")"
                  + ")";
      var SQL = encodeURIComponent(SQLText);
      var INQuire = INQUIRE.create();
      promise = INQuire.find(SQL);
      promise.then(function(INQuires) {
        if (INQuires.length > 0) {
          $scope.genbas = INQuires;
          loadingModal.hide();
        }else{
          $scope.genbas = "";
          loadingModal.hide();
          ons.notification.alert({ title: "確認", message: "日次手配表に登録されている現場が見つかりません" });
        }
      })
      .catch(function(error) {
        $scope.genbas = "";
        loadingModal.hide();
        ons.notification.alert({ title: "エラー", message: "データベースへの接続に失敗しました" });
      });
    }
  }


  // alert("test");
  // alert(document.getElementById('tPackage_No'));
  
   document.getElementById('tPackage_No').focus();
// $(document).on('Pick1', '#email', function() {
//   $('#tPackage_No').focus();
// });



// *****************************************************************************
// 現場リストをクリックしたときの処理
// *****************************************************************************
  $scope.dayItemSelect = function(index) {
    var selectItem = $scope.genbas[index];
//alert(selectItem.groupno);
    app.navi.pushPage('sagyo.html', { animation : 'slide' } );
    $rootScope.targetKoban = selectItem.KOBAN;
    $rootScope.targetOiban = selectItem.KAISU;
    $rootScope.targetGenbamei = selectItem.GRYAKUSHO;
    $rootScope.targetDate = $scope.targetDate;
    $rootScope.targetGroupno = selectItem.YTANTO;
    $rootScope.selectEnv = "いいえ";
  }

}]);
