(function () {
'use strict';
angular.module('MyPlace.Config', [])
.provider('MyPlace.configService', [function () {
    var that = this;
    
	this.backendPrefix = 'backend/web/app_dev.php/';
	this.frontendPrefix = 'frontend/';
    
    this.$get = function () {
        return that;
    };
}])
;
})();
