<h3>{{::event.name}}</h3>
<span class="date">{{::event.time|date:'dd.MM.yyyy HH:mm'}}</span>
<address>{{::event.address}}</address>
<div class="more" ng-click="showFull()">{{'MyPlace.more'|translate}}</div>
<div class="details">
	<p class="agenda"></p>
	<header>
		<h3>{{::event.name}}</h3>
		<span class="date">{{::event.time|date:'dd.MM.yyyy HH:mm'}}</span>
		<address>{{::event.address}}</address>
	</header>
	<div class="less" ng-click="hideFull()">{{'MyPlace.close'|translate}}</div>
</div>
