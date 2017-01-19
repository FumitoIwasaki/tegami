// This is a JavaScript file

app.service('SettingsService', function($q, $http) {

  this.sharedScopes = {};

  this.setSharedScope = function(key, value) {
    this.sharedScopes[key] = value;
  };

  this.getSharedScope = function(key) {
    return this.sharedScopes[key];
  };


});
    
    
    
 
    
   