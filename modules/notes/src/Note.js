(function () {
'use strict';
function noteFactory (api) {
	return api.getResource({
		type: api.BACKEND
	  , module: 'notes'
	  , name: ['note', 'notes']
	  , fields: {
			title: {type: String}
	  	  , content: {defaultValue: ''}
	  	}
	});
}
noteFactory.$inject = ['MyPlace.apiService'];

angular.module('Notes')
.factory('Notes.Note', noteFactory)
;
})();