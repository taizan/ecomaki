var selectTemplate = (function(){

	var PageTemplate = {};

	PageTemplate["empty"] = {
		"set": function(novelView){
			novelView.model.chapters.create_after({},-1);
		},

		"button": $('<label class="tempalte" id="empty">Empty</label>').button()
	};
	
	PageTemplate["4-cell"] = {
		"set": function(novelView){
			var makeEntry = function(){
				var chapterView = novelView.childViews[0];
				//console.log(chapterView);
				for(var i = 0; i < 4; i++){
					//接続が重いといくつかはリロードした時に消えるかも
					chapterView.addEntryWith2Character();
				}
			};
			novelView.model.chapters.create_after({},-1, {'success': makeEntry});
		},

		"button": $('<label class="template" id="empty">4コマ</label>').button()
	};

	var buttons = $('<dvi class="initialization" id="select_template"></dvi>').css('margin', 'auto');
	
	/*
	var setPage = function(novelView, template){
		buttons.remove();
		setPageByTemplate[template].set(novelView);
	};
	*/
	
	return function(novelView){
		// set UI
		buttons.appendTo('body');

		$.each(PageTemplate, function(key, obj){
			buttons.append( obj.button.click( function(){
				//setPage(novelView, key);
				buttons.remove();
				PageTemplate[key].set(novelView);
			} ) );
		})
	};
})();
