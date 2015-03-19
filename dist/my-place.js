(function () {
'use strict';
angular.module('MyPlace', ['ui.router', 'ngAnimate', 'ngMaterial', 'MyPlace.Config', 'MyPlace.Crud', 'MyPlace.Translate', 'MyPlace.Menu', 'MyPlace.Module']);

function mainCtrl ($scope, $timeout, menuManager) {
	$scope.menuVisible = false;
	$scope.menuHidden = true;
	menuManager.addEventListener('menuUpdated', function () {
		var menu = menuManager.getActualMenu();
		$scope.menuVisible = menu.visible;
		$scope.menuHidden = !menu.visible;
	});
}

mainCtrl.$inject = ['$scope', '$timeout', 'MyPlace.Menu.menuManager'];

angular.module('MyPlace')
.controller('MyPlace.mainCtrl', mainCtrl)
;
})();
(function () {
'use strict';
function apiService ($resource, Config) {
	var backendPrefix = Config.backendPrefix
	  , frontendPrefix = Config.frontendPrefix
	  , BACKEND = backendPrefix
	  , FRONTEND = frontendPrefix
	  , Module = $resource(backendPrefix+'modules')
	  , Menu = $resource(frontendPrefix+'modules/:module/resources/menu.json')
	  ;

	this.BACKEND = BACKEND;
	this.FRONTEND = FRONTEND;
	this.getResource = getResource;
	this.Module = Module;
	this.Menu = Menu;

	function getResource (config) {
		var outputResource
		  , prefix = config.type || BACKEND
		  , sufix = ''
		  , name = config.name
		  , fields = config.fields
		  , module = config.module || ''
		  , resource = config.resource || name[1]+'/:id'
		  , rConfig = config.config || {id: '@id'}
		  , actions = config.actions || {
		  		update: {method: 'PUT', params: {}}
		  	}
		  ;
		if(config.type == FRONTEND) {
			prefix += 'modules/'
		}
		outputResource = $resource(prefix+module+'/'+resource+sufix, rConfig, actions);
		outputResource.$fields = fields;
		outputResource.$name = name;
		return outputResource;
	}
}

apiService.$inject = ['$resource', 'MyPlace.configService'];

angular.module('MyPlace.Api', ['ngResource'])
.service('MyPlace.apiService', apiService)
;  
})();

(function () {
'use strict';
angular.module('MyPlace.Config', [])
.provider('MyPlace.configService', [function () {
    var that = this,
        waiting = [];
    
	this.backendPrefix = 'backend/web/app_dev.php/';
	this.frontendPrefix = 'frontend/';
    
    this.updateConfig = function (obj) {
        for (var name in obj) {
            this[name] = obj[name];
        }
    };
    
    this.waitForChanges = function () {
        var deferred = $.Deferred();
        waiting.push(deferred);
        return deferred.promise();
    }
    
    this.$get = function () {
        resolveWaiting();
        return that;
    };
    
    function resolveWaiting () {
        waiting.forEach(function (w) {
            w.resolve(that);
        });
    }
}])
;
})();

(function () {
'use strict';
function routingConfig ($stateProvider, Config) {
    Config.waitForChanges().then(function () {
        $stateProvider
            .state('module', {
                url: '/:module/:view',
                templateUrl: Config.frontendPrefix+'template/module/moduleView.tpl'
            });    
    });
}
routingConfig.$inject = ['$stateProvider', 'MyPlace.configServiceProvider'];
    
angular.module('MyPlace').config(routingConfig);
})();
(function () {
    function view (templateUrl) {
        return {
            restrict: 'E',
            templateUrl: templateUrl('view')
        };
    }
    view.$inject = ['MyPlace.Utils.templateUrl'];

    angular.module('MyPlace')
        .directive('mpView', view);
})();
angular.module('MyPlace.Translate', ['pascalprecht.translate', 'MyPlace.Config']);
(function () {
'use strict';
angular.module('MyPlace.Utils', [])
.factory('capitalizeFirst', function () {
	return function capitalizeFirst (str) {
		return str.slice(0, 1).toUpperCase()+str.substr(1);
	};
})
.factory('promisifyReturn',['$q', function ($q) {
	return function promisifyReturn (fn) {
		return function wrapper () {
			var deferred = $q.defer();
			deferred.resolve(fn.call(null, arguments));
			return deferred.promise;
		};
	};
}])
.factory('MyPlace.Utils.templateUrl', ['MyPlace.configService', function (config) {
	return function templateUrl (template, module) {
        var src = config.frontendPrefix;
        if(module) {
            src += 'modules/'+module +'/';
        }
        src += 'template/'+template+'.tpl';
		return src;
	};
}]);
})();
(function () {
'use strict';
function EventListener (promisedEvents) {
	var events = {};
	promisedEvents = (function (events) {
		var output = {};
		events.forEach(function (name) {
			output[name] = [];
		});
		return output;
	})(promisedEvents || []);

	this.removeEventListener = removeEventListener;
	this.addEventListener = addEventListener;
	this.launchEvent = launchEvent;

	function removeEventListener (name, listener) {
		var index = events[name].indexOf(listener);
		if(index > -1) {
			return events[name].splice(index, 1);
		} else {
			return null;
		}
	}
	function addEventListener (name, listener) {
		if(!events[name]) {
			events[name] = [];
		}
		var index = events[name].indexOf(listener);
		if(index == -1) {
			events[name].push(listener);
		}
		if(promisedEvents[name]) {
			promisedEvents[name].forEach(function (data) {
				listener.apply(data.that, data.params);
			});
		}
	}
	function launchEvent (name, params, that) {
		that = that || this;
		if(events[name]) {
			events[name].forEach(function (listener) {
				listener.apply(that, params);
			});	
		}
		if(promisedEvents[name]) {
			promisedEvents[name].push({params: params, that: that});
		}
	}
}

angular.module('MyPlace.Utils')
.factory('MyPlace.Utils.EventListener', function () {
	return EventListener;
});
})();
(function () {
'use strict';
function controllerFactory (capitalizeFirst) {
	function Controller ($scope, repository, listeners) {
		var name = repository.Entity.$name
		  , singularName = name[0]
		  , pluralName = name[1]
		  , capitalizedSingular = capitalizeFirst(singularName)
		  , capitalizedPlural = capitalizeFirst(pluralName)
		  , get = 'get'+capitalizedPlural
		  , newName = 'new'+capitalizedSingular
		  , add = 'add'+capitalizedSingular
		  , save = 'save'+capitalizedSingular
		  , create = 'create'+capitalizedSingular
		  , deleteName = 'delete'+capitalizedSingular
		  , deleteEvent = singularName+'Deleted'
		  , saveEvent = singularName+'Saved'
		  , getEmpty = 'getEmpty'+capitalizedSingular+'Data'
		  ;

		$scope[pluralName] = [];
		$scope[newName] = {};

		$scope[add] = addEntity;
		$scope[deleteName] = deleteEntity;

		
		if(listeners && typeof listeners[saveEvent] != 'undefined') {
			repository.addEventListener(saveEvent, listeners[saveEvent]);
		} else {
			repository.addEventListener(saveEvent, saveEventListener);
		}

		if(listeners && typeof listeners[deleteEvent] != 'undefined') {
			repository.addEventListener(deleteEvent, listeners[deleteEvent]);
		} else {
			repository.addEventListener(deleteEvent, deleteEventListener);
		}

		this['load'+capitalizedPlural] = loadEntities;
		this[add] = addEntity;
		this['emptyNew'+capitalizedSingular] = emptyNewEntity;
		this[deleteName] = deleteEntity;
		this.deleteEventListener = deleteEventListener;
		this.saveEventListener = saveEventListener;

		function loadEntities () {
			repository[get]().then(function (entities) {
				$scope[pluralName] = entities;
			});
		}

		function addEntity () {
			repository[save](repository[create]($scope[newName]));
		}

		function deleteEntity (entity) {
			repository[deleteName](entity);
		}

		function deleteEventListener (entity) {
			var index = $scope[pluralName].indexOf(entity);
			if(index >= 0) {
				$scope[pluralName].splice(index, 1);
			}
		}

		function emptyNewEntity () {
			$scope[newName] = repository[getEmpty]();
		}

		function saveEventListener (entity) {
			$scope[pluralName].push(entity);
			emptyNewEntity();
		}

	}
	return Controller;
}
controllerFactory.$inject = ['capitalizeFirst'];
angular.module('MyPlace.Crud', ['MyPlace.Utils'])
.factory('MyPlace.Crud.Controller', controllerFactory)
;
})();
(function () {
'use strict';
function repositoryFactory ($q, $http, EventListener, capitalizeFirst) {
	function Repository (Entity) {
		var parent = {}
		  , entityName = Entity.$name
		  , fields = Entity.$fields
		  ;
		EventListener.call(parent);

		var output = [
			['createEntity', 0, createEntity]
	 	  , ['saveEntity', 0, saveEntity]
	 	  , ['deleteEntity', 0, deleteEntity]
	 	  , ['updateEntity', 0, updateEntity]
	 	  , ['getEntity', 1, getEntities]
	 	  , ['getEmptyEntityData', 0, getEmptyEntityData]
		];
		for (var i=0, l=output.length; i<l; i++) {
			var def = output[i]
			  , funcName = def[0]
			  , eName = entityName[def[1]]
			  , func = def[2]
			  ;
			funcName = funcName.replace('Entity', capitalizeFirst(eName));
			funcName = funcName.replace('Entities', capitalizeFirst(eName));
			this[funcName] = func;
		}
		for (var prop in parent) {
			this[prop] = parent[prop];
		}

		this.Entity = Entity;

		function createEntity (data) {
			var entity = new Entity()
			  , emptyData = getEmptyEntityData()
			  ;
			for(var prop in emptyData) {
				if(data[prop]) {
					entity[prop] = data[prop];
				} else {
					entity[prop] = emptyData[prop];
				}
			}
			return entity;
		}

		function saveEntity (entity) {
			return entity.$save(function (data, getResponseHeaders) {
                if(data.id) {
                    entity.id = data.id;
                }
                parent.launchEvent(entityName[0]+'Saved', [entity]);
				//var location = getResponseHeaders().location;
				//$http.get(location).then(function (response) {
				//	for(var prop in response.data) {
				//		entity[prop] = response.data[prop]
				//	}
				//
				//});
			});
		}

		function deleteEntity (entity) {
			return entity.$delete(function () {
				parent.launchEvent(entityName[0]+'Deleted', [entity]);
			});
		}

		function updateEntity (entity) {
			return entity.$update(function () {
				parent.launchEvent(entityName[0]+'Updated', [entity]);
			});
		}

		function getEntities () {
			var deferred = $q.defer();
			Entity.query(function (entities) {
				deferred.resolve(entities);
			});
			return deferred.promise;
		}

		function getEmptyEntityData () {
			var output = {};

			for(var prop in fields) {
				output[prop] = getDefaultValue(fields[prop]);
				
			}

			return output;

			function getDefaultValue (field) {
				var value = null;
				
				if(typeof field.defaultValue != 'undefined') {
					value = field.defaultValue;
				} else if (field.type) {
					switch(field.type) {
						case String:
							value = '';
							break;
						case Number:
							value = 0;
							break;
						case Date:
							value = new Date();
							break;
					}	
				}

				return value;
			}
		}
	}
	return Repository;
}
repositoryFactory.$inject = ['$q', '$http', 'MyPlace.Utils.EventListener', 'capitalizeFirst'];
angular.module('MyPlace.Crud')
.factory('MyPlace.Crud.Repository', repositoryFactory)
;
})();
(function () {
'use strict';
function translationServiceConfig (config, translationServiceProvider) {
	translationServiceProvider.registerModule({name: 'MyPlace', slug: 'MyPlace'}, function (lang) {
		return config.frontendPrefix+'translations/'+lang+'.json';
	});
}
translationServiceConfig.$inject = ['MyPlace.configServiceProvider', 'MyPlace.Translate.translationServiceProvider'];

function translateConfig ($translateProvider) {
	$translateProvider.useLoader('MyPlace.Translate.translationLoader');
	$translateProvider.use('pl-PL');
	$translateProvider.preferredLanguage('pl-PL');
	$translateProvider.fallbackLanguage('en-GB');
}
translateConfig.$inject = ['$translateProvider'];

angular.module('MyPlace.Translate')
.config(translationServiceConfig)
.config(translateConfig)
;
})();
(function () {
'use strict';
function translationLoaderFactory ($q, $http, translationService) {
	return function translationLoader (options) {
		var deferred = $q.defer()
		  , lang = options.key
		  , modules = translationService.getModules()
		  , counter = 0
		  , translations = {}
		  ;
		modules.forEach(function (module) {
			var moduleDef = translationService.getModule(module.slug)
			  ;
			$http
				.get(moduleDef.resolver(lang, module.slug))
				.then(addTranslations(module.name))
				.finally(tryResolve)
				;

		});
		return deferred.promise;

		function addTranslations (module) {
			return function (receivedTranslations) {
				var newTranslations = receivedTranslations.data;
				for(var translationKey in newTranslations) {
					var targetKey = module;
					if(translationKey != module) {
						targetKey += '.'+translationKey;
					}
					translations[targetKey] = newTranslations[translationKey];
				}
			};
		}
		

		function tryResolve () {
			counter++;
			if(counter == modules.length) {
				deferred.resolve(translations);
			}
		}
	};
}
translationLoaderFactory.$inject = ['$q', '$http', 'MyPlace.Translate.translationService'];

angular.module('MyPlace.Translate')
.factory('MyPlace.Translate.translationLoader', translationLoaderFactory)
;
})();
(function () {
'use strict';
function translationServiceProvider (Config) {
	var moduleMap = {}
	  , actualModule = ''
	  , registeredModules = []
	  ;

	this.registerModule = registerModule;

	this.$get = function ($injector, moduleManager) {
		moduleManager.addEventListener('moduleAdded', function (module) {
			moduleRegister(module);
			module.children.forEach(function (submodule) {
				moduleRegister(submodule);
			});
		});

		return {
			registerModule: moduleRegister
		  , getModules: getModules
		  , getModule: getModule
		}

		function moduleRegister (module, resolvingFunction) {
			var $translate = $injector.get('$translate');
			registerModule(module, resolvingFunction);
			$translate.refresh();
		}
	}
	this.$get.$inject = ['$injector', 'MyPlace.Module.moduleManager'];

	function registerModule (module, resolvingFunction) {
		moduleMap[module.slug] = {
			resolver: resolvingFunction || standardNameResolver,
			moduleData: module
		};
		registeredModules.push(module);
	}

	function getModules () {
		return registeredModules;
	}

	function getModule (moduleName) {
		return moduleMap[moduleName];
	}

	function standardNameResolver (language, module) {
		return Config.frontendPrefix+'modules/'+module+'/resources/translations/'+language+'.json';
	}
}
    
    translationServiceProvider.$inject = ['MyPlace.configServiceProvider'];

angular.module('MyPlace.Translate')
.provider('MyPlace.Translate.translationService', translationServiceProvider)
;
})();
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
(function () {
'use strict';
function moduleList (Config, moduleManager) {
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
		templateUrl: Config.frontendPrefix+'template/module/moduleList.tpl'
	};
}
moduleList.$inject = ['MyPlace.configService', 'MyPlace.Module.moduleManager'];

function moduleListCtrl () {
}


angular.module('MyPlace.Module')
.controller('MyPlace.Module.moduleListCtrl', moduleListCtrl)
.directive('mpModuleList', moduleList);
})();
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
//# sourceMappingURL=my-place.js.map