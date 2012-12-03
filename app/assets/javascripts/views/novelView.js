

NovelView = ecomakiView.extend({
  className: 'novel',
  lastChapter: 0,
  parentView: null,
  isLoaded: true,
  tmplId: "#novel_template",
  childViewType: ChapterView,
  elementList: ".chapterList",

  onInit: function(args) {
    _.bindAll(this, "addChapter");
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);

    this.childModels = this.model.chapters.models;
  },

  events: {
    "click #add_chapter" : "addChapter",
    'click': 'onViewClick'    
  },


  onLoad: function(){
    var _self = this;

    this.addAll();	

    if (this.isEditable) {
		  $('#title').click(function(ev){
			    editableTextarea(this, _self.saveTitle);

		    });
		  $('#description').click(function(ev){
			    editableTextarea(this, _self.saveDescription);
		    });
      $('#author').click( function(ev){ 
           editableTextarea(this, function(str){ _self.model.save('author_name',str); });
        });
	  }
	  else {
		  $(".editer_item", this.el).hide();
	  }
		this.render();
  },

  render: function() {
    $('#title .text').html(this.model.get('title'));
    $('#description .text').html(this.model.get('description'));
    $('#author .text').html(this.model.get('author_name'));
    //this.addAll();
  },

  onAddChild: function(view){
    // run onScrollEnd method of this if it was scroll end
    if(this.isEditable){ view.load();}
    else{ this.onScroll(); }
  },

	onScrollEnd: function(){
    console.log('end scroll');
		if(! this.isEditable) {
      if(this.lastChapter < this.childViews.length){
		    this.childViews[this.lastChapter].load();
		    this.lastChapter++;
      }
    }
	},

  addChapter: function(e){
    console.log("addChapter");
    var chapter =  this.model.chapters.create_after({},-1);
    //this.model.create_chapter();

  },

  changeMode: function(mode){
    $(this.el).empty();

  }

});
