(function () {
'use strict';
function moduleWidget ($state, api) {
	return {
		restrict: 'E',
		templateUrl: api.FRONTEND+'template/module/moduleWidget.tpl',
		scope: {
			module: '='
		},
		link: function ($scope, element) {
            element.parent().on('click', function (e) {
                $state.go('module', {
                    module: $scope.module.slug,
                    view: ''
                });
            });
			$scope.innerText = $scope.module.name;
			$scope.widgetTemplateSrc = api.FRONTEND+'modules/'+$scope.module.slug+'/template/moduleWidget.tpl';
			$scope.$on('MyPlace.Module.changeWidgetText', function (event, newText) {
				$scope.innerText = newText;
			});
		}
	}
}
moduleWidget.$inject = ['$state', 'MyPlace.apiService'];

angular.module('MyPlace.Module')
	.directive('mpModuleWidget', moduleWidget);
})();