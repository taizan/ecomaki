//= require ./pageTemplates

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
    this.childModels = this.model.chapters.models;
    
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);

  },

  onRemove: function() {
    this.model.chapters.unbind('add', this.addOne);
    this.model.chapters.unbind('refresh', this.addAll);
    //this.model.unbind('change:status',this.onChangeStatus);
  },

  events: {
    "click #add_chapter" : "addChapter",
    "click #new_chapter_handle" : "addChapter",
//    'click': 'onViewClick',
  },

  checkStatus: function() {
    if(this.model.get('status') == 'initial'){
      this.isLoaded = false;;
			selectTemplate(this.model,this.load);
      this.model.save({'status': 'draft'})
    }
  },
  


  
  onLoad: function(){
     // this.checkStatus();

      this.addAll();	

      if (this.isEditable) {

        this.setEditable('#title','title');
        this.setEditable('#description','description');
        this.setEditable('#author_name','author_name');
	    }
	    else {
		    $(".editer_item", this.el).hide();
	    }
       
      //$(window).scroll(this.onScroll);
      
      // do not work not loaded
      this.render();
  },

 render: function() {
    console.log('render novel');
    console.log(this.isEditing);
    if( ! this.isEditing ){
      this.setTextTo('title','#title','無題');
      this.setTextTo('description','#description','説明書き');
      this.setTextTo('author_name','#author_name','名無しさん');
    }
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
    var chapter =  this.model.chapters.create_after({},0);
    //this.model.create_chapter();
  },

  changeMode: function(mode){
    $(this.el).empty();
  }

});
