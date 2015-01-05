'use strict';
function moduleList (moduleManager) {
	return {
		restrict: 'E',
		controller: function ($scope) {
			$scope.modules = [];
			$scope.activeModule = [];
			$scope.isModuleActive = function (moduleSlug) {
				return ($scope.activeModule.indexOf(moduleSlug) > -1);
			};

			moduleManager.addEventListener('moduleListChanged', function () {
				$scope.modules = moduleManager.getModules();
				var activeModule = moduleManager.getActiveModule();
				updateActives(activeModule?activeModule.slug:'');
			});
			moduleManager.addEventListener('activeModuleChanged', updateActives);

			function updateActives (activeModule) {
				var activeModules = [activeModule];
				(function appendActives (module) {
					if(module && module.parent) {
						activeModules.push(module.parent.slug);
						appendActives(module.parent);
					}
				})(moduleManager.getActiveModule());
				$scope.activeModule = activeModules;
			}
		},
		templateUrl: 'frontend/template/module/moduleList.tpl'
	};
}
moduleList.$inject = ['MyPlace.Module.moduleManager'];

function moduleListCtrl () {
}


angular.module('MyPlace.Module')
.controller('MyPlace.Module.moduleListCtrl', moduleListCtrl)
.directive('myPlaceModuleList', moduleList);