(function () {
'use strict';
function controllerFactory (capitalizeFirst) {
	function Controller ($scope, repository, listeners) {
		var name = repository.Entity.$name
		  , singularName = name[0]
		  , pluralName = name[1]
		  , capitalizedSingular = capitalizeFirst(singularName)
		  , capitalizedPlural = capitalizeFirst(pluralName)
		  , get = 'get'+capitalizedPlural
		  , newName = 'new'+capitalizedSingular
		  , add = 'add'+capitalizedSingular
		  , save = 'save'+capitalizedSingular
		  , create = 'create'+capitalizedSingular
		  , deleteName = 'delete'+capitalizedSingular
		  , deleteEvent = singularName+'Deleted'
		  , saveEvent = singularName+'Saved'
		  , getEmpty = 'getEmpty'+capitalizedSingular+'Data'
		  ;

		$scope[pluralName] = [];
		$scope[newName] = {};

		$scope[add] = addEntity;
		$scope[deleteName] = deleteEntity;

		
		if(listeners && typeof listeners[saveEvent] != 'undefined') {
			repository.addEventListener(saveEvent, listeners[saveEvent]);
		} else {
			repository.addEventListener(saveEvent, saveEventListener);
		}

		if(listeners && typeof listeners[deleteEvent] != 'undefined') {
			repository.addEventListener(deleteEvent, listeners[deleteEvent]);
		} else {
			repository.addEventListener(deleteEvent, deleteEventListener);
		}

		this['load'+capitalizedPlural] = loadEntities;
		this[add] = addEntity;
		this['emptyNew'+capitalizedSingular] = emptyNewEntity;
		this[deleteName] = deleteEntity;
		this.deleteEventListener = deleteEventListener;
		this.saveEventListener = saveEventListener;

		function loadEntities () {
			repository[get]().then(function (entities) {
				$scope[pluralName] = entities;
			});
		}

		function addEntity () {
			repository[save](repository[create]($scope[newName]));
		}

		function deleteEntity (entity) {
			repository[deleteName](entity);
		}

		function deleteEventListener (entity) {
			var index = $scope[pluralName].indexOf(entity);
			if(index >= 0) {
				$scope[pluralName].splice(index, 1);
			}
		}

		function emptyNewEntity () {
			$scope[newName] = repository[getEmpty]();
		}

		function saveEventListener (entity) {
			$scope[pluralName].push(entity);
			emptyNewEntity();
		}

	}
	return Controller;
}
controllerFactory.$inject = ['capitalizeFirst'];
angular.module('MyPlace.Crud')
.factory('MyPlace.Crud.Controller', controllerFactory)
;
})();