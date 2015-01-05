(function () {
'use strict';
function conversionFactory (api) {
	return api.getResource({
		type: api.BACKEND
	  , module: 'client_conversions'
	  , resource: 'conversions/:clientId/:productId'
	  , name: ['conversion', 'conversions']
	  , config: {
		    clientId: '@client.id'
		  , productId: '@product.id'
		}
	});
}

conversionFactory.$inject = ['MyPlace.apiService'];

angular.module('ClientConversions')
.factory('ClientConversions.Conversion', conversionFactory)
;
})();