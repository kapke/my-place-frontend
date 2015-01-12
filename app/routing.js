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