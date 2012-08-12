// change deletemeter from <%= %> to {{ }}
$(function(){   _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };
   });

ChapterView = Backbone.View.extend({
        el : '#content',
	initialize: function(options){
            counter = 0;
	    _.bindAll(this, "render","appendEntry","addEntry");
	    model1 = this.model;
	    this.model.bind("change", this.render);
	    // alert();
	    this.counter =0;
	    //this.el = $('#content');
	    this.render();
	},
	events: {
		"keypress #inputform" : "onKeyPress",    	
		"click .entry" : "click"
	
	},
	render: function(){
	   	var self = this;
	    _(this.model.entries.models).each(function(entry){ // in case collection is not empty
        	self.appendEntry(entry);
    		self.counter++;    
      }, this);
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
    	this.counter++;
      	this.model.entries.add(entry);
      	return this;
    },
    onKeyPress: function (e){
        //alert(e.whitch );
    	if(e.which == 13){
    	     var entry = new Entry({ novel_id: this.model.entries.novel_id , id: counter });
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
      $(this.el).css({position: 'relative' , width:800,height:300})
      var self = this;
      _(this.model.baloons.models).each(function(baloon){ // in case collection is not empty
        	var baloonView = new BaloonView( { model: baloon } );
                $( self.el ).find('.entry-content').append(baloonView.render().el);

           }, this);
      _(this.model.pictures.models).each(function(picture){ // in case collection is not empty
                var pictureView = new PictureView( { model: picture } );
                $( self.el ).find('.entry-content').append(pictureView.render().el);

           }, this);

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
       var baloon  = new Baloon( 
            {
   				text: string,
   				width: 100,
   				height: 50,
   				top: 50,
   				left: 150
   			});
   	this.model.baloons.add(baloon);
        var baloonView = new BaloonView( { model: baloon } );
        $( this.el ).find('.entry-content').append(baloonView.render().el);
    },
    
    addPicture: function( source ){
        console.log("addPicture");
        var picture = new Picture( 
        	{
   		    	src:source,
   			    width: 150,
   			    height: 150,
   			    top: 50,
   			    left: 50
   		});
	 this.model.pictures.add(picture);
         var pictureView = new PictureView( { model: picture}); 
         $( this.el ).find('.entry-content').append(pictureView.render().el);
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



BaloonView = Backbone.View.extend({
    className: "baloon",
    initialize: function(){
        _.bindAll(this, "render","remove","editText");
        model = this.model;
        this.model.bind("change", this.render);

        $(this.el).draggable({containment: "parent"})
            .resizable({ containment: "parent" })
            .dblclick(this.editText);
        this.render();
    },

    render: function(){
        $(this.el).css({
            top: this.model.top,
            left: this.model.left,
            position: "absolute"
         }).width(this.model.width).height(this.model.height);

         return this;
   },

   remove: function(){
   		$(this.el).remove();
   		//?
   		this.model.remove();
   },
   editText: function(){
   text = $(".--baloon-text",this.el).html();
   text = text.split("<br>").join('¥n');
   text = text.replace(/&amp;/g,"&");
   text = text.replace(/&quot;/g,"/");
   text = text.replace(/&#039;/g,"'");
   text = text.replace(/&lt;/g,"<");
   text = text.replace(/&gt;/g,">");
   //hidedText = $(this).hide();

   var focusedText = $('<textarea></textarea>');
   focusedText.appendTo( $(this.el) )
            .focus()
            .select()
            .val(text)
            .blur(function() {
                        text = $(this).val().split('¥n').join("<br>");
                        //text = $(this).val();
                        var st = $(this).parent();
                        //hidedText.show();
                        $(".text",st)
                            .text(text);
                        //hidedText
                        //    .height($(this).height())
                        //    .width($(this).width());
                        $(this).remove();
                })
                .height(
                        $(this.el).height()
                )
                .width(
                        $(this.el).width()
                );
   },
   pickupPicture: function(){
   		
   },
   
});

PictureView = Backbone.View.extend({
   className : "picture",
   initialize: function(){
       _.bindAll(this, "render","remove","pickupPicture");
       model = this.model;
       this.model.bind("change", this.render);
       this.render();
       
   },
   render: function(){

       $(this.el).append('<img class="picture_content" ></img>');

	   $(this.el).css({
                top: this.model.top,
                left: this.model.left,
	            position: 'absolute'
            }).width(this.model.width).height(this.model.height);
	   //$(this.el).append('<img></img>');

       $(this.el).find('.picture_content').attr({src: this.model.src}). width(this.model.width).height(this.model.height);

       $(this.el).draggable({
        	containment: "parent"
       });
       $(this.el).find('img').resizable({
        	containment: "parent parent"
       });

       return this;
   },

   remove: function(){
   		$(this.el).remove();
   		//?
   		this.model.remove();
   },
   pickupPicture: function(){
   		
   },
   
});
