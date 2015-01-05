(function () {
'use strict';
function mainCtrl ($scope, Controller, notesRepository) {
	var parent = {};
	Controller.call(parent, $scope, notesRepository);

	$scope.cancelEdits = cancelEdits;

	$scope.$on('Notes.noteEdit', cancelEdits);

	parent.loadNotes();
	parent.emptyNewNote();

	function cancelEdits () {
		$scope.$broadcast('Notes.cancelEdit');
	}
}
mainCtrl.$inject = ['$scope', 'MyPlace.Crud.Controller', 'Notes.notesRepository'];

angular.module('Notes')
.controller('Notes.mainCtrl', mainCtrl)
;
})();