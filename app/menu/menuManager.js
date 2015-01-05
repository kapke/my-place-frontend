function menuManager (EventListener, api, moduleManager) {
	EventListener.call(this);

	var that = this
	  , actualMenu = {}
	  , actualModule = null
	  , actualModuleFamily = []
	  , downloadTries = 0
	  , downloadInterval = 100;
	  ;

	this.getActualMenu = getActualMenu;

	moduleManager.addEventListener('moduleListChanged', tryUpdate);
	moduleManager.addEventListener('activeModuleChanged', tryUpdate);

	function getActualMenu () {
		return actualMenu;
	}

	function tryUpdate () {
		actualModule = moduleManager.getActiveModule();
		if(actualModule) {
			var isModuleinFamily = (actualModuleFamily.indexOf(actualModule.slug) > -1);
			if(!isModuleinFamily) {
				actualModuleFamily = moduleManager.getModuleFamily(actualModule).map(function (module) {
					return module.slug;
				});
				updateMenu();		
			}
			
		}
	}

	function updateMenu () {
		if(downloadTries > 5) {
			if(downloadInterval > 10000) {
				return;
			}
			downloadInterval *= 5;
			downloadTries = 0;
		}
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
			downloadInterval = 100;
			downloadTries = 0;
		} else {
			// actualModule = moduleManager.getActiveModule();
			// downloadTries += 1;
			actualMenu = {};
			// setTimeout(updateMenu, downloadInterval);
		}
	}

	function calculateVisibility (menu) {
		var visible = false
		  , itemsCount = 0
		  ;

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
}

menuManager.$inject = ['MyPlace.Utils.EventListener', 'MyPlace.apiService', 'MyPlace.Module.moduleManager'];

angular.module('MyPlace.Menu')
.service('MyPlace.Menu.menuManager', menuManager)
;