var selectTemplate = (function(){

	var PageTemplate = {};

	PageTemplate["empty"] = {
		"set": function(novel,callback){
			novel.chapters.create({});
      if(callback) callback();
		},

		"button": $('<label class="tempalte" id="empty">Free<br/>Style</label>')
			.css({
				'position': 'absolute',
				'left': $(window).width()/2-180,
				'top': $(window).height()/2-60,
				'width': '120px',
				'height': '120px',
				'font-size': '20pt',
				'background': '#FFFFFF'
			})
			.button()
	};
	
	PageTemplate["4-cell"] = {
		"set": function(novel,callback){
			var makeEntry = function(){
				var chapter = novel.chapters.at(0);
				//console.log(chapterView);
				for(var i = 0; i < 4; i++){
					//接続が重いといくつかはリロードした時に消えるかも
				  	chapter.create_entry_from_template(i);
				}
        if(callback) callback();
			};
			//novel.chapters.create_after({},-1, {'wait':true,'success': makeEntry});
			var newChapter = novel.chapters.create({}, {'success': makeEntry});
      novel.initFlag = true;
		},

		"button": $('<label class="template" id="empty">4コマ</label>')
			.css({
				'position': 'absolute',
				'left': $(window).width()/2+30,
				'top': $(window).height()/2-60,
				'width': '120px',
				'height': '120px',
				'font-size': '20pt',
				'background': '#FFFFFF'
			})
			.button()
	};

	var buttons = $('<dvi class="initialization" id="select_template"></dvi>')
		.css({
			'position': 'fixed',
			'left': 0,
			'top': 0,
			'width': $(window).width(),
			'height': $(window).height(),
			'z-index': 100000,
			'background': 'rgba(0, 0, 0, 0.7)',
			'margin': 'auto'
		});
	
	/*
	var setPage = function(novel, template){
		buttons.remove();
		setPageByTemplate[template].set(novel);
	};
	*/
	
	return function(novel,callback){
		// set UI
		buttons.appendTo('body');

		$.each(PageTemplate, function(key, obj){
			buttons.append( obj.button.click( function(){
				//setPage(novel, key);
				buttons.remove();
				obj.set(novel,callback);
			} ) );
		})
	};
})();
