app.controller('SubController6',['$scope','$rootScope','INQUIRE','Authenticator', function($scope, $rootScope, INQUIRE, Authenticator) {

// *****************************************************************************
// 最寄現場検索をクリックした場合の処理
// *****************************************************************************
  $scope.sarchJob2 = function() {
    loadingModal.show();

    // 画面にリストタイトル欄を表示する。
    document.getElementById("escTitle").innerHTML = "<div style='font-size:8pt;'>現場を選択してください</div><div style='font-size:8pt;'>元工番  :  登録番号</div><div style='font-size:8pt;'>現場名</div>";

    // 緯度・経度を取得する。
    var options = {maximumAge: 3000, timeout: 15000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(function(position) {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

// -----------------------------------------------------------------------------
// 世界測地系から日本測地系に変更
// 日本測地系緯度(latitude) =世界測地系緯度 + 0.00010696*世界測地系緯度 - 0.000017467*世界測地系経度 - 0.0046020
// 日本測地系経度(longitude) =世界測地系経度 + 0.000046047*世界測地系緯度 + 0.000083049*世界測地系経度 - 0.010041
      var latitude2 = latitude + 0.00010696 * latitude - 0.000017467 * longitude - 0.0046020;
      var longitude2 = longitude + 0.000046047 * latitude + 0.000083049 * longitude - 0.010041;

// -----------------------------------------------------------------------------
// 度数に変換 (XXX度XX分XX秒)

      var ido_i, ifu_i, iby_i, ifu_s, iby_s, iby_c, iby_l, iti, iby_w, ido_m, ido_w;
      var kdo_i, kfu_i, kby_i, kfu_s, kby_s, kby_c, kby_l, kby_w, kdo_m, kdo_w;
      var latmin, latmax, lat1, lonmin, lonmax, lon1;
      var i, j;

      // 緯度の変換
      ido_i = Math.floor(latitude2);
      ifu_i = Math.floor((latitude2 - ido_i) * 60);
      iby_i = ((latitude2 - ido_i) * 60 - ifu_i) * 60;

      var ifu_s = String(ifu_i);
      if (ifu_s.length == 1) {
        var ifu_s = "0" + ifu_s;
      }

      var iby_s = "";
      var iby_t = String(Math.floor(iby_i));
      if (iby_t.length == 1) {
        var iby_s = "0";
      }

      iby_c = String(iby_i);
      iby_l = iby_c.length;
      iti = iby_c.indexOf(".");
      if (iti > 0) {
        iby_w = iby_c.substr(0, iti);
        iby_w = ""+iby_w+iby_c.substr(iti+1,10);
        iby_c = iby_w;
      }
      ido_m = String(ido_i)+ifu_s+iby_s+iby_c;
      ido_w = ido_m.substr(0, 9);

      // 経度の変換
      kdo_i = Math.floor(longitude2);
      kfu_i = Math.floor((longitude2 - kdo_i) * 60);
      kby_i = ((longitude2 - kdo_i) * 60 - kfu_i) * 60;

      kfu_s = String(kfu_i);
      if (kfu_s.length == 1) {
        kfu_s = "0"+kfu_s;
      }

      kby_s = "";
      var kby_t = String(Math.floor(kby_i));
      if (kby_t.length == 1) {
        var kby_s = "0";
      }

      kby_c = String(kby_i);
      kby_l = kby_c.length;
      iti = kby_c.indexOf(".");
      if (iti > 0) {
        kby_w = kby_c.substr(0, iti);
        kby_w = ""+kby_w+kby_c.substr(iti+1,10);
        kby_c = kby_w;
      }
      kdo_m = String(kdo_i)+kfu_s+kby_s+kby_c;
      kdo_w = kdo_m.substr(0, 10);

      // 現場を抽出する緯度・経度の範囲を決定する。
      lat1 = parseFloat(ido_w);
      latmin = String(lat1 - 30000);
      latmax = String(lat1 + 30000);

      lon1 = parseFloat(kdo_w);
      lonmin = String(lon1 - 30000);
      lonmax = String(lon1 + 30000);

      // 変数の初期設定。
      var genbalist = [
        {
          KOBAN: "",
          TOROKU: "",
          GENBAMEI: "",
          IDO: "",
          KEIDO: "",
          CHECK: ""
        }
      ];
      var dispGenba = [];
      var tmpido, tmpkeido, tmpkyori, tmpbango;


      // 最寄（範囲内）にある現場を抽出する。
      var SQLText = "select KOBAN,TOROKU,GENBAMEI,IDO,KEIDO from JKUSER.KBMAS "
                  + "where IDO >= '"+latmin+"' and IDO <= '"+latmax+"' "
                  + "and KEIDO >= '"+lonmin+"' and KEIDO <= '"+lonmax+"' "
                  + "and TOROKU is not null "
                  + "order by TOROKU";
      var SQL = encodeURIComponent(SQLText);
      var INQuire = INQUIRE.create();
      promise = INQuire.find(SQL);
      promise.then(function(INQuires) {

        // 以下、現場が見つかった場合の処理
        if (INQuires.length > 0) {
          var Cnt = INQuires.length;

          genbalist = INQuires;

          // ソート済みの現場に「１」を登録し、再度ソート対象とならないため。
          // 初期値として「０」を設定しておく。
          for (i = 0; i < Cnt; i++) {
            genbalist[i].CHECK = "0";
          }

          // ソート後の現場リストを格納するための変数を初期化する。
          for (i = 0; i < Cnt; i++) {
            dispGenba[i] = {
              KOBAN: "",
              TOROKU: "",
              GENBAMEI: ""
            }
          }

          for (i=0; i < Cnt; i++) {
            tmpkyori = 9999999999;
            tmpbango = 0;
            for (j=0; j < Cnt; j++) {

              // CHECKの値が「１」のデータは既にdispGenbaに格納されているため対象外とする。
              if (genbalist[j].CHECK == "0") {

                // 現在地の現場の位置の差を計算する。
                if (parseFloat(ido_w) >= parseFloat(genbalist[j].IDO)) {
                  tmpido = parseFloat(ido_w) - parseFloat(genbalist[j].IDO);
                }else{
                  tmpido = parseFloat(genbalist[j].IDO) - parseFloat(ido_w);
                }
                if (parseFloat(kdo_w) >= parseFloat(genbalist[j].KEIDO)) {
                  tmpkeido = parseFloat(kdo_w) - parseFloat(genbalist[j].KEIDO);
                }else{
                  tmpkeido = parseFloat(genbalist[j].KEIDO) - parseFloat(kdo_w);
                }

                // 現場位置がより近ければdispGenbaに格納していく。
                if (tmpido >= tmpkeido) {
                  if (tmpkyori > tmpido) {
                    dispGenba[i].KOBAN = genbalist[j].KOBAN;
                    dispGenba[i].TOROKU = genbalist[j].TOROKU;
                    dispGenba[i].GENBAMEI = genbalist[j].GENBAMEI;
                    tmpbango = j;
                    tmpkyori = tmpido;
                  }
                }else{
                  if (tmpkyori > tmpkeido) {
                    dispGenba[i].KOBAN = genbalist[j].KOBAN;
                    dispGenba[i].TOROKU = genbalist[j].TOROKU;
                    dispGenba[i].GENBAMEI = genbalist[j].GENBAMEI;
                    tmpbango = j;
                    tmpkyori = tmpkeido;
                  }
                }
              }
            }
            // ソートの対象外とするためCHECKに「１」を代入する。
            genbalist[tmpbango].CHECK = "1";
          }

          // 抽出した現場を現在の位置から近い順に並べた現場リスト(dispGenba)を表示する。
          $scope.negenbas = dispGenba;

          loadingModal.hide();
        }else{
          // 最寄の現場が1件も見つからなかった場合のワーニング表示。
          loadingModal.hide();
          ons.notification.alert({ title: "確認", message: "最寄の現場が見つかりません" });
        }
      })
      .catch(function(error) {
        // データベース処理にエラーが発生した場合のエラー表示。
        loadingModal.hide();
        ons.notification.alert({ title: "エラー", message: "データベース接続できません" });
      });

    }, function(result) {

      // 測位失敗時の処理（エラー表示）
      loadingModal.hide();
      onError(result);
    }, options);
  }



// *****************************************************************************
// 現場リストをクリックしたときの処理
// *****************************************************************************
  $scope.evItemSelect = function(index) {
    var selectItem = $scope.negenbas[index];
    document.SendData3.torokuno.value = selectItem.TOROKU;
  }


// *****************************************************************************
// 次へをクリックしたときの処理
// *****************************************************************************
  $scope.torokuInput = function(tmpStr) {
    var tmpStr2 = '';
    if (tmpStr == '1') {
      tmpStr2 = document.SendData3.torokuno.value;
    }else if (tmpStr == '2') {
      tmpStr2 = document.SendData4.torokuno.value;
    }

    if (isFinite(tmpStr2) == false) {
      ons.notification.alert({ title: "エラー", message: "登録番号は数字のみの入力となっています。"　});
      return false;
    }
    if (tmpStr2.length != 7) {
      ons.notification.alert({ title: "エラー", message: "登録番号は数字7ケタを入力願います。"});
      return false;
    }

    var obj = { torokuno: tmpStr2 };
    localStorage.setItem("disTOROKU", JSON.stringify(obj));
    if (tmpStr == '1') {
      app.navi.pushPage('disrepev.html', { animation : 'slide' } )
    }else if (tmpStr == '2') {
      app.navi.pushPage('disrepesc.html', { animation : 'slide' } )
    }
  }

}]);

