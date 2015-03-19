(function () {
'use strict';
function moduleWidget ($state, templateUrl, moduleManager) {
	return {
		restrict: 'E',
		templateUrl: templateUrl('module/moduleWidget'),
		scope: {
			module: '='
		},
		link: function ($scope, element) {
            element.parent().on('click', function (e) {
            	e.preventDefault();
            	var activeModule = moduleManager.getActiveModule();
            	if(!activeModule || activeModule.slug != $scope.module.slug) {
            		$state.go('module', {
	                    module: $scope.module.slug,
	                    view: 'main'
	                });
            	}
            });
			$scope.innerText = $scope.module.name;
			$scope.widgetTemplateSrc = templateUrl('moduleWidget', $scope.module.slug);
			$scope.$on('MyPlace.Module.changeWidgetText', function (event, newText) {
				$scope.innerText = newText;
			});
		}
	}
}
moduleWidget.$inject = ['$state', 'MyPlace.Utils.templateUrl', 'MyPlace.Module.moduleManager'];

angular.module('MyPlace.Module')
	.directive('mpModuleWidget', moduleWidget);
})();