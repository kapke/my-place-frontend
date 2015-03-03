(function () {
'use strict';
function menuCtrl () {
}

menuCtrl.$inject = [];

function menuDirective (Config, menuManager) {
	return {
		restrict: 'E',
		controller: function ($scope) {
			$scope.menu = {
				visible: false
			};
			menuManager.addEventListener('menuUpdated', function () {
				$scope.menu = menuManager.getActualMenu();
			});
		},
		templateUrl: Config.frontendPrefix+'template/menu/menu.tpl'
	};
}

menuDirective.$inject = ['MyPlace.configService', 'MyPlace.Menu.menuManager'];

angular.module('MyPlace.Menu', [])
.controller('MyPlace.Menu.menuCtrl', menuCtrl)
.directive('myPlaceMenu', menuDirective)
;
})();