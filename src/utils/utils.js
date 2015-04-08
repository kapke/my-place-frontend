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
                    deferred.resolve(fn.apply(null, arguments));
                    return deferred.promise;
                };
            };
        }])
        .factory('defer', ['$timeout', function ($timeout) {
            var defers = {};
            return function defer (func, time) {
                time = time || 250;
                return function () {
                    if(defers[func]) {
                        $timeout.cancel(defers[func]);
                    }
                    defers[func] = $timeout(func, time);
                };
            };
        }])
        .provider('MyPlace.Utils.templateUrl', ['MyPlace.configServiceProvider', function (config) {
            function templateUrl (template, module) {
                var src = '';
                if(module) {
                    src += config.frontendPrefix+'modules/'+module +'/';
                } else {
                    src += config.myPlaceLocation();
                }
                src += 'template/'+template+'.tpl';
                return src;
            }

            this.$get = function () {
                return templateUrl;
            };

            this.templateUrl = templateUrl;
        }])
        .factory('range', function () {
           return function (startStop, stop, step) {
               var start = stop ? startStop : 0,
                   output = [];
               stop = stop ? stop : startStop;
               step = (step?step:1)*(start <= stop ? 1 : -1);

               for(var i=0; stop-i*step >= start*step; i++) {
                   output.push(start + i*step);
               }

               return output;
           }
        });
})();