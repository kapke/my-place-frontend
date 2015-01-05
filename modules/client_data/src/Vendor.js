function vendorFactory (api) {
	return api.getResource({
		type: api.BACKEND
	  , module: 'client_data'
	  , name: ['vendor', 'vendors']
	  , fields: {
	  		name: {type: String}
	  	}
	});
}
vendorFactory.$inject = ['MyPlace.apiService'];

angular.module('ClientData')
.factory('ClientData.Vendor', vendorFactory)
;