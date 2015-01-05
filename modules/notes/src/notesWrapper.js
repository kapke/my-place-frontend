(function () {
'use strict';
function notesWrapper (notesRepository) {
	return {
		restrict: 'E'
	  , templateUrl: 'frontend/modules/notes/template/notesWrapper.tpl'
	  , scope: {notes: '='}
	  , link: function (scope, element) {
			var initialWidth = element.outerWidth(true);

			element.css('padding', 0);
			element.css('margin', 0);


			updateNotes();

			function updateNotes () {
				var columns = calculateColumns();
				scope.distributedNotes = distributeNotes(scope.notes, columns);
				element.width(initialWidth*columns);
			}

			function distributeNotes (notes, columns) {
				var output = []
				  ;
				for(var i=0; i<columns; i++) {
					output[i] = [];
				}
				notes.forEach(function (note, index) {
					output[index%columns].push(note);
				});
				output = output.filter(function (e) {
					return e.length;
				});
				return output;
			}			

			function calculateColumns () {
				var parentWidth = element.parent().innerWidth()
				  , availableWidth = parentWidth-initialWidth
				  , columns = Math.floor(availableWidth/initialWidth)
				  ;
				return columns;	
			}
			scope.$watch('notes.length', function (newValue, oldValue) {
				if(newValue > oldValue) {
					updateNotes();
				}
			});
			notesRepository.addEventListener('noteDeleted', function (note) {
				scope.distributedNotes.forEach(function (column) {
					var index = column.indexOf(note);
					if(index >= 0) {
						column.splice(index, 1);
					}
				});
			});
			window.addEventListener('resize', updateNotes);
		}
	};
}
notesWrapper.$inject = ['Notes.notesRepository'];

angular.module('Notes')
.directive('notesWrapper', notesWrapper)
;
})();