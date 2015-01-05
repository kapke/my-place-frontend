(function () {
'use strict';
function notesRepository (Repository, Note) {
	Repository.call(this, Note);
}

notesRepository.$inject = ['MyPlace.Crud.Repository', 'Notes.Note'];

angular.module('Notes')
.service('Notes.notesRepository', notesRepository);
})();