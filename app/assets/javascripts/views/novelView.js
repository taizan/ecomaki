

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
	  }
	  else {
		  $(".editer_item", this.el).hide();
	  }
		this.render();
  },

  render: function() {
    $('#title .text').html(this.model.get('title'));
    $('#description .text').html(this.model.get('description'));
    //this.addAll();
  },

  onAddChild: function(){
    // run onScrollEnd method of this if it was scroll end
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
    //this.model.chapters.create_after({},0);
    this.model.create_chapter();
  },

  changeMode: function(mode){
    $(this.el).empty();

  }

});
