(function () {
'use strict';
function moduleCtrl ($scope, $rootScope, $state, $timeout, moduleManager, templateUrl) {
	var shownFirst = false,
        activeModule = '',
	    activeView = '';
	  
	$scope.actualTemplate = '';
	$rootScope.$on('$stateChangeSuccess', function () {
		moduleManager.setActiveModuleAndView($state.params.module, $state.params.view);
	});
	moduleManager.addEventListener('activeModuleAndViewChanged', function (module, view) {
        if(!shownFirst) {
            shownFirst = true;
            $scope.$emit('MyPlace.Module.initiated');
        }
		activeModule = module;
		activeView = view;
		setActualTemplate();
	});
    moduleManager.setActiveModuleAndView($state.params.module, $state.params.view);

	function setActualTemplate () {
		$scope.actualTemplate = templateUrl(activeView, activeModule);
	}
}

moduleCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'MyPlace.Module.moduleManager', 'MyPlace.Utils.templateUrl'];

angular.module('MyPlace.Module', ['MyPlace.Utils', 'MyPlace.Api'])
    .controller('MyPlace.Module.moduleCtrl', moduleCtrl);
})();