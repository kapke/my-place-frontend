<section ng-controller="MyPlace.mainCtrl" layout="row" flex>
    <ui-view ng-controller="MyPlace.Module.moduleCtrl" class="my-place-content" ng-class="{menu: menuVisible, 'no-menu': menuHidden}" flex></ui-view>
    <mp-menu ng-hide="menuHidden" class="ng-hide"></mp-menu>
    <mp-module-list ng-controller="MyPlace.Module.moduleListCtrl"></mp-module-list>
</section>
