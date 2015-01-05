<section ng-controller="ClientConversions.mainCtrl">
	<section class="module-section">
		<h2>{{'ClientData.clients'|translate}}</h2>
		<ul>
			<li ng-repeat="client in clients" ng-click="selectClient(client)">
				{{client.name}} {{client.surname}}
			</li>
		</ul>
	</section>
	<section class="module-section">
		<h2>{{'ClientData.products'|translate}}</h2>
		<ul>
			<li ng-repeat="product in actualClient.products" ng-click="selectProduct(product)">
				{{product.fullName}}
			</li>
		</ul>
	</section>
	<section class="module-section">
		<h2>{{'ClientConversions.conversions'|translate}}</h2>
		<ul>
			<li ng-repeat="conversion in conversions">
				{{conversion.timestamp}} &ndash; {{conversion.note}}
			</li>
		</ul>
	</section>
	<section class="module-section" ng-if="actualClient && actualProduct">
		<h2>{{'ClientConversions.addConversion'|translate}}</h2>
		<form ng-submit="addConversion()">
			<label>{{'ClientConversions.conversionNote'|translate}}: <input type="text" ng-model="newConversion.note" name="note" /></label>
			<input type="submit" value="{{'ClientConversions.addConversion'|translate}}" />
		</form>
	</section>
</section>