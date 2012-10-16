

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
  },

  onLoad: function(){
    var _self = this;
    
    if (this.isEditable) {
		  $('#title').dblclick(function(){
			    editableTextarea(this, _self.saveTitle);
		    });
		  $('#description').dblclick(function(){
			    editableTextarea(this, _self.saveDescription);
		    });
	  }
	  else {
		  $(".editer_item", this.el).hide();
	  }
    this.addAll();	
		this.render();
  },

  render: function() {
    $('#title .text').html(this.model.get('title'));
    $('#description .text').html(this.model.get('description'));
    //this.addAll();
  },

  onAddChild: function(){
    this.onScroll();
  },

	onScrollEnd: function(){
    console.log('end scroll');
		if(this.lastChapter < this.childViews.length){
		  this.childViews[this.lastChapter].load();
		  this.lastChapter++;
    }
	},

  addChapter: function(e){
    console.log("addChapter");
    this.model.create_chapter();
  },

  changeMode: function(mode){
    $(this.el).empty();

  }

});
