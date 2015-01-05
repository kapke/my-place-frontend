'use strict';
function moduleCtrl ($scope, $rootScope, $state, $resource, Config, moduleManager) {
	var activeModule = ''
	  , activeView = ''
	  ;
	  
	$scope.actualTemplate = '';
	$rootScope.$on('$stateChangeSuccess', function () {
		moduleManager.setActiveModuleAndView($state.params.module, $state.params.view);
	});
	moduleManager.addEventListener('activeModuleAndViewChanged', function (module, view) {
		activeModule = module;
		activeView = view;
		setActualTemplate();
	});

	function setActualTemplate () {
		$scope.actualTemplate = 'frontend/modules/'+activeModule+'/template/'+activeView+'.tpl';
	}
}

moduleCtrl.$inject = ['$scope', '$rootScope', '$state', '$resource', 'MyPlace.configService', 'MyPlace.Module.moduleManager'];

angular.module('MyPlace.Module', ['MyPlace.Utils', 'MyPlace.Api'])
.controller('MyPlace.Module.moduleCtrl', moduleCtrl)
;