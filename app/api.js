'use strict';
function apiService ($resource, Config) {
	var backendPrefix = Config.backendPrefix
	  , frontendPrefix = Config.frontendPrefix
	  , BACKEND = backendPrefix
	  , FRONTEND = frontendPrefix
	  , Module = $resource(backendPrefix+'modules')
	  , Menu = $resource(frontendPrefix+'modules/:module/resources/menu.json')
	  ;

	this.BACKEND = BACKEND;
	this.FRONTEND = FRONTEND;
	this.getResource = getResource;
	this.Module = Module;
	this.Menu = Menu;

	function getResource (config) {
		var outputResource
		  , prefix = config.type || BACKEND
		  , sufix = ''
		  , name = config.name
		  , fields = config.fields
		  , module = config.module || ''
		  , resource = config.resource || name[1]+'/:id'
		  , rConfig = config.config || {id: '@id'}
		  , actions = config.actions || {
		  		update: {method: 'PUT', params: {}}
		  	}
		  ;
		if(config.type == FRONTEND) {
			prefix += 'modules/'
		}
		outputResource = $resource(prefix+module+'/'+resource+sufix, rConfig, actions);
		outputResource.$fields = fields;
		outputResource.$name = name;
		return outputResource;
	}
}

apiService.$inject = ['$resource', 'MyPlace.configService'];

angular.module('MyPlace.Api', ['ngResource'])
.service('MyPlace.apiService', apiService)
;