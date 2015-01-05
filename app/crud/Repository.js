(function () {
'use strict';
function repositoryFactory ($q, $http, EventListener, capitalizeFirst) {
	function Repository (Entity) {
		var parent = {}
		  , entityName = Entity.$name
		  , fields = Entity.$fields
		  ;
		EventListener.call(parent);

		var output = [
			['createEntity', 0, createEntity]
	 	  , ['saveEntity', 0, saveEntity]
	 	  , ['deleteEntity', 0, deleteEntity]
	 	  , ['updateEntity', 0, updateEntity]
	 	  , ['getEntity', 1, getEntities]
	 	  , ['getEmptyEntityData', 0, getEmptyEntityData]
		];
		for (var i=0, l=output.length; i<l; i++) {
			var def = output[i]
			  , funcName = def[0]
			  , eName = entityName[def[1]]
			  , func = def[2]
			  ;
			funcName = funcName.replace('Entity', capitalizeFirst(eName));
			funcName = funcName.replace('Entities', capitalizeFirst(eName));
			this[funcName] = func;
		}
		for (var prop in parent) {
			this[prop] = parent[prop];
		}

		this.Entity = Entity;

		function createEntity (data) {
			var entity = new Entity()
			  , emptyData = getEmptyEntityData()
			  ;
			for(var prop in emptyData) {
				if(data[prop]) {
					entity[prop] = data[prop];
				} else {
					entity[prop] = emptyData[prop];
				}
			}
			return entity;
		}

		function saveEntity (entity) {
			return entity.$save(function (u, getResponseHeaders) {
				var location = getResponseHeaders().location;
				$http.get(location).then(function (response) {
					for(var prop in response.data) {
						entity[prop] = response.data[prop]
					}
					parent.launchEvent(entityName[0]+'Saved', [entity]);
				});
			});
		}

		function deleteEntity (entity) {
			return entity.$delete(function () {
				parent.launchEvent(entityName[0]+'Deleted', [entity]);
			});
		}

		function updateEntity (entity) {
			return entity.$update(function () {
				parent.launchEvent(entityName[0]+'Updated', [entity]);
			});
		}

		function getEntities () {
			var deferred = $q.defer();
			Entity.query(function (entities) {
				deferred.resolve(entities);
			});
			return deferred.promise;
		}

		function getEmptyEntityData () {
			var output = {};

			for(var prop in fields) {
				output[prop] = getDefaultValue(fields[prop]);
				
			}

			return output;

			function getDefaultValue (field) {
				var value = null;
				
				if(typeof field.defaultValue != 'undefined') {
					value = field.defaultValue;
				} else if (field.type) {
					switch(field.type) {
						case String:
							value = '';
							break;
						case Number:
							value = 0;
					}	
				}

				return value;
			}
		}
	}
	return Repository;
}
repositoryFactory.$inject = ['$q', '$http', 'MyPlace.Utils.EventListener', 'capitalizeFirst'];
angular.module('MyPlace.Crud', ['MyPlace.Utils'])
.factory('MyPlace.Crud.Repository', repositoryFactory)
;
})();