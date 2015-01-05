(function () {
'use strict';
function productsRepository ($q, EventListener, Product, Vendor, Repository) {
	var parent = {};
	Repository.call(parent, Product);

	for(var prop in parent) {
		this[prop] = parent[prop];
	}
	this.getProducts = getProducts;
	this.createProduct = createProduct;
	
	function createProduct (data) {
		var product = parent.createProduct(data);
		product.fixId();
		product.fullName = product.getFullName();
		return product;
	} 

	function getProducts (grouped) {
		return parent.getProducts().then(function (products) {
			products.forEach(function (product) {
				product.fixId();
				product.fullName = product.getFullName();
			});
			if(!!grouped) {
	  			var output = {};
	  			products.map(function (product) {
					if (product.vendor) {
						if (!output[product.vendor.name]) {
							output[product.vendor.name] = [];
						}
						output[product.vendor.name].push(product);
					}
				});
				return output;
			} else {
				return products;
			}
		});
	}
}
productsRepository.$inject = ['$q', 'MyPlace.Utils.EventListener', 'ClientData.Product', 'ClientData.Vendor', 'MyPlace.Crud.Repository'];

angular.module('ClientData')
.service('ClientData.productsRepository', productsRepository)
;
})();