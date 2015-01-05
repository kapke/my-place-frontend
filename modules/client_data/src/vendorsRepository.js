(function () {
'use strict';
function vendorsRepository (Repository, Vendor) {
	Repository.call(this, Vendor);
}
vendorsRepository.$inject = ['MyPlace.Crud.Repository', 'ClientData.Vendor'];

angular.module('ClientData')
.service('ClientData.vendorsRepository', vendorsRepository)
;
})();