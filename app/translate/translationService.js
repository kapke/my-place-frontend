(function () {
'use strict';
function translationServiceProvider () {
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
		return 'frontend/modules/'+module+'/resources/translations/'+language+'.json';
	}
}

angular.module('MyPlace.Translate')
.provider('MyPlace.Translate.translationService', translationServiceProvider)
;
})();