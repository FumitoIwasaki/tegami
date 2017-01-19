
//    ons.bootstrap();
var app = angular.module('app', ['onsen']);
//    var app = ons.bootstrap('app', ['onsen']);

app.run(["$rootScope","Authenticator","LocalDBInitializer",function($rootScope,Authenticator,LocalDBInitializer) {
//ここから開始
/*
    処理の流れとしては
    1.匿名トークンを取得
    2.ログインしてユーザトークン受け取り
    3.初期処理（今回はApppotのDBにテーブルを作成）
*/
  Authenticator.getAnonymousToken()
  .then(function(authToken) {
    return Authenticator.login(authToken, "SJMMobileUser", "SJMMobileUser");  
    //return Authenticator.login(authToken, "gpslocationsearch_user", "fujitec0600");
  })
  .then(function(user) {
//        alert('Login!!');
  })
  .catch(function(error) {
    if (error.code && error.code == "111") {
      alert(error.message);
    }
    else {
      alert(error.message);
    }
  });            
}]);

(function(){
  'use strict';

  var currentItem = {};

  $(document).on('pageinit', '#detail-page', function() {
    $('.item-title', this).text(currentItem.title);
    $('.item-desc', this).text(currentItem.desc);
    $('.item-label', this).text(currentItem.label);
    $('.add-note-action-item', this).click(function () {
        alert('dummy message');
    });
  });

//  $(document).on('pageinit', '#list-page', function() {
//    $('.item', this).on('click', function() {
//      currentItem = {
//        title : $('.item-title', this).text(),
//        desc : $('.item-desc', this).text(),
//        label : $('.item-label', this).text()
//      };

//      app.navi.pushPage('detail.html');
//    });
//  });

  $(document).on('pageinit', '#list-page', function() {
    $('.item', this).on('click', function() {
      currentItem = {
        title : $('.item-title', this).text(),
        desc : $('.item-desc', this).text(),
        label : $('.item-label', this).text()
      };

      app.navi.pushPage('disindex.html');
      $(document).on('pageinit','#disindex', function() {
          var item = localStorage.getItem("key1");
          var obj = JSON.parse(item);
          document.getElementById("groupdisp").textContent = obj.name;
      })

    });
  });

})();

// *****************************************************************************
//  GPS位置確認したときのエラー表示処理
// *****************************************************************************
  function onError(positionError) {
    loadingModal.hide();
    var code = positionError.code;
    switch(code) {
      case 1:
        errorMessage = '位置情報の取得がユーザーによって許可されていません。';
        break;
      case 2:
        errorMessage = '位置情報の取得が行えません。';
        break;
      case 3:
        errorMessage = '時間切れです。位置情報が利用できない可能性があります。';
        break;
      default:
        errorMessage = 'エラーが発生しました。' + code;
        break;
    }
    ons.notification.alert({ title: "GPS測位エラー", message: errorMessage });
  }

