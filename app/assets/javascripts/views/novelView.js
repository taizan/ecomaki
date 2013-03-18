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
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);
    //this.model.bind('sync',this.onSync);
    //this.model.bind('fetch',this.onSync);
    //this.model.bind('add',this.onSync);
    //this.model.bind('refresh',this.onSync);
    //this.model.bind('change:status',this.onChangeStatus);
    this.model.bind('change:title',this.render);
    this.model.bind('change:description',this.render);
    this.model.bind('change:author_name',this.render);
    //this.model.bind('change',this.render);

    this.childModels = this.model.chapters.models;
    /*
    */
  },

  onRemove: function() {
    this.model.chapters.unbind('add', this.addOne);
    this.model.chapters.unbind('refresh', this.addAll);
    //this.model.unbind('change:status',this.onChangeStatus);
    this.model.unbind('change:title',this.render);
    this.model.unbind('change:description',this.render);
    this.model.unbind('change:author_name',this.render);
    
  },

  events: {
    "click #add_chapter" : "addChapter",
    "click #new_chapter_handle" : "addChapter",
    'click': 'onViewClick',
  },


  checkStatus: function() {
  
    // add chapter if status = initial
    // or 
    console.log(this.model.get('status'));
    if(this.model.get('status') == 'initial'){
      //this.model.create_chapter();
      //var chapter =  this.model.chapters.create_after({},-1);
			//setPageByTemplate["empty"].apply(this);
			//setPageByTemplate["4-cell"].apply(this);
			selectTemplate(this);
//>>>>>>> make templates
      this.model.save({'status': 'draft'})
    }
    
  },
  

  onLoad: function(){
      //reflesh child

      this.checkStatus();

      this.addAll();	

      if (this.isEditable) {

        this.setEditable('#title','title');
        this.setEditable('#description','description');
        this.setEditable('#author_name','author_name');
	    }
	    else {
		    $(".editer_item", this.el).hide();
	    }
       
      // call onScroll root here
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
    var chapter =  this.model.chapters.create_after({},-1);
    //this.model.create_chapter();

  },

  changeMode: function(mode){
    $(this.el).empty();

  }

});
