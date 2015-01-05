(function () {
'use strict';
function clientsCtrl ($scope, Controller, clientsRepository, productsRepository) {
	var parent = {};
	Controller.call(parent, $scope, clientsRepository);

	parent.loadClients();
	$scope.editing = false;
	$scope.details = false;
	$scope.products = [];
	
	$scope.editClient = editClient;
	$scope.approveChanges = approveChanges;
	$scope.cancelChanges = cancelChanges;
	$scope.showDetails = showDetails;

	productsRepository.getProducts().then(function (products) {
		$scope.products = products;
	});

	function editClient (client) {
		$scope.editing = {
			name: client.name
		  , surname: client.surname
		  , addedProduct: {}
		  , $target: client
		};
	}

	function approveChanges () {
		$scope.editing.$target.name = $scope.editing.name;
		$scope.editing.$target.surname = $scope.editing.surname;
		$scope.editing.$target.products.push($scope.editing.addedProduct);
		$scope.editing.$target.addedProduct = $scope.editing.addedProduct;
		clientsRepository.updateClient($scope.editing.$target);
		$scope.editing = false;
	}

	function cancelChanges () {
		$scope.editing = false;
	}

	function showDetails (client) {
		$scope.details = client;
	}
}
clientsCtrl.$inject = ['$scope', 'MyPlace.Crud.Controller', 'ClientData.clientsRepository', 'ClientData.productsRepository'];

angular.module('ClientData')
.controller('ClientData.clientsCtrl', clientsCtrl)
;
})();