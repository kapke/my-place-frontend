(function () {
'use strict';
function clientFactory (api) {
	return api.getResource({
		type: api.BACKEND
	  , module: 'client_data'
	  , name: ['client', 'clients']
	  , fields: {
	  		name: {type: String}
	  	  , surname: {type: String}
	  	}
	});
}
clientFactory.$inject = ['MyPlace.apiService'];

angular.module('ClientData')
.factory('ClientData.Client', clientFactory)
;
})();
