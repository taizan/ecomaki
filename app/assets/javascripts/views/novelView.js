

NovelView = ecomakiView.extend({
  className: 'novel',
  lastChapter: 0,
  parentView: null,
  isLoaded: true,
  tmplId: "#novel_template",
  childViewType: ChapterView,
  elementList: ".chapterList",
  

  onInit: function(args) {
    _.bindAll(this, "addChapter","onSync","onChangeStatus");
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);
    //this.model.bind('sync',this.onSync);
    //this.model.bind('fetch',this.onSync);
    //this.model.bind('add',this.onSync);
    //this.model.bind('refresh',this.onSync);
    this.model.bind('change:status',this.onChangeStatus);
    this.model.bind('change',this.render);

    this.childModels = this.model.chapters.models;
    /*
    */
  },

  events: {
    "click #add_chapter" : "addChapter",
    'click': 'onViewClick',
  },

  onSync: function(){
  },

  onChangeStatus: function() {
  
    // add chapter if status = initial
    // or 
    console.log(this.model.get('status'));
    if(this.model.get('status') == 'initial'){
      this.model.create_chapter();
      //var chapter =  this.model.chapters.create_after({},-1);
      this.model.save({'status': 'draft'})
    }
    
    //console.log(this.isPreview);
    if( this.model.get('status') !== undefined && this.model.get('status') != 'publish' && !this.isEditable && !this.isPreview) {
      $(this.el).remove();
      alert('公開されていません。this novle is not published');
    }

  },

  onLoad: function(){
      var _self = this;
      //reflesh child
      this.addAll();	

      if (this.isEditable) {

        function setEditable(target){
          $('#'+target)
            .bind('input', function(){
               _self.isEditing = true;
               _self.model.save(target,( $('#'+target).text() ));
            })
            .bind('blur', function(){
               _self.isEditing = false;
            });
        }

        setEditable('title');
        setEditable('description');
        setEditable('author_name');
	    }
	    else {
		    $(".editer_item", this.el).hide();
	    }
       
      // call onScroll root here
      //$(window).scroll(this.onScroll);
      
      // do not work not loaded
      //this.render();
  },

  render: function() {
    console.log('render novel');
    if( ! this.isEditing ){
      $('#title').html(this.model.get('title'));
      $('#description').html(this.model.get('description'));
      $('#author_name').html(this.model.get('author_name'));
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
