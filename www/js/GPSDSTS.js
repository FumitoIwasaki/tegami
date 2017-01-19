// This is a JavaScript file
// 呼び出してるメソッドに注意 https://ja.wikipedia.org/wiki/REST
angular.module("app")
.service("GPSDSTS", ["$http", "AppPotConfig", function($http, AppPotConfig) {

  var GPSDSTS = function() {};
    
  this.create = function() {
    return new GPSDSTS();
  };
  //自由SQL
  GPSDSTS.prototype.find = function(SQL) {
    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/query?query="+SQL)
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/query?query="+SQL)
   	.then(function(response) {
      console.log(response.data)
      throwErrorIfErrorStatus(response);
      var GPSDstss = [];
      angular.forEach(response.data.results.query, function(gpsdsts) {
        GPSDstss.push(angular.extend(new GPSDSTS(), gpsdsts));
      });
      return GPSDstss;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  GPSDSTS.prototype.select = function(SQL) {
   	return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/GPSDSTS?"+SQL)
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/GPSDSTS?"+SQL)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
      var GPSDstss = [];
      angular.forEach(response.data.results.GPSDSTS, function(gpsdsts) {
        GPSDstss.push(angular.extend(new GPSDSTS(), gpsdsts));
      });
      return GPSDstss;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  // INSERT
  GPSDSTS.prototype.save = function() {
    return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/GPSDSTS",[this])
//    return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/GPSDSTS",[this])
    .then(function(response) {
      throwErrorIfErrorStatus(response);
    });
  };

  // UPDATE
  GPSDSTS.prototype.update = function(key) {
    return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/GPSDSTS?"+key,[this])
//    return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/GPSDSTS?"+key,[this])
    .then(function(response) {
      throwErrorIfErrorStatus(response);
    });
  };
    
  // DELETE
  GPSDSTS.prototype.delete = function(key) {
    return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/GPSDSTS?"+key)
//    return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/GPSDSTS?"+key)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
    });
  };

}]);


app.service("INQUIRE", ["$http", "AppPotConfig", function($http, AppPotConfig) {

  var INQUIRE = function() {};
    
  this.create = function() {
    return new INQUIRE();
  };
  //自由SQL
  INQUIRE.prototype.find = function(SQL) {
    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/query?query="+SQL)
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/query?query="+SQL)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
      var INQuires = [];
      angular.forEach(response.data.results.query, function(inquire) {
        INQuires.push(angular.extend(new INQUIRE(), inquire));
      });
      return INQuires;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  INQUIRE.prototype.select = function(SQL) {
    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE?"+SQL)
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE?"+SQL)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
      var INQuires = [];
      angular.forEach(response.data.results.INQUIRE, function(inquire) {
        INQuires.push(angular.extend(new INQUIRE(), inquire));
      });
      return INQuires;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  // INSERT
  INQUIRE.prototype.save = function() {
    return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE",[this])
//    return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE",[this])
    .then(function(response) {
      throwErrorIfErrorStatus(response);
    });
  };

  // UPDATE
  INQUIRE.prototype.update = function(key) {
    return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE?"+key,[this])
//    return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE?"+key,[this])
    .then(function(response) {
      throwErrorIfErrorStatus(response);
    });
  };
    
  // DELETE
  INQUIRE.prototype.delete = function(key) {
    return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE?"+key)
//    return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE?"+key)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
    });
  };

}]);

///////////////////////////////////////////////////////
//fj01x
///////////////////////////////////////////////////////
app.service("FJ01sql", ["$http", "AppPotConfig", function($http, AppPotConfig) {
    
  //fj01xテスト  
    //--------------------------------------------------------------------------------------

    var FJ01sql = function() {};
    
    this.create = function() {
        return new FJ01sql();
    }
    /*
    SQLctrl.prototype.select = function(SQL) {
        return $http.get(AppPotConfig.apiUrl() + "/gateway/fj01x/JCCOMMS?COM_KEY=016")
        .then(function(response) {
            throwErrorIfErrorStatus(response);
            alert(JSON.stringify(response.data.results.JCCOMMS))
            return JCCOMMSs;
    	})
        .catch(function(error) {
            alert(error.message);
        });
	}
    */
    //SELECT
    FJ01sql.prototype.select = function(SQL) {        
        return $http.get(AppPotConfig.apiUrl() + "/gateway/fj01x/"+SQL)
		.then(function(response) {
			throwErrorIfErrorStatus(response);
			
			var JCCOMMSs = [];
			angular.forEach(response.data.results.JCCOMMS, function(jccomms) {
				JCCOMMSs.push(angular.extend(new FJ01sql(), jccomms));
			});
            //alert(JCCOMMSs[1].COM_KEY);
			return JCCOMMSs;
		});
	}    
    
    //自由SQL
    /*
    FJ01sql.prototype.find = function(SQL) {
        return $http.get(AppPotConfig.apiUrl() + "/gateway/fj01x/query?query="+SQL)
        .then(function(response) {
    		throwErrorIfErrorStatus(response);
			var FJ01FindData = [];
			angular.forEach(response.data.results.query, function(getemp) {
				FJ01FindData.push(angular.extend(new FJ01sql(), getemp));
			});
			return FJ01FindData;
        });
	}
    */
    
  //自由SQL
  FJ01sql.prototype.find = function(SQL) {
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/FJ01X_FISAPP1/query?query="+SQL)
    return $http.get(AppPotConfig.apiUrl() + "/gateway/FJ01X_JCAPP1/query?query="+SQL)
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/query?query="+SQL)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
      var FJ01FindData = [];
      angular.forEach(response.data.results.query, function(fj01sql) {
        FJ01FindData.push(angular.extend(new FJ01sql(), fj01sql));
      });
      return FJ01FindData;
    })
    .catch(function(error) {
      console.log(error);
    });
  }    
  
 

    
    
    //--------------------------------------------------------------------------------------


}]);
///////////////////////////////////////////////////////
//FJ01Xここまで
///////////////////////////////////////////////////////


app.service("INQUIRE2", ["$http", "AppPotConfig", function($http, AppPotConfig) {

  var INQUIRE2 = function() {};
    
  this.create = function() {
    return new INQUIRE2();
  };
  //自由SQL
  INQUIRE2.prototype.find = function(SQL) {
    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/query?query="+SQL)
//    return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/query?query="+SQL)
    .then(function(response) {
      throwErrorIfErrorStatus(response);
      var INQuire2s = [];
      angular.forEach(response.data.results.query, function(inquire2) {
        INQuire2s.push(angular.extend(new INQUIRE2(), inquire2));
      });
      return INQuire2s;
    })
    .catch(function(error) {
      console.log(error);
    });
  };

    INQUIRE2.prototype.select = function(SQL) {
      return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE2?"+SQL)
//      return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE2?"+SQL)
		.then(function(response) {
			throwErrorIfErrorStatus(response);
			var INQuire2s = [];
			angular.forEach(response.data.results.INQUIRE2, function(inquire2) {
				INQuire2s.push(angular.extend(new INQUIRE2(), inquire2));
			});
			return INQuire2s;
		})
        .catch(function(error) {
        	console.log(error);
        });
    };

    // INSERT
    INQUIRE2.prototype.save = function() {
        return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE2",[this])
//        return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE2",[this])
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };

    // UPDATE
    INQUIRE2.prototype.update = function(key) {
        return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE2?"+key,[this])
//        return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE2?"+key,[this])
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };
    
    // DELETE
    INQUIRE2.prototype.delete = function(key) {
        return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE2?"+key)
//        return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE2?"+key)
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };

}]);

app.service("PHONEINF", ["$http", "AppPotConfig", function($http, AppPotConfig) {

    var PHONEINF = function() {};
    
    this.create = function() {
        return new PHONEINF();
    };
    //自由SQL
    PHONEINF.prototype.find = function(SQL) {
        return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/query?query="+SQL)
//        return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/query?query="+SQL)
        .then(function(response) {
        	throwErrorIfErrorStatus(response);
			var PHONEinfs = [];
            angular.forEach(response.data.results.query, function(inquire) {
				PHONEinfs.push(angular.extend(new PHONEINF(), inquire));
			});
			return PHONEinfs;
        })
        .catch(function(error) {
        	console.log(error);
        });
	};

    PHONEINF.prototype.select = function(SQL) {
    	return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/PHONEINF?"+SQL)
//        return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/PHONEINF?"+SQL)
		.then(function(response) {
			throwErrorIfErrorStatus(response);
			var PHONEinfs = [];
			angular.forEach(response.data.results.PHONEINF, function(phoneinf) {
				PHONEinfs.push(angular.extend(new PHONEINF(), phoneinf));
			});
			return PHONEinfs;
		})
        .catch(function(error) {
        	console.log(error);
        });
    };

    // INSERT
    PHONEINF.prototype.save = function() {
        return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/PHONEINF",[this])
//        return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/PHONEINF",[this])
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };

    // UPDATE
    PHONEINF.prototype.update = function(key) {
        return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/PHONEINF?"+key,[this])
//        return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/PHONEINF?"+key,[this])
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };
    
    // DELETE
    PHONEINF.prototype.delete = function(key) {
        return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/PHONEINF?"+key)
//        return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/PHONEINF?"+key)
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };

}]);

app.service("INQUIRE1", ["$http", "AppPotConfig", function($http, AppPotConfig) {

    var INQUIRE1 = function() {};
    
    this.create = function() {
        return new INQUIRE1();
    };
    //自由SQL
    INQUIRE1.prototype.find = function(SQL) {
        return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/query?query="+SQL)
//        return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/query?query="+SQL)
        .then(function(response) {
            throwErrorIfErrorStatus(response);
			var INQuire1s = [];
            angular.forEach(response.data.results.query, function(inquire1) {
				INQuire1s.push(angular.extend(new INQUIRE1(), inquire1));
			});
			return INQuire1s;
        })
        .catch(function(error) {
        	console.log(error);
        });
	};

    INQUIRE1.prototype.select = function(SQL) {
    	return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE1?"+SQL)
//        return $http.get(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE1?"+SQL)
		.then(function(response) {
			throwErrorIfErrorStatus(response);
			var INQuire1s = [];
			angular.forEach(response.data.results.INQUIRE1, function(inquire1) {
				INQuire1s.push(angular.extend(new INQUIRE1(), inquire1));
			});
			return INQuire1s;
		})
        .catch(function(error) {
        	console.log(error);
        });
    };

    // INSERT
    INQUIRE1.prototype.save = function() {
        return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE1",[this])
//        return $http.post(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE1",[this])
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };

    // UPDATE
    INQUIRE1.prototype.update = function(key) {
        return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE1?"+key,[this])
//        return $http.put(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE1?"+key,[this])
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };
    
    // DELETE
    INQUIRE1.prototype.delete = function(key) {
        return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser/INQUIRE1?"+key)
//        return $http.delete(AppPotConfig.apiUrl() + "/gateway/jobkartedb_gpsuser_test/INQUIRE1?"+key)
        .then(function(response) {
            throwErrorIfErrorStatus(response);
        });
    };

}]);


//**************************************************************************************
//汎用的なサービスを定義
//**************************************************************************************
app.service("Myservice1", ["$q","$timeout","$http", "AppPotConfig","FJ01sql", function($q,$timeout,$http, AppPotConfig, FJ01sql) {
    
    var Myservice1 = function() {};
    
    this.create = function() {
        return new Myservice1();
    };    
    
    

    //------------------------------------------------------------
    //店所コードから店所名を取得する
    //------------------------------------------------------------
    Myservice1.prototype.tensyo_mei_get=function(value){
        var deferred=$q.defer();//promiseのためのdeferredオブジェクト
        
        deferred.notify('データ取得中');
        
        var SQL_fn="SELECT COM_VAL1 FROM JCCOMMS WHERE COM_TYPE='040' AND COM_KEY='"+value+"'";
        var SQL2 = encodeURIComponent(SQL_fn)
        
        var jccommsA = FJ01sql.create();//サービスを変数jccommsAに格納
        promise = jccommsA.find(SQL2);  //サービスのprototypeを変数promiseに格納
        
        //promiseの.thenメソッドとcatchメソッドを記載
        promise
        .then(function(jccommsA) {
            if (jccommsA.length > 0) {
              comA=jccommsA
              ccd=comA[0].COM_VAL1;              
              deferred.resolve(ccd);//処理成功通知
            }else{
              ccd=データ無し
              deferred.resolve(ccd);//処理成功通知
            }              
        })
        .catch(function(error) {
          deferred.reject(error);//エラー通知
        });    
        
        return deferred.promise;
    };
    
    
    
      /*
      SQL_fn="SELECT COM_VAL1 FROM JCCOMMS WHERE COM_TYPE='040' AND COM_KEY='32'";
      var SQL2 = encodeURIComponent(SQL_fn);
      var tensyoA = FJ01sql.create();
      promise = tensyoA.find(SQL2);
      promise.then(function(tensyoA) {
          if (tensyoA.length > 0) {
              comA=tensyoA
              ccd=comA[0].COM_VAL1;
              return tensyoA;
          }else{
              ccd=データ無し
              return tensyoA;
          }
      });
      */
      
      
}]);










