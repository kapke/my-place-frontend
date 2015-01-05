'use strict';
angular.module('MyPlace')
.config(function ($stateProvider) {
	$stateProvider
	.state('module', {
		  url: '/:module/:view'
		, templateUrl: 'frontend/template/module/moduleView.tpl'
	})
	;
})
;