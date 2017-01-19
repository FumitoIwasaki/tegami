// This is a JavaScript file

app.controller('SubController_Main_Search_detail',['$scope','$rootScope','INQUIRE','FJ01sql','Authenticator','Myservice1','$timeout', function($scope, $rootScope, INQUIRE,FJ01sql, Authenticator,Myservice1,$timeout) {



  sharedScopes2 = {};
  sharedScopes2["Veiw"] = $scope;
  
  
// *****************************************************************************
// 現在の年、月、日を取得
// *****************************************************************************
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

/*
  Authenticator.getAnonymousToken()
  .then(function(authToken) {
    return Authenticator.login(authToken, "SJMMobileUser", "SJMMobileUser");
  })
  .then(function(user) {
      
  });
*/



    
// *****************************************************************************
  //詳細画面 取得SQL実行
// *****************************************************************************
  SQLText="";
  SQLText=SQLText + " SELECT ";
  SQLText=SQLText + "     PROJECT_NO ";
  SQLText=SQLText + "    ,PROJECT_MEI_J ";
  SQLText=SQLText + "    ,GENBA_PREF_CD ";
  SQLText=SQLText + "    ,GENBA_YUBIN_BANGO ";
  SQLText=SQLText + "    ,GENBA_PREF_J || GENBA_CITY_J || GENBA_STREET_J AS JYUSYO ";
  SQLText=SQLText + "    ,TATEMONO_YOTO ";
  SQLText=SQLText + "    ,SESHU_MEI ";
  SQLText=SQLText + "    ,SEKKEI_KANRI_MEI ";
  SQLText=SQLText + "    ,KENCHIKU_MEI ";
  SQLText=SQLText + "    ,JUCHU_KUBETU ";
  SQLText=SQLText + "    ,ROSAI ";
  SQLText=SQLText + "    ,ROSAI_SHAMEI ";
  SQLText=SQLText + "    ,TESUU_KIN_MEI ";
  SQLText=SQLText + "    ,TESUU_KIN ";
  SQLText=SQLText + "    ,TESUU_PAY_SAKI ";
  SQLText=SQLText + "    ,KESSAI_NO ";
  
  SQLText=SQLText + "    ,JUCHU_KEIJYO_TENSYO ";
  SQLText=SQLText + "    ,JUCHU_TENSYO ";
  SQLText=SQLText + "    ,GENBA_TENSYO ";
  SQLText=SQLText + "    ,WARIATE1 ";
  SQLText=SQLText + "    ,WARIATE_P1 ";
  SQLText=SQLText + "    ,WARIATE2 ";
  SQLText=SQLText + "    ,WARIATE_P2 ";
  SQLText=SQLText + "    ,WARIATE3 ";
  SQLText=SQLText + "    ,WARIATE_P3 ";
  
  SQLText=SQLText + " FROM  ";
  SQLText=SQLText + "    JCD_PRO " ;
  SQLText=SQLText + " WHERE  ";
  SQLText=SQLText + "    PROJECT_NO ='"+$rootScope.targetPROJECT_NO+"' ";
  
  
  var SQL = encodeURIComponent(SQLText);
  var FJ01sqlA = FJ01sql.create();
  promise = FJ01sqlA.find(SQL);
  promise.then(function(FJ01sqlA) {
    if (FJ01sqlA.length > 0) {
      $scope.genbas = FJ01sqlA;
      loadingModal.hide();
      
      //サービスを変数に格納
      project_data=FJ01sqlA;
      
      //スコープにデータを格納（これでHTMLに表示できる）
      $scope.disp_PROJECT_NO       =project_data[0].PROJECT_NO;      //プロジェクトno
      $scope.disp_PROJECT_MEI_J    =project_data[0].PROJECT_MEI_J;//プロジェクト名
      $scope.disp_GENBA_PREF_CD    =project_data[0].GENBA_PREF_CD;//現場都道府県コード
      $scope.disp_GENBA_YUBIN_BANGO=project_data[0].GENBA_YUBIN_BANGO; //郵便番号
      $scope.disp_JYUSYO           =project_data[0].JYUSYO;  //住所      
      $scope.disp_SESHU_MEI        =project_data[0].SESHU_MEI;  //施主
      $scope.disp_SEKKEI_KANRI_MEI =project_data[0].SEKKEI_KANRI_MEI;  //設計監理
      $scope.disp_KENCHIKU_MEI     =project_data[0].KENCHIKU_MEI;  //建築施工
      
      $scope.disp_JUCHU_KUBETU     =project_data[0].JUCHU_KUBETU;  //請負
      $scope.disp_JUCHU_KUBETU_MEI =fnJuchu_kubetu_mei_get(project_data[0].JUCHU_KUBETU);  //請負名      
      
      $scope.disp_ROSAI            =project_data[0].ROSAI;  //労災
      $scope.disp_ROSAI_MEI        =fnRosai_mei_get(project_data[0].ROSAI);  //労災名
    　$scope.disp_ROSAI_SHAMEI     =project_data[0].ROSAI_SHAMEI;  //労災会社
    　
    　$scope.disp_TATEMONO_YOTO    =project_data[0].TATEMONO_YOTO;  //建物用途
    　$scope.disp_TATEMONO_YOTO_MEI=$scope.tatemono_yoto_mei_get(project_data[0].TATEMONO_YOTO);  //建物用途名
    　
      $scope.disp_TESUU_KIN_MEI    =project_data[0].TESUU_KIN_MEI;    //手数金名
      $scope.disp_TESUU_KIN        =project_data[0].TESUU_KIN;        //手数金
      $scope.disp_TESUU_PAY_SAKI   =project_data[0].TESUU_PAY_SAKI;  //手数金支払先
      $scope.disp_KESSAI_NO        =project_data[0].KESSAI_NO;       //販売決裁No
      
      $scope.disp_JUCHU_KEIJYO_TENSYO     =project_data[0].JUCHU_KEIJYO_TENSYO;  //受注計上店所
      

      //----------------------------------------------
      //現場都道府県名を取得
      //----------------------------------------------
      var sv1 = Myservice1.create();//サービスを変数に格納
      sv1.tensyo_mei_get($scope.disp_GENBA_PREF_CD)
        .then(
          function(o_resolve) {
            console.log(o_resolve+"2");
            $scope.disp_GENBA_PREF_MEI=o_resolve;
            //return '**' + o_resolve + '**';
          }, 
          function(o_reject) {
            console.log(o_reject);
            $scope.disp_GENBA_PREF_MEI=o_reject;
          },
          function(o_notify) {
            console.log(o_notify);
            $scope.disp_GENBA_PREF_MEI=o_notify;
          }
        );
      
      //----------------------------------------------
      //受注計上店所名を取得
      //----------------------------------------------
      var sv1 = Myservice1.create();//サービスを変数に格納
      sv1.tensyo_mei_get($scope.disp_JUCHU_KEIJYO_TENSYO)
        .then(
          function(o_resolve) {
            console.log(o_resolve+"2");
            $scope.disp_JUCHU_KEIJYO_TENSYO_NAME=o_resolve;
            //return '**' + o_resolve + '**';
          }, 
          function(o_reject) {
            console.log(o_reject);
            $scope.disp_JUCHU_KEIJYO_TENSYO_NAME=o_reject;
          },
          function(o_notify) {
            console.log(o_notify);
            $scope.disp_JUCHU_KEIJYO_TENSYO_NAME=o_notify;
          }
        );
      

      /*--------------------------------------------------
      //サンプル　終わり
      //--------------------------------------------------
    　//店所取得
      //SQL_fn="SELECT COM_VAL1 FROM JCCOMMS WHERE COM_TYPE='040' AND COM_KEY='"+project_data[0].JUCHU_KEIJYO_TENSYO+"'";
      SQL_fn="SELECT COM_VAL1 FROM JCCOMMS WHERE COM_TYPE='040' AND COM_KEY='61'";
      
      console.log(SQL_fn);
      var SQL2 = encodeURIComponent(SQL_fn);
      var tensyoA = FJ01sql.create();
      promise = tensyoA.find(SQL2);
      promise.then(function(tensyoA) {
          if (tensyoA.length > 0) {
              comA=tensyoA
              ccd=comA[0].COM_VAL1;
              $scope.disp_JUCHU_KEIJYO_TENSYO_NAME=ccd;
          }else{
              ccd=データ無し
              $scope.disp_JUCHU_KEIJYO_TENSYO_NAME=ccd;
          }
      }); 
      //--------------------------------------------------
      //サンプル 終わり
      //--------------------------------------------------
      */
      
      $scope.disp_JUCHU_TENSYO        =project_data[0].JUCHU_TENSYO;  //受注店所
      $scope.disp_GENBA_TENSYO        =project_data[0].GENBA_TENSYO;  //現場店所
 
      
      
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
  


  
  
  
  

// *****************************************************************************
// 店所名取得
// *****************************************************************************
/*
  $scope.Tensyo_name_get = function(cd) {
    var item = "dd";
    var SQL_fn
    
    SQL_fn="SELECT COM_VAL1 FROM JCCOMMS WHERE COM_TYPE='040' AND COM_KEY='61'";
    console.log(SQL_fn);
    var SQL = encodeURIComponent(SQL_fn);
    var FJ01sqlA = FJ01sql.create();
    promise = FJ01sqlA.find(SQL);
    promise.then(function(FJ01sqlA) {
    if (FJ01sqlA.length > 0) {
        
      //サービスを変数に格納
      //getDB=FJ01sqlA;        
        
      return FJ01sqlA;        
        
      //item = getDB[0].COM_VAL1;
      
      //$scope.disp_JUCHU_KEIJYO_TENSYO_NAME=item;
      //return item;
    }else{
      //item="DBにデータなし";
      
      //$scope.disp_JUCHU_KEIJYO_TENSYO_NAME=item;
      return item;
    }     
   })
   
   //return item;
  }
 */  
  
  
  

// *****************************************************************************
// 検索リストをクリックしたときの処理
// *****************************************************************************
  /*
  $scope.dayItemSelect = function(index) {
    var selectItem = $scope.genbas[index];
//alert(selectItem.groupno);
    app.navi.pushPage('Main_Search_detail.html', { animation : 'slide' } );
    $rootScope.targetProject = selectItem.PROJECT_NO;

  }
  */


// *****************************************************************************
// 建物用途名
// *****************************************************************************
  $scope.tatemono_yoto_mei_get = function(cd) {
    var item = null;
    
    item="開発中"
    
    return item;
   };
   

}])






















