function productFactory (api) {
	var Product = api.getResource({
		type: api.BACKEND
	  , module: 'client_data'
	  , name: ['product', 'products']
	  , fields: {
	  		name: {type: String}
	  	  , vendor: {type: String}
	  	  , id: {type: Number}
	  	}
	});
	Product.prototype.fixId = function () {
		if(this.id === 0) {
			this.id = undefined;
		}
	}
	Product.prototype.getFullName = function () {
		var vendorName = '';
		if(this.vendor) {
			vendorName = this.vendor.name;
		}
		return vendorName+' '+this.name;
	};

	return Product;
}
productFactory.$inject = ['MyPlace.apiService'];

angular.module('ClientData')
.factory('ClientData.Product', productFactory)
;