(function () {
'use strict';
function mainCtrl ($scope, clientsRepository, Conversion) {
	$scope.clients = [];
	$scope.conversions = [];
	$scope.actualClient = false;
	$scope.actualProduct = false;
	$scope.newConversion = {
		note: ''
	};

	$scope.selectClient = selectClient;
	$scope.selectProduct = selectProduct;
	$scope.addConversion = addConversion;

	loadClients();

	function selectClient (client) {
		$scope.actualClient = client;
		$scope.actualProduct = false;
		$scope.conversions = [];
	}

	function selectProduct (product) {
		$scope.actualProduct = product;
		$scope.conversions = [];
		loadConversions();
	}

	function loadClients () {
		clientsRepository.getClients().then(function (clients) {
			$scope.clients = clients;
		});
	}

	function loadConversions () {
		$scope.conversions = Conversion.query({clientId: $scope.actualClient.id, productId: $scope.actualProduct.id});
	}

	function addConversion () {
		var conversion = new Conversion();
		conversion.client = $scope.actualClient;
		conversion.product = $scope.actualProduct;
		conversion.note = $scope.newConversion.note;
		conversion.$save(function () {
			loadConversions();
			emptyNewConversion();
		});
	}

	function emptyNewConversion () {
		$scope.newConversion = {
			note: ''
		};
	}
}

mainCtrl.$inject = ['$scope', 'ClientData.clientsRepository', 'ClientConversions.Conversion'];

angular.module('ClientConversions')
.controller('ClientConversions.mainCtrl', mainCtrl)
;
})();