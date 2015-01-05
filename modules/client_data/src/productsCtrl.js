function productsCtrl ($scope, productsRepository, Controller, vendorsRepository) {
	var parent = {};
	Controller.call(parent, $scope, productsRepository, {'productSaved': productSavedHandler});
	Controller.call(parent, $scope, vendorsRepository);
	$scope.products = {};

	parent.loadVendors();
	loadProducts();

	function loadProducts () {
		productsRepository.getProducts(true)
			.then(function (products) {
				$scope.products = products;
			});
	}

	function productSavedHandler (product) {
		if(!$scope.products[product.vendor.name]) {
			$scope.products[product.vendor.name] = [product]
		} else {
			$scope.products[product.vendor.name].push(product);
		}
		parent.emptyNewProduct();
	}
}
productsCtrl.$inject = ['$scope', 'ClientData.productsRepository', 'MyPlace.Crud.Controller', 'ClientData.vendorsRepository'];

angular.module('ClientData')
.controller('ClientData.productsCtrl', productsCtrl)
;
