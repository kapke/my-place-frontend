<ul>
	<li ng-repeat="module in modules" ng-class="{active: isModuleActive(module.slug)}">
		<mp-module-widget module="module" />
	</li>
</ul>