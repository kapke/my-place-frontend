(function () {
'use strict';
function eventFactory (api) {
	return api.getResource({
		type: api.BACKEND
	  , module: 'meetspace'
	  , name: ['event', 'events']
	});
}
eventFactory.$inject = ['MyPlace.apiService'];

angular.module('Meetspace')
.factory('Meetspace.Event', eventFactory)
;
})();