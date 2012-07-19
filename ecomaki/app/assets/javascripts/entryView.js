
EntryListView = Backbone.View.extend({
    el : $('#entryList'),
	initialize: function(){
	    _.bindAll(this, "render");
	    this.collection.bind("change", this.render);
	    this.counter =0;
	    this.render();
	},
	
	render:function(){
	   	var self = this;
	    _(this.collection.models).each(function(entry){ // in case collection is not empty
        	self.appendItem(entry);
    		self.counter++;    
      }, this);
    },
    appendEntry: function(entry){
      var entryView = new EntryView({
        model: entry
      });
      $( this.el).append(entryViewView.render().el);
    },
	addEntry: function(){
    	this.counter++;
    	var entry = new Entry();
		//init default entry
    	entry.set({
        	//part2: item.get('part2') + this.counter // modify item defaults
      	});
      	this.collection.add(entry);
    },
});
  

EntryView = Backbone.View.extend({
   initialize: function(){
       _.bindAll(this, "render");
       _.bindAll(this,'addBaloon','addImage','remove','addEntry','changeLayer');
       this.model.bind("change", this.render);
       this.render();
   },
   render: function(){
      var template = _.template( $("#entry_template").html(),this.model.attributes);
      this.el.html(template);
      
      var self = this;
	    _(this.model.itemList.models).each(function(item){ // in case collection is not empty
        	self.appendItem(item);    
      }, this);
      return this;
   },
   events: {
       "click --btn-baloon": "addBaloon",
       "click --btn-picture": "addPicture",
       "click --btn-remove": "remove",
       "click --btn-entry": "addEntry",
       "click --btn-layer": "changeLayer"
   },
   addItem: function(){
      var item = new Item();
      item.set({
        //part2: item.get('part2') + this.counter // modify item defaults
      });
      this.model.itemList.add(item);
    },
    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      });
      $( this.el ).find('.entry-content').append(itemView.render().el);
    },
    
    //event callback
   addBaloon: function(e){
            var template = _.template( $("#baloon_template").html(),{});
	    //this.model.set({body: this.model.get('body') + template );
	    
	},
   addPicture: function(e){
	},
   remove: function(e){
            
	},
   addEntry: function(e){
	},
   changeLayer: function(e){
	}
});

ItemView = Backbone.View.extend({
   initialize: function(){
       _.bindAll(this, "render");
       this.model.bind("change", this.render);
       this.render();
   },
   
   initBaloon() : function(){
   		$(this.el).find('.draggable').draggable({
        	containment: "parent"
       	});
       	$(this.el).find('.resizable').resizable({
        	containment: "parent"
       	});
   },
   
   initPicture(): function(){
   		$(this.el).find('.draggable').draggable({
        	containment: "parent"
       	});
       	$(this.el).find('.resizable').resizable({
        	containment: "parent parent"
       	});
   },
   render: function(){
      if(this.model.type == 'baloon'){
      		var template = _.template( $("#baloon_template").html(),this.model.attributes);
      }else if(this.model.type == 'picture'){
      		var template = _.template( $("#picture_template").html(),this.model.attributes);
      }
      
      this.el.html(template);
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
        var focusedText.appendTo( $(this.el) )
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

/*
<script type="text/template" id="entry_template">
    <div class="entry">
    	<div class="entry-content">
           <canvas width= "800" height="300" ></canvas>
           <%= body %>
        </div>
        <div class+"buttons">
            <li><i class="icon-move"></li>
	    <li><button class="btn --btn-remove"><i class="icon-remove-sign"></button></li>
	    <li><button class="btn --btn-baloon"><i class="icon-comment"></button></li>
	    <li><button class="btn --btn-picture"><i class="icon-picture"></button></li>
	    <li><button class="btn --btn-layer"><i class="icon-edit"></button></li>
	    <li><button class="btn --btn-entry"><i class="icon-arrow-down"></button></li>
	</div>
    </div>
</script>
<script type="text/template" id="baloon_template">
    
    <div class="--baloon draggable resizable">
    		<p class="--baloon-text"><%= str %> </p>
    </div>
    
</script>

<script type="text/template" id="picture_template">
    
    <div class="--picture draggable">
    	<img class="--picture-img resizable" ></img>
    </div>
    
</script>
*/



