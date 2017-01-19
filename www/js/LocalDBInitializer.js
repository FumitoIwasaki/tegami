angular.module("app")
.service("LocalDBInitializer", ["$http", "AppPotConfig", function($http, AppPotConfig) {
    this.createAppData = function(schemas) {
		return $http.post(AppPotConfig.apiUrl() + "/schemas", {
			appId: AppPotConfig.appId,
            appVersion: AppPotConfig.appVersion,
			isResetDatabase: false,
			companyId: AppPotConfig.companyId,
			tables: schemas
		})
		.then(function(response) {
			throwErrorIfErrorStatus(response);
		});
	};
}]);