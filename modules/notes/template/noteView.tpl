<div ng-hide="editing" ng-click="edit()">
	<h3 class="title">{{note.title}}</h3>
	<p class="content">{{note.content}}</p>
</div>
<form ng-show="editing">
	<label>
		<span>{{'Notes.title'|translate}}</span>
		<input type="text" 
			   name="title" 
			   placeholder="{{'Notes.title'|translate}}" 
			   ng-model="edited.title" />
	</label>
	<label>
		<span>{{'Notes.content'|translate}}</span>
		<textarea type="text" 
		          name="content" 
		          placeholder="{{'Notes.content'|translate}}" 
		          ng-model="edited.content">
		          </textarea>
	</label>
</form>
<div class="action-bar">
	<button ng-click="deleteNote()">
		{{'Notes.delete'|translate}}</button>
	<button ng-click="cancelEdit()" ng-show="editing">
		{{'Notes.cancel'|translate}}</button>
	<button ng-click="saveEdit()" ng-show="editing">
		{{'Notes.save'|translate}}</button>
</div>