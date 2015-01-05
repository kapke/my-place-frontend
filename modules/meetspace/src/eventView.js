(function () {
'use strict';
function eventView () {
	return {
		templateUrl: 'frontend/modules/meetspace/template/eventView.tpl'
	  , restrict: 'E'
	  , scope: {
	  		event: '='
	    }
	  , link: function (scope, element) {
	  		var shown = false
	  		  , preparedAgenda = false
	  		  , now = new Date()
	  		  ;

	  		if(now.getTime() > scope.event.time) {
	  			element.addClass('past');
	  		}

	  		scope.showFull = showFull;
	  		scope.hideFull = hideFull;

	  		function showFull () {
	  			if(!preparedAgenda) {
	  				preparedAgenda = prepareAgenda(scope.event.agenda);
	  				// scope.event.preparedAgenda = preparedAgenda;
	  				element
			  			.find('.agenda')
			  			.get(0)
			  			.appendChild(
			  				preparedAgenda
			  			);
	  			}
	  			shown = true;
	  			element.addClass('full');
	  		}

	  		function hideFull () {
	  			shown = false;
	  			element.removeClass('full');
	  		}

	  		function toggleFull () {
	  			if(shown) {
	  				hideFull();
	  			} else {
	  				showFull();
	  			}
	  		}

	  		function prepareAgenda (agenda) {
	  			var parser = new DOMParser()
	  			  , frag = document.createDocumentFragment()
	  			  , parsed = parser.parseFromString(agenda, 'text/html')
	  			  ;
	  			[].forEach.call(parsed.body.children, function (e) {
	  				frag.appendChild(parseElement(e));
	  			});
	  			return frag;

	  			function parseElement (elem) {
	  				cleanElement(elem);
	  				[].forEach.call(elem.children, parseElement);
	  				return elem;

	  				function cleanElement (elem) {
	  					elem.removeAttribute('style');
	  					return elem;
	  				}
	  			}
	  		}
	    }
	};
}
eventView.$inject = [];

angular.module('Meetspace')
.directive('eventView', eventView)
;
})();