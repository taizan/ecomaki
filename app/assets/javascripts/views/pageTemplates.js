var selectTemplate = (function(){

	// set templates
	var setPageByTemplate = {
		"empty": function(){
			this.model.chapters.create_after({},-1);
		},
	
		"4-cell": function(){
			var novelView = this;
			var makeEntry = function(){
				var chapterView = novelView.childViews[0];
				//console.log(chapterView);
				for(var i = 0; i < 4; i++){
					chapterView.addEntryWith2Character();
				}
			};
			this.model.chapters.create_after({},-1, {'success': makeEntry});
		}
	};

	// you should set UI using this dvi object
	var buttons = $('<dvi class="initialization" id="select_template"></dvi>');
	
	var setPage = function(novelView, temp){
		// for setting page and removing UI for select template
		buttons.remove();
		setPageByTemplate[temp].apply(novelView);
	};
	
	return function(novelView){
		// set UI
		buttons.css('margin', 'auto')
			.append($('<label>Empty</label>')
				.button()
				.click(function(){ setPage(novelView, "empty"); }))
			.append($('<label>4コマ</label>')
				.button()
				.click(function(){ setPage(novelView, "4-cell"); }))
			.appendTo('body');
	};
})();
