<div class="column" ng-repeat="column in distributedNotes">
	<note-view ng-repeat="note in column | orderBy:'id':true" 
			   note="note" />	
</div>