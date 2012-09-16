// change deletemeter from <%= %> to {{ }}
$(function(){   _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };
   });


EntryView = Backbone.View.extend({

   className : 'entry',

   initialize: function(arg){
       this._self = this;
       this.parentView = arg.parentView;
        //console.log(arg);
       //console.log(arg.parentView);
       _.bindAll(this, "render");
       _.bindAll(this,'click','addBaloon','addPicture','addDefaultBaloon','addDefaultPicture','remove','addEntry','changeLayer','hideButton');
       this.model.bind("change", this.render);
       
      var template = _.template( $("#entry_template").html(),this.model.attributes);
      $(this.el).html( template);
      
      // entry content of view
      this.content = $(this.el).find('.entry-content');
      //console.log(this.content);

      //cavas initialize
       this.sketch = new OverlaySketch($('canvas',this.el));
       this.sketch.init();

       this.render();
   },

   render: function(){
     
     var content = this.content;
     var _self = this._self;

     console.log('render');
     console.log(arguments);
     
     $('.item',this.el).remove();
     
     _(this.model.item).each(
         function(item){
            console.log(item);
            if(item.type == 'baloon'){
                var baloon = new BaloonItem(item , _self );
                baloon.appendTo( content);
            }else if(item.type == 'image'){
                var image = new ImageItem(item ,  _self  );
                image.appendTo( content);
            }
         }
     );

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
      this.hideButton();
      return this;
   },

   events: {
       "click" : "click",
       "dblclick" : "dblclick",
       "click .--btn-baloon": "addDefaultBaloon",
       "click .--btn-picture": "addDefaultPicture",
       "click .--btn-remove": "remove",
       "click .--btn-entry": "addEntry",
       "click .--btn-layer": "changeLayer"
   },
   
   click: function(ev){
      //console.log("click entry");
      //console.log(ev.target);  
      if( $(ev.target).is('.sticky') == false && $(ev.target).is('textarea') == false){$('textarea').blur();}
   },

   dblclick: function(ev){
      // re edit of text does not works i don know why 
      //console.log("dblclick entry " + ev.target);
      //if( $(ev.target).hasClass('sticky') == false ){$('textarea').blur();}
   },

   hideButton: function(){
      $(this.el)
        .mouseover(function(){
            $(this).find('.buttons').show();
        })
        .mouseout(function(){
            $(this).find('.buttons').hide();
        })
        .find('.buttons').hide();
   }, 
   
   addBaloon: function( str ){
        console.log("addBaloon");
        this.model.addItem(
          {
             type: 'baloon',
             eft: 0,top: 0, width: 100, height: 50 ,
             text: str,
             border: ''
         });
        
       //temp
       this.model.trigger('change');

        //var baloon =  new BaloonItem( this._self , str , { width: 100,height: 50 } );
        //baloon.appendTo( this.content );
   },
    
   addPicture: function( src ){
        console.log("addPicture");
        //var image = new ImageItem( this._self , src ,{});
        //image.appendTo( this.content);
        this.model.addItem(
          {
             type: 'image',
             left: 0,top: 0, width: 100, height: 100 ,
             src: src,
         });
        this.model.trigger('change');

   },
    
    
   addDefaultBaloon: function(e){
        this.addBaloon('');
   },
   addDefaultPicture: function(e){
        this.addPicture('');
   },
   remove: function(e){
	console.log("remove");
        console.log(this);
        //$(this.el).remove();
        this.parentView.model.destroy_entry(this.model);
        this.parentView.model.fetch();
   },
   addEntry: function(e){
        console.log("addEntry");
        console.log(this);
   	//this.model.
   	this.parentView.model.create_entry();
   },
   changeLayer: function(e){
	console.log("changeLayer");
   	var canvas = $('canvas',this.el);
        var index = 5;

        $('.--btn-layer',this.el).toggleClass('btn-primary')
        
        if(canvas.zIndex() == index){ canvas.zIndex(0); }
        else{ canvas.zIndex(index); }
        console.log(canvas);
        $('#sketchTool').show();
   }
});


