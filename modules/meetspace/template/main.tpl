<section class="module-section meetspace" ng-controller="Meetspace.mainCtrl">
	<section class="meetspace-filter">
		<label>Filtruj: <input type="text" ng-model="addressFilter" /></label>
	</section>
	<event-view ng-repeat="event in events | filter:addressFilter" event="event"></event-view>	
</section>
