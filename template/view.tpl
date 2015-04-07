<section ng-controller="MyPlace.mainCtrl" layout="row" flex>
    <div class="view-wrapper" flex>
        <ui-view ng-controller="MyPlace.Module.moduleCtrl" class="my-place-content md-hue-1" ng-class="{menu: menuVisible, 'no-menu': menuHidden}"></ui-view>
    </div>
    <mp-menu ng-hide="menuHidden" class="ng-hide"></mp-menu>
    <mp-module-list ng-controller="MyPlace.Module.moduleListCtrl"></mp-module-list>
</section>
