<section ng-controller="ClientData.clientsCtrl">
	<section class="module-section">
		<h2>{{'ClientData.clients'|translate}}</h2>
		<table>
			<thead>
				<tr>
					<th>&nbsp;</th><th>{{'ClientData.name'|translate}}</th><th>{{'ClientData.surname'|translate}}</th>
				</tr>
			</thead>
			<tbody>
				<tr ng-repeat="client in clients" ng-click="showDetails(client)">
					<td>
						<span ng-click="deleteClient(client)">&ndash;</span>
						<span ng-click="editClient(client)">E</span>
					</td>
					<td>{{client.name}}</td>
					<td>{{client.surname}}</td>
				</tr>
			</tbody>
		</table>
	</section>
	<section ng-if="details" class="module-section">
		<h2>{{details.name}} {{details.surname}}</h2>
		<ul>
			<li ng-repeat="product in details.products">
				{{product.vendor.name}} {{product.name}}
			</li>
		</ul>
	</section>
	<section ng-if="editing" class="module-section">
		<h2>{{'ClientData.editClient'|translate}}</h2>
		<form ng-submit="approveChanges()">
			<label>{{'ClientData.name'|translate}}: <input type="text" name="name" ng-model="editing.name" /></label>
			<label>{{'ClientData.surname'|translate}}: <input type="text" name="surname" ng-model="editing.surname" /></label>
			<label>{{'ClientData.addProduct'|translate}} 
				<select name="addedProduct" ng-model="editing.addedProduct" ng-options="product.fullName for product in products"></select>
			</label>
			<button ng-click="cancelChanges()">{{'ClientData.cancel'|translate}}</button>
			<input type="submit" value="{{'ClientData.approveChanges'|translate}}" />
		</form>
	</section>
	<section class="module-section" ng-if="!editing">
		<h2>{{'ClientData.addClient'|translate}}</h2>
		<form ng-submit="addClient()">
			<label>{{'ClientData.name'|translate}}: <input type="text" name="name" ng-model="newClient.name" required /></label>
			<label>{{'ClientData.surname'|translate}}: <input type="text" name="surname" ng-model="newClient.surname" required /></label>
			<input type="submit" value="{{'ClientData.addClient'|translate}}" />
		</form>
	</section>
</section>