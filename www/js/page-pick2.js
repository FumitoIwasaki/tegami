// This is a JavaScript file

app.controller('SubController_Pick2',['$scope','$rootScope','INQUIRE','FJ01sql','Authenticator', function($scope, $rootScope, INQUIRE,FJ01sql, Authenticator) {

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




  
    
// *****************************************************************************
  //検索結果リスト取得SQL実行
// *****************************************************************************

  SQLText="";
  SQLText=SQLText + " SELECT ";
  SQLText=SQLText + "    A.PROJECT_NO ";
  SQLText=SQLText + "   ,A.PROJECT_MEI_J ";
  SQLText=SQLText + "   ,A.JUCHU_TENSYO ";
  SQLText=SQLText + "   ,A.JUCHU_KEIJYO_TENSYO ";
  SQLText=SQLText + "   ,A.GENBA_TENSYO ";
  SQLText=SQLText + "   ,B.TKOBAN ";
  SQLText=SQLText + "   ,B.KEIYAKU_KIN ";
  SQLText=SQLText + "   ,B.KEIYAKU_NOKI ";
  SQLText=SQLText + " FROM  ";
  SQLText=SQLText + "    JCD_PRO A " ;
  SQLText=SQLText + "   ,JCD_JUCHU B ";
  SQLText=SQLText + " WHERE  ";
  SQLText=SQLText + "       A.PROJECT_NO =B.PROJECT_NO ";
  
  //検索条件
  SQLwhere="";
  
  //プロジェクトNo
  if(main_pronect_no!=""){
      
      if(main_pronect_no.length==10){
        SQLwhere=SQLwhere + "   AND A.PROJECT_NO ='"+main_pronect_no+"' ";
      }else{      
        if(main_pronect_no.length>=8){
          SQLwhere=SQLwhere + "   AND A.PROJECT_NO like '"+main_pronect_no+"%' ";
        }    
      }
  }
  
  //工番
  main_tkoban=main_tkoban.toUpperCase();//大文字化
  if(main_tkoban!=""){
      if(main_tkoban.length==7){
        SQLwhere=SQLwhere + "   AND B.TKOBAN ='"+main_tkoban+"' ";
      }else{      
        if(main_tkoban.length>=5){
          SQLwhere=SQLwhere + "   AND B.TKOBAN like '"+main_tkoban+"%' ";
        }    
      }          
          
  }  
  
  //条件が何も無いとき
  if(SQLwhere==""){
      SQLwhere="   AND A.PROJECT_NO='Z'";
  }
  
  //order by
  SQLOrderBy="";
  SQLOrderBy=SQLOrderBy + " ORDER BY"
  SQLOrderBy=SQLOrderBy + "    PROJECT_NO"  
  SQLOrderBy=SQLOrderBy + "   ,TKOBAN"  

  //WHERE文と結合
  SQLText=SQLText + SQLwhere + SQLOrderBy;


  //iwf追加pick&ship
  SQLText="";
  SQLText=SQLText + " SELECT '12345' as PACKAGE_NO, ";
  SQLText=SQLText + "   TKOBAN,BLOCK ";
  SQLText=SQLText + " FROM BRPACKLOC " ;
  SQLText=SQLText + " WHERE  ";
  SQLText=SQLText + " TKOBAN='EHA3751' AND BLOCK='CA' AND BLOCK_SEQ_NO='01' ";
  //SQLText=SQLText + "   PACKAGE_NO = '"+main_tkoban+"' ";

  //プロジェクトNo
  if(main_package_no!=""){     
    //alert("[package_no_page-pick2.js]"+main_package_no);      
    SQLText="";
    SQLText=SQLText + " SELECT '"+main_package_no+"' as PACKAGE_NO,";
    SQLText=SQLText + "   TKOBAN,BLOCK ";
    SQLText=SQLText + " FROM BRPACKLOC " ;
    SQLText=SQLText + " WHERE  ";
    SQLText=SQLText + " TKOBAN='"+main_package_no+"' AND BLOCK='CA' AND BLOCK_SEQ_NO='01' ";
  }

  //console.log(SQLText);
  
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
      ons.notification.alert({ title: "確認", message: "データがありません。" });
    }
  })
  .catch(function(error) {
    $scope.genbas = "";
    loadingModal.hide();
    ons.notification.alert({ title: "エラー", message: "データベースへの接続に失敗しました" });
  });
  
// *****************************************************************************
//前ページ　次ページへのアクション
// *****************************************************************************

    $scope.len = 10;//1ページに表示する件数
    $scope.start = 0//検索結果リストで何件目から表示するか。これを変えることでフィルターがかかる

    //次ページ、前ページをクリックしたときの動作
    $scope.pager = function(page){
        
      //次ページへ    
      if(page=="next"){
        //最終ページにいっていたら警告
        if($scope.genbas.length>$scope.start + $scope.len){
          $scope.start = $scope.start + $scope.len;            
        }else{
            alert("最終ページです");
        }
      }
      
      //前ページへ    
      if(page=="back"){
        //alert($scope.genbas.length);
        //alert($scope.start + $scope.len);
        if(   $scope.genbas.length>$scope.start - $scope.len
           && $scope.start - $scope.len>=0){
          $scope.start = $scope.start - $scope.len;
        }else{
          alert("最初のページです"); 
        }
      }
        
      //$scope.start = $scope.len * page;
    };
      

// *****************************************************************************
// 検索リストをクリックしたときの処理
// *****************************************************************************
  $scope.dayItemSelect = function(index) {
    var selectItem = $scope.genbas[index];
    //alert(index);
    app.navi.pushPage('Main_Search_detail.html', { animation : 'slide' } );

    $rootScope.targetPROJECT_NO = selectItem.PROJECT_NO;
    $rootScope.targetTKOBAN = selectItem.TKOBAN;
    
  
  }




}]);
