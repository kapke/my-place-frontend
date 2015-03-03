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