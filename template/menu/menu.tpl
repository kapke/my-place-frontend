<h3>Menu</h3>
<ul>
	<li ng-repeat="item in menu.items">
		<a ui-sref="module({module: menu.module, view: item.view})" href="#">{{item.title|translate}}</a>
	</li>
</ul>
<ul ng-repeat="extension in menu.extensions" class="extension">
	<li ng-repeat="item in extension.items">
		<a ui-sref="module({module: extension.module, view: item.view})" href="#">{{item.title|translate}}</a>
	</li>
</ul>