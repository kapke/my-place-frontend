<h3>{{'MyPlace.moduleList'|translate}}</h3>
<ul>
	<li ng-repeat="module in modules" ng-class="{active: isModuleActive(module.slug)}">
		<a ui-sref="module({module: module.slug, view: ''})">{{module.name|translate}}</a>
	</li>
</ul>