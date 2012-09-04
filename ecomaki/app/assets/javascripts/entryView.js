// change deletemeter from <%= %> to {{ }}
$(function(){   _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };
   });



ChapterView = Backbone.View.extend({
    //el : '#content',
    className : 'chapter' ,
	initialize: function(options){
        this.counter = 0;
	_.bindAll(this, "render","appendEntry","addEntry","addAll","addOne","onChange");
	this.model.bind("change", this.render);

        this.model.entries.bind('add', this.addOne);
        this.model.entries.bind('refresh', this.addAll);
        this.model.entries.bind('change', this.onChange);
//	console.log("Current length: " + this.model.entries.length);
	this.model.entries.bind('add', function() {
//		console.log("entry is changedlength:" + this.model.entries.length);
	});
        //console.log(this.model.entries);
        console.log(this.model.entries.models);
	chapter = this;
        chapterModel = this.model;
        this.render();
	},

    addOne: function (item,t,options) {
        console.log(item);
        var view = new EntryView({model: item});
        $(this.el).insertAt(options.index,view.render().el);
    },

    addAll: function () {
        //_(this.model.entries.models).each(console.log) ;
        $(this.el).empty();
 	console.log(this.model.entries.models);
        _(this.model.entries.models).each(this.addOne);
    },
    onChange: function(){
        console.log("onchange");
    },
    events: {
	"keypress #inputform" : "onKeyPress",    	
	"click .entry" : "click"
    },
    render: function(){
        console.log("render");
        this.addAll();
        return this;
    },

       click: function(){ console.log("click");},
       appendEntry: function(entry){
       var entryView = new EntryView({
          model: entry
       });
       $( '#entrylist').append(entryView.render().el);
       return entryView;
    },
    addEntry: function(entry){
      	this.model.entries.add(entry);
      	return this;
    },
    onKeyPress: function (e){
        console.log("onkeypress");
        alert(e.whitch );
    	if(e.which == 13){
    	     var entry = new Entry({ novel_id: this.model.entries.novel_id , id: this.counter });
	     this.addEntry(entry);   
             this.appendEntry(entry).addBaloon( $('#inputform').val() );
	     $('#inputform').val("");   
	}
    }
});


EntryView = Backbone.View.extend({
   className : 'entry',
   initialize: function(){
       _entryView = this;
	   _model = this.model;
       _.bindAll(this, "render");
       _.bindAll(this,'click','addBaloon','addPicture','addDefaultBaloon','addDefaultPicture','remove','addEntry','changeLayer');
       this.model.bind("change", this.render);
       this.render();
   },
   render: function(){

      var template = _.template( $("#entry_template").html(),this.model.attributes);
      $(this.el).html( template);
      //$(this.el).css({position: 'relative' , width:800,height:300})
      //var self = this;
     /*
      _(this.model.baloons.models).each(function(baloon){ // in case collection is not empty
        	var baloonView = new BaloonView( { model: baloon } );
                $( self.el ).find('.entry-content').append(baloonView.render().el);

           }, this);
      _(this.model.pictures.models).each(function(picture){ // in case collection is not empty
                var pictureView = new PictureView( { model: picture } );
                $( self.el ).find('.entry-content').append(pictureView.render().el);

           }, this);
      */
      return this;
   },
   events: {
       "click" : "click",
       "click .--btn-baloon": "addDefaultBaloon",
       "click .--btn-picture": "addDefaultPicture",
       "click .--btn-remove": "remove",
       "click .--btn-entry": "addEntry",
       "click .--btn-layer": "changeLayer"
   },
   
   click: function(){console.log("click entry")  },
       
   addBaloon: function( string ){
       console.log("addBaloon");
   },
    
    addPicture: function( source ){
        console.log("addPicture");
   },
    
    
   addDefaultBaloon: function(e){
        this.addBaloon('');
   },
   addDefaultPicture: function(e){
        this.addPicture('');
   },
   remove: function(e){
	console.log("remove");
        $(this.el).remove();
   },
   addEntry: function(e){
        console.log("addEntry");
   	//this.model.
   },
   changeLayer: function(e){
   	$('canvas',this.el).css({})
   }
});


