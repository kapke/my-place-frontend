(function () {
	'use strict';
	function menuCtrl () {
	}

	menuCtrl.$inject = [];

	function menuDirective ($rootScope, $state, $timeout, Config, menuManager, templateUrl) {
		return {
			restrict: 'E',
			controller: function ($scope) {
				$scope.menu = {
					visible: false
				};
                $scope.view = $state.params.view;

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.view = $state.params.view;
                });
				menuManager.addEventListener('menuUpdated', function () {
					$timeout(function () {
						$scope.menu = menuManager.getActualMenu();
					}, 300);
				});
			},
			templateUrl: templateUrl('menu/menu')
		};
	}
	menuDirective.$inject = ['$rootScope', '$state', '$timeout', 'MyPlace.configService', 'MyPlace.Menu.menuManager', 'MyPlace.Utils.templateUrl'];

	function menuItemDirective ($state, templateUrl) {
		return {
			restrict: 'E',
			scope: {
				item: '=',
                module: '='
			},
			templateUrl: templateUrl('menu/menuItem'),
			link: function ($scope, element, attrs) {
				element.parent().on('click', function (e) {
                    $state.go('module', {
                        module: $scope.module,
                        view: $scope.item.view
                    });
				});
			}
		};
	}
	menuItemDirective.$inject = ['$state', 'MyPlace.Utils.templateUrl'];

	angular.module('MyPlace.Menu', [])
		.controller('MyPlace.Menu.menuCtrl', menuCtrl)
		.directive('mpMenu', menuDirective)
		.directive('mpMenuItem', menuItemDirective);
})();