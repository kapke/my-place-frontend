(function () {
'use strict';
function routingConfig ($stateProvider, Config, templateUrl) {
    Config.waitForChanges().then(function () {
        $stateProvider
            .state('module', {
                url: '/:module/:view',
                templateUrl: templateUrl.templateUrl('module/moduleView')
            });    
    });
}
routingConfig.$inject = ['$stateProvider', 'MyPlace.configServiceProvider', 'MyPlace.Utils.templateUrlProvider'];
    
angular.module('MyPlace').config(routingConfig);
})();