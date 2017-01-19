/**
 * Fujitec SSO ログインサービス.
 * promise で、セットアップデータを返す
 */
app.service('FujitecSSOService', function($q, $http, Authenticator, AppPotConfig) {
  var that = this;

  this.CLIENT_ID = "462380344197-mees6qsidk192st7ecs0hk7ebpsegv3l.apps.googleusercontent.com";
  this.CLIENT_SECRET ="py5TsjHjUR-gBY2tlLjjsqWM";
  this.REDIRECT_URI_INAPP_BROWSER = "http://localhost";
  this.REDIRECT_URI_SYSTEM_BROWSER = "http://fj0n0106.fujitec.co.jp/oauth2-google/google_logincheck_mobile_redirector.htm";

  this.userId = "";
  this.getUserId = function() {
    return this.userId;
  };
  this.setUserId = function(val) {
    this.userId = val;
  };

  this.userName = "";
  this.getUserName = function() {
    return this.userName;
  };
  this.setUserName = function(val) {
    this.userName = val;
  };


  // ログアウト完了後に表示される URI （複数ありえる？）
  this.LOGOUTED_URI = [
    // Gluegent にリダイレクトされるケース
    "https://auth.gluegent.net/sso/logout.cgi?logout=true",
    // Google のログイン画面に戻るケース
    "https://accounts.google.com/ServiceLogin?elo=1"
  ];

  this.usesInAppBrowser = false;

  this.redirectUri = function() {
    if (this.usesInAppBrowser) {
      return this.REDIRECT_URI_INAPP_BROWSER;
    }
    return this.REDIRECT_URI_SYSTEM_BROWSER;
  };

  this.authUri = function(state) {
    return (
    			"https://accounts.google.com/o/oauth2/auth"
			+ "?client_id=" + this.CLIENT_ID
			+ "&response_type=code"
			+ "&scope=openid+email"
			+ "&redirect_uri=" + encodeURIComponent(this.redirectUri())
			+ "&state=" + encodeURIComponent(state)
			+ "&hd=jp.fujitec.com");
  };

  this.logoutUri = function() {
    return (
        "https://accounts.google.com/logout");
  };

  this.login = function() {
    var deferred = $q.defer();
    var promise = deferred.promise;
    
    if (window.device != undefined) {
      var platform = window.device.platform;
      if ((platform == "Android") || (platform == "iOS")) {
        // Android と iOS の場合だけ、InAppBrowser を利用する
        this.usesInAppBrowser = true;
      }
    }
//    alert("usesGoogleLogin=" + usesGoogleLogin);

    var googleAuthUrl = this.authUri("abc");

    if (this.usesInAppBrowser) {
      var w = window.open(googleAuthUrl, "_blank", "location=no,toolbar=no,hidden=yes");

      // ブラウザを閉じた時のリスナーを設定する
      // あとで remove できるように、変数に入れておく必要がある？
      var browserExitListener = function(event) {
        deferred.reject("ログインがキャンセルされました");
      };
      w.addEventListener("exit", browserExitListener);

      w.addEventListener("loadstart", function(event) {
        var url = event.url;
//alert(url);
        var code = /localhost\/.*[\?&]code=(.+?)[&$]/.exec(url);
        var error = /localhost\/.*[\?&]error=(.+?)[&$]/.exec(url);

        if (code || error) {
//alert("match");
          // 成功であれ失敗であれ、結果が確定した時点でブラウザを閉じる
          // スクリプトで閉じる場合は、exit イベントを拾わないように、リスナーを削除する
  
          w.removeEventListener("exit", browserExitListener);

//alert("before close");
          w.close();
//alert("after close");

          var queryStringExp = /(\?.+)[#$]/.exec(url);
          
          that.getSSO(queryStringExp[1]).then(
            function(){
              // ログイン成功
              deferred.resolve();
            },
            function(errorReason) {
              // ログイン失敗
              deferred.reject(errorReason);
            }
          );
        }

      });

      w.addEventListener("loadstop", function(event) {
        w.show();
      });

    } else {
      // InAppBrowser を利用しない場合

      //メッセージが送られたときに反応するイベントリスナー
      window.addEventListener(
        "message",
        function(e) {
          //alert("received origin=" + e.origin);
          //alert("received data=" + e.data);
          if (e.data.substring(0, 33) == "response-google-auth-querystring:") {
            if (timerId != null) {
              clearTimeout(timerId);
            }
            var queryString = e.data.substring(33);
            //alert("qs = " + queryString);

            that.getSSO(queryString).then(
              function(){
                // ログイン成功
                deferred.resolve();
              },
              function(errorReason) {
                // ログイン失敗
                deferred.reject(errorReason);
              }
            );
          }
        },
        false);

      // 子画面を開きつつ
      //alert(googleAuthUrl);
      var w = window.open(googleAuthUrl, "_blank", "location=no,toolbar=no");

      // 継続的にポーリングメッセージを送る
      var timerId = null;
      var polling = function() {
        //alert('post');
        w.postMessage("request-google-oauth-querystring", "*");
        timerId = setTimeout(polling, 500);
      };
      polling();
    }
        
    return promise;
  };
  
  /**
   * シングルサインオン情報取得.
   */
  this.getSSO = function(queryString) {  
    var deferred = $q.defer();
    var promise = deferred.promise;

    var code = /[\?&]code=(.+?)[&$]/.exec(queryString);
    var error = /[\?&]error=(.+?)[&$]/.exec(queryString);

//alert("code=" + code);
//alert("error=" + error);

    var ssoUrl;

    if (code) {
      // 成功
      if (dontUseAppPot) {
        // AppPot を使わない場合
        ssoUrl =
            "http://fj0n0106.fujitec.co.jp/oauth2-google/google_logincheck_mobile.aspx"
          + queryString
          + "&redirect_uri=" + encodeURIComponent(that.redirectUri()); // redirect_uri を追加する
//alert(ssoUrl);
        $http.get(ssoUrl)
          .then(function(response){
//alert(response);
            // 成功した場合
//alert(response.data);
            var ssoObj = response.data;
            if ((ssoObj != void 0) && (ssoObj.userId != void 0)) {
              that.setUserId(ssoObj.userId);
              that.setUserName(ssoObj.userName);
//alert(ssoObj.userName);
              deferred.resolve();
            } else {
              deferred.reject("ログインエラー 001N");
            }
          })
          .catch(function(response) {
            alert("error " + response.status + " " + response.data);
          })
          .finally(function() {
          });
      } else {
        // AppPot を使う場合
        ssoUrl =
            AppPotConfig.apiUrl() + "/gateway/"
          + "fujitec_sso_service"
          + "/ssoObj"
          + queryString
          + "&redirect_uri=" + encodeURIComponent(that.redirectUri()); // redirect_uri を追加する
  //alert(ssoUrl);
        Authenticator.getAnonymousToken()
          .then(function(authToken) {
            return Authenticator.login(authToken, "training_user", "123456");
          })
          .then(function(user) {
            $http.get(ssoUrl)
              .then(
                function(response){
                  // 成功した場合
                  throwErrorIfErrorStatus(response);
                  var ssoObj = response.data.results.ssoObj;
                  if ((ssoObj != void 0) && (ssoObj.userId != void 0)) {
                    that.setUserId(ssoObj.userId);
                    that.setUserName(ssoObj.userName);
//alert(ssoObj.userName);
                    deferred.resolve();
                  } else {
                    deferred.reject("ログインエラー 001");
                  }
                },
                function() {
                  // 失敗した場合
                  deferred.reject("ログインエラー 002");
                }
              );
          });
      }

    } else if (error) {
      // エラーを返す
      deferred.reject("ログインエラー 003 " + error[1]);
    } else {
      // それ以外も、エラーを返す
      deferred.reject("ログインエラー 004 Unknown");
    }
    return promise;
  };

  /**
   * ログアウト.
   */
  this.logout = function() {
    var deferred = $q.defer();
    var promise = deferred.promise;
    
    if (window.device != undefined) {
      var platform = window.device.platform;
      if ((platform == "Android") || (platform == "iOS")) {
        // Android と iOS の場合だけ、InAppBrowser を利用する
        this.usesInAppBrowser = true;
      }
    }

    var googleLogoutUrl = this.logoutUri();
//alert(googleLogoutUrl);

    if (this.usesInAppBrowser) {
      var w = window.open(googleLogoutUrl, "_blank", "location=no,toolbar=no,hidden=no");

      //w.addEventListener("loadstart", function(event) {
      //});

      w.addEventListener("loadstop", function(event) {
        var url = event.url;
        
//alert("url=" + url);
        var p = url.indexOf("#");
        if (0 <= p) {
          // url に # が含まれていたら、その前までを切り出す
          url = url.substring(0, p);
//alert("new url=" + url);
        }
        var index = $.inArray(url, that.LOGOUTED_URI);
//alert("index=" + index);
        if (0 <= index) {
          // ログアウト成功
          // ウィンドウを閉じる
          w.close();
          deferred.resolve();

        }
      });

    } else {
      // InAppBrowser を利用しない場合

      // 結局、自前のページにリダイレクトできない（強制的に Gluegent にリダイレクトされる）ので、
      // 制御できない。
      // 子ウィンドウを開いたら、あとはログアウトが正常に完了したものとする。
      var w = window.open(googleLogoutUrl, "_blank", "location=no,toolbar=no");

      // ログアウト成功
      deferred.resolve();
    }
        
    that.setUserId("");
    that.setUserName("");
    
    return promise;
  };

});