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
	    alert();
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
      	this.this.model.entries.add(entry);
      	return this;
    },
    onKeyPress: function (e){
        alert();
    	if(e.which == 13){
    	    var entry = new Entry({ novel_id: this.model.entries.novel_id , id: counter });
		    this.addEntry(entry);   
            this.appendEntry(entry).addBaloon( $('#inputform').val() ),addDfaultBaloon();
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
       _.bindAll(this,'click','addItem','appendItem','addBaloon','addPicture','addDefaultBaloon','addDefaultPicture','remove','addEntry','changeLayer');
       this.model.bind("change", this.render);
       this.render();
   },
   render: function(){
      var template = _.template( $("#entry_template").html(),this.model.attributes);
      $(this.el).html( template);
      var self = this;
	    _(this.model.items.models).each(function(item){ // in case collection is not empty
        	self.appendItem(item);    
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
   addItem: function(item){
      this.model.items.add(item);
    },
    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      });
      $( this.el ).find('.entry-content').append(itemView.render().el);
    },
       
   addBaloon: function( string ){
       console.log("addBaloon");
       var item = new Item( 
            {
   				type: "baloon",
   				text: string,
   				width: 100,
   				height: 50,
   				top: 50,
   				left: 150
   			});
   		this.addItem( item );
   		this.appendItem( item );
    },
    
    addPicture: function( source ){
        console.log("addPicture");
        var item = new Item( 
        	{
   		    	src:source,
   				type: "picture",
   				width: 150,
   				height: 150,
   				top: 50,
   				left: 50
   			});
   		this.addItem( item );
   		this.appendItem( item );
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

ItemView = Backbone.View.extend({
   initialize: function(){
       _.bindAll(this, "render","remove","editText","pickupPicture","initBaloon","initPicture");
model = this.model;
       this.model.bind("change", this.render);
       this.render();
       
   },
   
   initBaloon: function(){
	//alert("initbaloon");
        elem = this.el;
   	$(this.el).find('.draggable').draggable({
        	containment: "parent parent"
       	});
       	$(this.el).find('.resizable').resizable({
        	containment: "parent parent"
       	});
   },
   
   initPicture: function(){
   		$(this.el).find('.draggable').draggable({
        	containment: "parent parent"
       	});
       	$(this.el).find('.resizable').resizable({
        	containment: "parent parent parent"
       	});
   },
   render: function(){
      if(this.model.type == 'baloon'){
      		var template = _.template( $("#baloon_template").html(),this.model.attributes);
      $(this.el).html(template);
	$(this.el).find('.baloon').css({
         top: this.model.top,
          left: this.model.left
           }).width(this.model.width).height(this.model.height);
          this.initBaloon();     
      }else if(this.model.type == 'picture'){
       	var template = _.template( $("#picture_template").html(),this.model.attributes);
         $(this.el).html(template);
	 $(this.el).find('img').css({
         top: this.model.top,
         left: this.model.left
        }).width(this.model.width).height(this.model.height);
        this.initiPicture(); 
      }
      

      return this;
   },
   events: {
       "dblclick --baloon-text": "editText",
       "dblclick --picture-img": "pickupPicture",
       "click --btn-remove": "remove",
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


