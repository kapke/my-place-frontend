<md-sidenav md-is-locked-open="$mdMedia('gt-md')">
    <md-content>
        <md-list layout="column">
            <md-item ng-repeat="module in modules">
                <md-item-content>
                    <md-button href="#">
                        <mp-module-widget module="module" ng-class="{'active': isModuleActive(module.slug)}" />
                    </md-button>
                </md-item-content>
            </md-item>
        </md-list>
    </md-content>
</md-sidenav>