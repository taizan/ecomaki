

var NovelView = ecomakiView.extend({
  className: 'novel',
  lastChapter: 0,
  parentView: null,
  tmpl: $("#novel_template").html(),
  childViewType: ChapterView,

  onInit: function(args) {
    _.bindAll(this, "addChapter");
  },

  events: {
    "click #add_chapter" : "addChapter",
  },

  onAppend: function(){
    var _self = this;
    
    if(this.isEditable){
      $('#title').dblclick( function(){ editableTextarea(this,_self.saveTitle);});
      $('#description').dblclick(function(){editableTextarea(this,_self.saveDescription);});
    }else{
      $(".editer_item",this.el).hide();
    }
		this.render();
  },

  render: function() {
    $('#title .text').html(this.model.get('title'));
    $('#description .text').html(this.model.get('description'));
    this.addAll();
  },

  addChapter: function(e){
    console.log("addChapter");
    this.model.create_chapter();
  },
	
	onScrollEnd: function(){
		if(lastChapter < this.childViews.length)
		this.childViews[lastChapter].onLoad();
		this.lastChapter++;
	},

});
