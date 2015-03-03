(function () {
'use strict';
function EventListener (promisedEvents) {
	var events = {};
	promisedEvents = (function (events) {
		var output = {};
		events.forEach(function (name) {
			output[name] = [];
		});
		return output;
	})(promisedEvents || []);

	this.removeEventListener = removeEventListener;
	this.addEventListener = addEventListener;
	this.launchEvent = launchEvent;

	function removeEventListener (name, listener) {
		var index = events[name].indexOf(listener);
		if(index > -1) {
			return events[name].splice(index, 1);
		} else {
			return null;
		}
	}
	function addEventListener (name, listener) {
		if(!events[name]) {
			events[name] = [];
		}
		var index = events[name].indexOf(listener);
		if(index == -1) {
			events[name].push(listener);
		}
		if(promisedEvents[name]) {
			promisedEvents[name].forEach(function (data) {
				listener.apply(data.that, data.params);
			});
		}
	}
	function launchEvent (name, params, that) {
		that = that || this;
		if(events[name]) {
			events[name].forEach(function (listener) {
				listener.apply(that, params);
			});	
		}
		if(promisedEvents[name]) {
			promisedEvents[name].push({params: params, that: that});
		}
	}
}

angular.module('MyPlace.Utils')
.factory('MyPlace.Utils.EventListener', function () {
	return EventListener;
});
})();