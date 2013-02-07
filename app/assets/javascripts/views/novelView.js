

NovelView = ecomakiView.extend({
  className: 'novel',
  lastChapter: 0,
  parentView: null,
  isLoaded: true,
  tmplId: "#novel_template",
  childViewType: ChapterView,
  elementList: ".chapterList",
  

  onInit: function(args) {
    _.bindAll(this, "addChapter","onSync");
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);
    this.model.bind('sync',this.onSync);
    this.model.bind('fetch',this.onSync);
    this.model.bind('add',this.onSync);
    this.model.bind('refresh',this.onSync);
    this.model.bind('change:status',this.onSync);


    this.childModels = this.model.chapters.models;
    /*
    */
  },

  events: {
    "click #add_chapter" : "addChapter",
    'click': 'onViewClick',
  },

  onSync: function() {
  
    // add chapter if status = initial
    // or 
    console.log(this.model.get('status'));
    if(this.model.get('status') == 'initial'){
      //this.model.create_chapter();
      var chapter =  this.model.chapters.create_after({},-1);
      this.model.save({'status': 'draft'})
    }
  },

  onLoad: function(){
      var _self = this;
      //reflesh child
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
       
      // call onScroll root here
      //$(window).scroll(this.onScroll);
		 

      this.render();
  },

  render: function() {
    // temp code 
    
    //console.log(this.model.get('status'));
    //console.log(this.isPreview);
    if( this.model.get('status') !== undefined && this.model.get('status') != 'publish' && !this.isEditable && !this.isPreview) {
      alert('公開されていません。this novle is not published');
      $(this.el).remove();
    } 
    
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
