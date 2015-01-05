'use strict';
angular.module('MyPlace')
.service('MyPlace.configService', [function () {
	this.backendPrefix = 'backend/web/app_dev.php/';
	this.frontendPrefix = 'frontend/';
}])
;