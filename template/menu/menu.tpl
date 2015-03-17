<md-sidenav md-is-locked-open="$mdMedia('gt-md')">
    <md-content>
        <md-list layout="column">
            <md-item ng-repeat="item in menu.items">
                <md-item-content>
                    <md-button>
                        <mp-menu-item item="item" module="menu.module" ng-class="{'active': view==item.view}"></mp-menu-item>
                    </md-button>
                </md-item-content>
            </md-item>
        </md-list>
        <md-list ng-repeat="extension in menu.extensions" class="extension" layout="column">
            <md-item ng-repeat="item in extension.items">
                <a ui-sref="module({module: extension.module, view: item.view})" href="#">{{item.title|translate}}</a>
            </md-item>
        </md-list>
    </md-content>
</md-sidenav>
