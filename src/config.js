(function () {
'use strict';
angular.module('MyPlace.Config', [])
.provider('MyPlace.configService', [function () {
    var that = this,
        waiting = [];
    
	this.backendPrefix = 'backend/web/app_dev.php/';
	this.frontendPrefix = 'frontend/';
    
    this.updateConfig = function (obj) {
        for (var name in obj) {
            this[name] = obj[name];
        }
    };
    
    this.waitForChanges = function () {
        var deferred = $.Deferred();
        waiting.push(deferred);
        return deferred.promise();
    }
    
    this.$get = function () {
        resolveWaiting();
        return that;
    };
    
    function resolveWaiting () {
        waiting.forEach(function (w) {
            w.resolve(that);
        });
    }
}])
;
})();
