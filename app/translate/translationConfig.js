(function () {
'use strict';
function translationServiceConfig (config, translationServiceProvider) {
	translationServiceProvider.registerModule({name: 'MyPlace', slug: 'MyPlace'}, function (lang) {
		return config.frontendPrefix+'/translations/'+lang+'.json';
	});
}
translationServiceConfig.$inject = ['MyPlace.configService', 'MyPlace.Translate.translationServiceProvider'];

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