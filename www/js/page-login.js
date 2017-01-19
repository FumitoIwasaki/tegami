app.controller('SubController15',['$scope','$rootScope','$http','SettingsService','FujitecSSOService','INQUIRE1','FJ01sql', function($scope, $rootScope, $http, SettingsService, FujitecSSOService, INQUIRE1,FJ01sql) {

  SettingsService.setSharedScope("Login", $scope);
//  sharedScopes3 = {};
//  sharedScopes3["Login"] = $scope;

  // ログイン実行中か否か
  $scope.nowInLogin = false;
  $scope.loginCompleted = false;

  $scope.loginByGoogle = function() {
    $scope.nowInLogin = true;
    $scope.loginCompleted = false;
    loadingModal.show();

    var tmpDeparture = new Date();
    var tmpYear = tmpDeparture.getFullYear();
    var tmpMonth = tmpDeparture.getMonth()+1;
    var tmpDay = tmpDeparture.getDate();
    if (tmpMonth < 10) {
      tmpMonth = '0' + tmpMonth;
    }
    if (tmpDay < 10) {
      tmpDay = '0' + tmpDay;
    }
    var tmpYyyyMmDd = ""+tmpYear+tmpMonth+tmpDay;
alert(tmpYyyyMmDd);


    FujitecSSOService.login()
    .then(
      function() {
        $scope.loginCompleted = true;
        var userId = FujitecSSOService.getUserId();
        var userName = "";
        localStorage.setItem("loginUserId", userId);
        localStorage.setItem("loginDate", tmpYyyyMmDd);

        /*
        var SQLText = "select decode(NAME2,null,NAME,NAME2) NAME from JNJUSER.SHAIN where KOJIN_C='"+userId+"'";
        var SQL = encodeURIComponent(SQLText);
        var INQuire1 = INQUIRE1.create();
        promise = INQuire1.find(SQL);
        promise.then(function(INQuire1s) {
          if (INQuire1s.length > 0) {
            userName = INQuire1s[0].NAME;            
            userName = userName.replace(/　/g, "");
            
            localStorage.setItem("loginUserName", userName);            
            $scope.gotoStartPage();
            
          }
        })
        .catch(function(error) {
          localStorage.setItem("loginUserName", userName);
          $scope.gotoStartPage();
        });
        */
        
  SQLText="select * from JNV_JNSHAIN_01 where USER_ID='"+userId+"'";
  /*
  SQLText=           " select "
  SQLText= SQLText + "     A.USER_NAME "
  SQLText= SQLText + "    ,A.DEPT_CODE "
  SQLText= SQLText + "    ,A.DEPT_CODE_J "
  SQLText= SQLText + "    ,A.USER_EMAIL "
  SQLText= SQLText + "    ,B.TENSYO_C "
  SQLText= SQLText + "    ,C.COM_VAL1 AS TENSYO_NAME "
  SQLText= SQLText + "    ,B.KEIJYO_TENSYO "
  SQLText= SQLText + "    ,B.AREA_C "
  SQLText= SQLText + "    ,B.HANBETU "
  SQLText= SQLText + "  from  "
  SQLText= SQLText + "     JNV_JNSHAIN_01 A "
  SQLText= SQLText + "    ,JCD_USER B "
  SQLText= SQLText + "    ,(select * from JCCOMMS WHERE COM_TYPE='040' ) C "  
  SQLText= SQLText + "  where  "
  SQLText= SQLText + "        A.USER_ID='"+userId+"' "
  SQLText= SQLText + "   AND A.USER_ID=B.KOJIN_C "
  SQLText= SQLText + "   AND B.TENSYO_C=C.COM_KEY(+) "  
  */
  var SQL = encodeURIComponent(SQLText);
  var FJ01sqlA = FJ01sql.create();
        promise = FJ01sqlA.find(SQL);
        promise.then(function(FJ01sqlAs) {
          if (FJ01sqlAs.length > 0) {
            
           //ユーザ名  
            userName = FJ01sqlAs[0].USER_NAME;            
            userName = userName.replace(/　/g, ""); 
            alert(userName);
            localStorage.setItem("loginUserName", userName); 
            
                    //alert(userName);
            
            //所属部課
            my_dept_code = FJ01sqlAs[0].DEPT_CODE;  
            localStorage.setItem("my_dept_code", my_dept_code);

            //所属部課名
            my_dept_code_j = FJ01sqlAs[0].DEPT_CODE_J;  
            localStorage.setItem("my_dept_code_j", my_dept_code_j);
 
            //メールアドレス
            my_mail_c = FJ01sqlAs[0].USER_EMAIL;  
            localStorage.setItem("my_mail_c", my_mail_c);   
                        
            //所属店所
            my_tensyo_cd = FJ01sqlAs[0].TENSYO_C; 
            console.log(my_tensyo_cd);
            localStorage.setItem("my_tensyo_cd", my_tensyo_cd);
            
            //所属店所名
            my_tensyo_name = FJ01sqlAs[0].TENSYO_NAME;
            localStorage.setItem("my_tensyo_name", my_tensyo_name);
            
            //計上店所
            my_keijyo_tensyo_cd = FJ01sqlAs[0].KEIJYO_TENSYO;  
            localStorage.setItem("my_keijyo_tensyo_c", my_keijyo_tensyo_cd); 
            
            //エリア
            my_area_c = FJ01sqlAs[0].AREA_C;
            localStorage.setItem("my_area_c", my_area_c); 
            
            //判別コード
            my_hanbetu = FJ01sqlAs[0].HANBETU;  
            localStorage.setItem("my_hanbetu", my_hanbetu); 
            
            
            $scope.gotoStartPage();
            
          }
        })
        .catch(function(error) {
          localStorage.setItem("loginUserName", userName);
          $scope.gotoStartPage();
        });        
        
        
        
        
        
      },
      function(errorReason) {
        // ログイン失敗の場合
        if (errorReason != void 0) {
          ons.notification.alert({
            title: 'Pick&Ship',
            message: errorReason,
            modifier: 'material',
            callback: function(index) {
            }
          });
        }
      }
    )
    .finally(
      function() {
        $scope.nowInLogin = false;
        loadingModal.hide();
      }
    );
/*
    var userId = "A833";
    var userName = "松本紘直";
    localStorage.setItem("loginUserId", userId);
    localStorage.setItem("loginUserName", userName);
    localStorage.setItem("loginDate", tmpYyyyMmDd);
    loadingModal.hide();
    $scope.gotoStartPage();
   */
    
    
    
  };


  $scope.gotoStartPage = function() {
    var userId = localStorage.getItem("loginUserId");
    var userName = localStorage.getItem("loginUserName");
    var my_dept_code = localStorage.getItem("my_dept_code");
    var my_dept_code_j = localStorage.getItem("my_dept_code_j");
    var my_tensyo_cd = localStorage.getItem("my_tensyo_cd");
    var my_tensyo_name = localStorage.getItem("my_tensyo_name");

    

    $rootScope.kojinc = userId;
    $rootScope.simei = userName;
    $rootScope.my_dept_code = my_dept_code;
    $rootScope.my_dept_code_j = my_dept_code_j;
    $rootScope.my_tensyo_cd = my_tensyo_cd;
    $rootScope.my_tensyo_name = my_tensyo_name;

    app.navi.replacePage("mainmenu.html");
  }

  $scope.gotoStartPageSub = function() {
    var userId = localStorage.getItem("loginUserId");
    var userName = localStorage.getItem("loginUserName");
    var tmpYyyyMmDd = localStorage.getItem("loginDate");
//tmpYyyyMmDd = "20160906";

    var tmpDeparture = new Date();
    var tmpYear = tmpDeparture.getFullYear();
    var tmpMonth = tmpDeparture.getMonth();
    var tmpDay = tmpDeparture.getDate();
    if (tmpMonth < 10) {
      tmpMonth = '0' + tmpMonth;
    }
    if (tmpDay < 10) {
      tmpDay = '0' + tmpDay;
    }
    var tmpYyyyMmDd2 = ""+tmpYear+tmpMonth+tmpDay;
//alert(tmpYyyyMmDd2);

    if (!userId) {
      loadingModal.hide();
    }else{
      if (!userName) {
        $scope.logoutFromGoogle();
        loadingModal.hide();
      }else{
        if (tmpYyyyMmDd < tmpYyyyMmDd2) {
          $scope.logoutFromGoogle();
          loadingModal.hide();
        }else{
          $scope.loginCompleted = true;
          FujitecSSOService.setUserId(userId);
          FujitecSSOService.setUserName(userName);

          loadingModal.hide();
          $scope.gotoStartPage();
        }
      }
    }
  }

  $scope.logoutFromGoogle = function() {
    loadingModal.show();
    FujitecSSOService.logout()
    .then(
      function(){
        $scope.nowInLogin = false;
        $scope.loginCompleted = false;
        localStorage.removeItem("loginUserId");
        localStorage.removeItem("loginUserName");
        localStorage.removeItem("loginDate");
        app.navi.replacePage("login.html");
      }
    )
    .finally(
      function() {
        loadingModal.hide();
      }
    );
  }

  ons.ready(function() {
    loadingModal.show();
    $scope.gotoStartPageSub();
  });

}]);
