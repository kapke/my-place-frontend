<section ng-controller="ClientData.productsCtrl">
	<section class="module-section">
		<h2>{{'ClientData.products'|translate}}</h2>
		<div>
			<div ng-repeat="vendor in vendors">
				<h3>{{vendor.name}}</h3>
				<div ng-repeat="product in products[vendor.name]">{{product.name}}</div>
			</div>
		</div>
	</section>
	<section class="module-section">
		<h2>{{'ClientData.addProduct'|translate}}</h2>
		<form ng-submit="addProduct()">
			<label>{{'ClientData.vendor'|translate}}: <select ng-model="newProduct.vendor" ng-options="vendor.id as vendor.name for vendor in vendors"></select></label>
			<label>{{'ClientData.productName'|translate}}: <input type="text" name="name" ng-model="newProduct.name" required /></label>
			<input type="submit" value="{{'ClientData.addProduct'|translate}}" />
		</form>
	</section>
	<section class="module-section">
		<h2>{{'ClientData.addVendor'|translate}}</h2>
		<form ng-submit="addVendor()">
			<label>{{'ClientData.vendorName'|translate}}: <input type="text" name="name" ng-model="newVendor.name" required /></label>
			<input type="submit" value="{{'ClientData.addVendor'|translate}}">
		</form>
	</section>
</section>