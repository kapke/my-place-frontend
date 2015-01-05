function clientsRepository (Repository, $q, EventListener, Client, productsRepository) {
	var parent = {};
	Repository.call(parent, Client);

	for(var prop in parent) {
		this[prop] = parent[prop];
	}
	this.getClients = getClients;

	function getClients () {
		return parent.getClients().then(function (clients) {
			clients.forEach(function (client) {
				client.products = client.products.map(function (product) {
					return productsRepository.createProduct({
						vendor: product.vendor
					  , name: product.name
					  , id: product.id
					});
				});
			});
			return clients;
		});
	}
}
clientsRepository.$inject = ['MyPlace.Crud.Repository', '$q', 'MyPlace.Utils.EventListener', 'ClientData.Client', 'ClientData.productsRepository'];

angular.module('ClientData')
.service('ClientData.clientsRepository', clientsRepository)
;