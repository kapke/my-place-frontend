(function () {
'use strict';
angular.module('MyPlace.Utils', [])
.factory('capitalizeFirst', function () {
	return function capitalizeFirst (str) {
		return str.slice(0, 1).toUpperCase()+str.substr(1);
	};
})
.factory('promisifyReturn',['$q', function ($q) {
	return function promisifyReturn (fn) {
		return function wrapper () {
			var deferred = $q.defer();
			deferred.resolve(fn.call(null, arguments));
			return deferred.promise;
		};
	};
}])
.factory('MyPlace.Utils.templateUrl', ['MyPlace.configService', function (config) {
	return function templateUrl (module, template) {
		return config.frontendPrefix+'/modules/'+module+'/template/'+template+'.tpl';
	};
}]);
})();