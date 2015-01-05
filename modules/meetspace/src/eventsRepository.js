(function () {
'use strict';
function eventsRepository (promisifyReturn, Repository, Event) {
	var parent = {}
	  , eventsCache
	  , cities = []
	  ;
	Repository.call(parent, Event);

	for(var prop in parent) {
		this[prop] = parent[prop];
	}

	this.getEvents = getEvents;

	function getEvents () {
		var promisifiedReturn = promisifyReturn(function () {
			return eventsCache;
		});
		if(!eventsCache) {
			return parent.getEvents().then(function (events) {
				events.forEach(function (ev) {
					ev.time = new Date(ev.time*1000);
				});
				eventsCache = events;
				return events;
			});
		} else {
			return promisifiedReturn();
		}
	}
}
eventsRepository.$inject = ['promisifyReturn', 'MyPlace.Crud.Repository', 'Meetspace.Event'];

angular.module('Meetspace')
.service('Meetspace.eventsRepository', eventsRepository)
;
})();