(function () {
'use strict';
function moduleManagerProvider () {
	var moduleOrder = {},
		orderList = [];

	this.addModuleOrder = addModuleOrder;
	this.$get = function ($state, api, EventListener) {
		return new ModuleManager($state, api, EventListener);
	};
	this.$get.$inject = ['$state', 'MyPlace.apiService', 'MyPlace.Utils.EventListener'];

	function addModuleOrder (order) {
		var inversedOrder = {},
			prioritiesList = [];
		for(var name in order) {
			moduleOrder[name] = order[name];
		}
		for(var name in moduleOrder) {
			var priority = moduleOrder[name];
			if(!inversedOrder[priority]) {
				inversedOrder[priority] = [];
				prioritiesList.push(priority);
			}
			inversedOrder[priority].push(name);
		}
		prioritiesList.sort(function (a, b) {
			if(a == '*') {
				return 1;
			} else if(b == '*') {
				return -1;
			} else {
				return a-b;
			}
		});
		prioritiesList.forEach(function (priority) {
			inversedOrder[priority].forEach(function (name) {
				orderList.push(name);
			});
		});
	}

	function reOrderModules (modules) {
		modules.sort(function (left, right) {
			var leftIndex = -1,
				rightIndex = -1;
			for(var i=0; i<orderList.length; i++) {
				var name = orderList[i];
				if(leftIndex == -1 && name == left.slug) {
					leftIndex = i;
					continue;
				}
				if(rightIndex == -1 && name == right.slug) {
					rightIndex = i;
					continue;
				}
			}
			return leftIndex - rightIndex;
		});
	}

	function ModuleManager ($state, api, EventListener) {
		EventListener.call(this, ['moduleAdded', 'moduleListChanged']);

		(function () {
			api.Module.query(function (modules) {
				modules.forEach(function (module) {
					registerModule(module);
				});
                if($state.params.module) {
                    setActiveModuleAndView($state.params.module, $state.params.view);
                }
			});
		})();
		var that = this,
			modules = [],
			modulesBySlug = {},
			activeModule = null,
			activeView = 'main';

		this.registerModule = registerModule;
		this.getModules = getModules;
		this.setActiveModuleAndView = setActiveModuleAndView;
		this.setActiveModule = setActiveModule;
		this.setActiveView = setActiveView;
		this.getActiveModule = getActiveModule;
		this.getModuleFamily = getModuleFamily;

		function getModules () {
			return modules;
		}

		function registerModule (module) {
			modules.push(module);
			modulesBySlug[module.slug] = module;
			module.children.forEach(function (submodule) {
				submodule.parent = module;
				modulesBySlug[submodule.slug] = submodule;
			});
			reOrderModules(modules);
			that.launchEvent('moduleListChanged');
			that.launchEvent('moduleAdded', [module]);
		}

		function setActiveModuleAndView (module, view) {
			setActiveModule(module);
			setActiveView(view);
			that.launchEvent('activeModuleAndViewChanged', [activeModule, activeView]);
		}

		function setActiveModule (moduleSlug) {
			if(activeModule != moduleSlug) {
				activeModule = moduleSlug;
				that.launchEvent('activeModuleChanged', [activeModule]);	
			}
		}

		function getActiveModule () {
			return modulesBySlug[activeModule];
		}

		function setActiveView (view) {
			view = view || 'main';
			if(activeView != view) {
				activeView = view;
				that.launchEvent('activeViewChanged', [activeView])	
			}
		}

		function getActiveView () {
			return activeView;
		}

		function getModuleFamily (module) {
			function getRoot (module) {
				if(module && module.parent) {
					return getRoot(module.parent);
				} else {
					return module;
				}
			}

			function getDescendants (module) {
				var output = [];
				if(module) {
					output.push(module);
					if(module.children) {
						module.children.forEach(function (module) {
							output = output.concat(getDescendants(module));
						});
					}
				}
				return output;
			}

			return getDescendants(getRoot(module));
		}
	}
}


angular.module('MyPlace.Module')
	.provider('MyPlace.Module.moduleManager', moduleManagerProvider);
})();