(function () {
'use strict';
function moduleWidget (api) {
	return {
		restrict: 'E',
		templateUrl: api.FRONTEND+'template/module/moduleWidget.tpl',
		scope: {
			module: '='
		},
		link: function ($scope) {
			$scope.innerText = $scope.module.name;
			$scope.widgetTemplateSrc = api.FRONTEND+'modules/'+$scope.module.slug+'/template/moduleWidget.tpl';
			$scope.$on('MyPlace.Module.changeWidgetText', function (event, newText) {
				$scope.innerText = newText;
			});
		}
	}
}
moduleWidget.$inject = ['MyPlace.apiService'];

angular.module('MyPlace.Module')
	.directive('mpModuleWidget', moduleWidget);
})();