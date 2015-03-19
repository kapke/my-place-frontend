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