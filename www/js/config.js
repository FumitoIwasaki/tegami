// This is a JavaScript file
//  appIdとappVersionとappKeyをアプリごとに変更
//20161209 SJM_Mobileではつながらないのでテスト的にgpslocationsearchを利用
angular.module("app")
.value( "AppPotConfig", {
    url: "https://mobileapi.fujitec.co.jp/apppot-dev",
    appId: "SJM_Mobile",
    appVersion: "1.0.0",
    appKey: "7287b9ea46ef40d084b7711518717086",
    companyId: 1,
    deviceUDID: "FJT_Training-Fixed-DeviceID",
	apiUrl: function() {
		return this.url + "/api/" + this.companyId + "/" + this.appId + "/" + this.appVersion;
	}
});

/*
//動くやつ
angular.module("app")
.value( "AppPotConfig", {
    url: "https://mobileapi.fujitec.co.jp/apppot",
    appId: "gpslocationsearch",
    appVersion: "1.0.0",
    appKey: "608151779e1b4a5bbffe8a803b5e598a",
    companyId: 1,
    deviceUDID: "FJT_Training-Fixed-DeviceID",
    apiUrl: function() {
		return this.url + "/api/" + this.companyId + "/" + this.appId + "/" + this.appVersion;
	}
});



*/





/*//ホントのsjmはこっち
angular.module("app")
.value( "AppPotConfig", {
    url: "https://mobileapi.fujitec.co.jp/apppot",
    appId: "SJM_Mobile",
    appVersion: "1.0.0",
    appKey: "aab85c15547e4303a3b94376c90095b7",
    companyId: 1,
    deviceUDID: "FJT_Training-Fixed-DeviceID",
    apiUrl: function() {
		return this.url + "/api/" + this.companyId + "/" + this.appId + "/" + this.appVersion;
	}
});
*/



//ほんとに使用する外部AppPotサーバ
// とりあえずデフォルトは、本番環境
//app.value( "AppPotConfig_", {
//  url: "http://10.250.1.59:8080/apppot",
//  appId: "gpslocationsearch",
//  appVersion: "1.0.0",
//  appKey: "608151779e1b4a5bbffe8a803b5e598a",
//  companyId: 1,
//  deviceUDID: "FJT_Training-Fixed-DeviceID",
//  apiUrl: function() {
//    return this.url + "/api/" + this.companyId + "/" + this.appId + "/" + this.appVersion;
//  }
//});

//古い内部AppPotサーバAppPotConfig_にアンダーバーついてる
//app.value( "AppPotConfig", {
  //url: "http://10.250.4.18:8080/apppot",
//  url: "http://mobileapi.fujitec.co.jp:8080/apppot",
//  appId: "picture_upload",
//  appVersion: "1.0.0",
//  appKey: "077ef7b4427e42b1972e701b31c42a0e",
//  companyId: 1,
//  deviceUDID: "FJT_Training-Fixed-DeviceID",
//  apiUrl: function() {
//    return this.url + "/api/" + this.companyId + "/" + this.appId + "/" + this.appVersion;
//  }
//});
//ほんとに使用する外部AppPotサーバ
//app.value( "AppPotConfig_", {
//  url: "http://10.250.1.59:8080/apppot",
//  appId: "picture_upload",
//  appVersion: "1.0.0",
//  appKey: "077ef7b4427e42b1972e701b31c42a0e",
//  companyId: 1,
//  deviceUDID: "FJT_Training-Fixed-DeviceID",
//  apiUrl: function() {
//    return this.url + "/api/" + this.companyId + "/" + this.appId + "/" + this.appVersion;
//  }
//});
