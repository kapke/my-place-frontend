'use strict';
function EventListener () {
	var events = {};

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
	}
	function launchEvent (name, params, that) {
		that = that || this;
		if(events[name]) {
			events[name].forEach(function (listener) {
				listener.apply(that, params);
			});	
		}
	}
}

angular.module('MyPlace.Utils')
.factory('MyPlace.Utils.EventListener', function () {
	return EventListener;
});