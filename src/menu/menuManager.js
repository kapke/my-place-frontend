(function () {
	'use strict';
	function menuManager ($timeout, EventListener, api, moduleManager) {
		EventListener.call(this);

	    var that = this,
	        actualMenu = {},
	        actualModule = null,
	        actualModuleFamily = [];
		  
		this.getActualMenu = getActualMenu;

		moduleManager.addEventListener('moduleListChanged', function () {
			deferUpdate();
		});
		moduleManager.addEventListener('activeModuleChanged', function () {
			deferUpdate();
		});

		function getActualMenu () {
			return actualMenu;
		}

		function updateMenu () {
			if(actualModule) {
				if(actualModule.parent) {
					actualModule = actualModule.parent;
				}
				actualMenu = api.Menu.get({module: actualModule.slug}, function () {
					calculateVisibility(actualMenu);
					that.launchEvent('menuUpdated');
				});
				calculateVisibility(actualMenu);
				that.launchEvent('menuUpdated');
				(function (module) {
					actualMenu.$promise.then(function (actualMenu) {
						actualMenu.module = module.slug;
						module.children.forEach(function (submodule) {
							if(!actualMenu.extensions) {
								actualMenu.extensions = [];
							}
							var submenu = api.Menu.get({module: submodule.slug}, function (submenu) {
								submenu.module = submodule.slug;	
							});
							actualMenu.extensions.push(submenu);
							calculateVisibility(actualMenu);
							that.launchEvent('menuUpdated');
						});
					});
				})(actualModule);
			}
		}

		function calculateVisibility (menu) {
			var visible = false,
			    itemsCount = 0;

			if(menu.items) {
				itemsCount = menu.items.length;
				visible = (itemsCount>0);
				if(!visible && menu.extensions) {
					menu.extensions.forEach(function (extension) {
						itemsCount += extension.items.length;
					});
					visible = (itemsCount>0);
				}
			} 
			menu.visible = visible;
		}

		function deferUpdate () {
			if(deferUpdate.promise) {
				$timeout.cancel(deferUpdate.promise);
			}
			deferUpdate.promise = $timeout(function () {
				actualModule = moduleManager.getActiveModule();
				if(actualModule) {
					var isModuleInFamily = (actualModuleFamily.indexOf(actualModule.slug) > -1);
					if(!isModuleInFamily) {
						actualModuleFamily = moduleManager.getModuleFamily(actualModule).map(function (module) {
							return module.slug;
						});
						updateMenu();		
					}
				}
			}, 200);
		}
	}
	menuManager.$inject = ['$timeout', 'MyPlace.Utils.EventListener', 'MyPlace.apiService', 'MyPlace.Module.moduleManager'];

	angular.module('MyPlace.Menu')
		.service('MyPlace.Menu.menuManager', menuManager);
})();