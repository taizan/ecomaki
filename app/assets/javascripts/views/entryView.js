
EntryView = ecomakiView.extend({

  className : 'entry',
  tmplId: "#entry_template",
  itemList: [],
	
  onInit: function(args){
    this.itemNum = 1;
    
    _.bindAll(this,
        "addItemView",
        "addBalloonView",
        "addCharacterView",
        "onClick",
        "canvasRender",
        "onCanvasClick",
        "keyctrl",
        "onDraw",
        "applySize",
        "onResize",
        "addBalloon",
        "addCharacter",
        //"addNewtBalloon",
        //"addNewCharacter",
        "addDefaultBalloon",
        "addDefaultCharacter",
        "destroyEntry",
        "addEntry",
        "changeLayer"
      );

    this.model.balloons.bind('add', this.addBalloonView); 
    this.model.characters.bind('add', this.addCharacterView); 

    this.model.bind('sync', this.render); 
  },

  onRemove: function(){
    this.model.balloons.unbind('add', this.addBalloonView); 
    this.model.characters.unbind('add', this.addCharacterView); 
  },

  applySize: function(){
    // init height width
    this.model_width = this.model.get('width');
    this.model_height = this.model.get('height');
    var button_offset = 40;

    $('.entry_wrapper',this.el)
      .width( this.model_width + 2* button_offset )
      .height( this.model_height );
    $(this.content)
      .width( this.model_width )
      .height( this.model_height )
      .css({'left':'40px'});
    // to make center as content center add button_offset other hand 
    $(this.el)
    //  .width( this.content.width() + 2* button_offset )
      .height( this.content.height() );
    $('.hide_buttons',this.el).css( { left: this.content.width() + button_offset} );
  },

  onLoad: function(){
	  var self = this;
    //console.log('entry load');
    // entry content of view
    this.content = $(this.el).find('.entry_content');
		
    this.applySize();
    
    $('.item',this.el).remove();
    $('.itemEffectSelecters',this.el).empty();

    this.canvasFlag = true;
    this.isDrawDown = false;

  	if(this.isEditable){
    
      //--
      //set painting options

			this.content.wPaint({
        drawDown:  self.onCanvasClick ,
        drawUp : self.onDraw,
				EditMenuCallback: self.keyctrl
      });

      this.content.mouseleave(function(){
          //_self.canvasFlag= true;
          self.canvasRender();
        });
      //--

      this.content.resizable({
          stop: this.onResize,
          maxHeight: 480,
          minHeight: 120,
          maxWidth: 1024,
          minWidth: 240,
          grid: [40,40],
          autoHide: true,
        });


    }else{
      var canvasUrl = this.model.get('canvas');
      //check data exist
      if(canvasUrl !== null && canvasUrl !== undefined && canvasUrl != ""){
        this.canvasImage  = new Image();
        this.canvasImage.src = canvasUrl;
        $(this.canvasImage)
          .addClass('paint').appendTo(this.content).width( this.model_width ).height( this.model_height );
      }
    }

    // should be initialize after content resizable because conflict autoHide
    _(this.model.balloons.models).each( function(model){ self.addBalloonView( model , {} , {} ); } );

    _(this.model.characters.models).each( function(model){ self.addCharacterView( model , {} , {} ); } );

    this.effecter = new Effecter($('.paint',this.el),this.model,'option','canvas_'+this.model.get('id'));
    
    this.hideButton();
    this.render();
  },

  render: function(){
    if(this.isLoaded){
      //console.log('render');

      // init height width
      this.applySize();
    
      this.canvasRender();
     
      this.effecter.resetEffect();
    
      this.defaultIconRender();
    }

    return this;
  },

  defaultIconRender: function() {
    // hie add default item button
    if( this.model.balloons.models.length > 0 ) $('.add_default_balloon_icon',this.el).hide();
    else $('.add_default_balloon_icon',this.el).show();
    
    if( this.model.characters.models.length > 0 ) $('.add_default_character_icon',this.el).hide();
    else  $('.add_default_character_icon',this.el).show();

  },

  canvasRender: function() {
      var content = this.content;
      var canvasUrl = this.model.get('canvas');
     // set image to canvas
      if(this.isEditable){
        // if isEditable , set image data to canvas
        if(this.canvasFlag){
          this.canvasFlag = false;
          //handle no data exception
          if(canvasUrl !== null && canvasUrl !== undefined && canvasUrl != ""){
            this.content.data('_wPaint_canvas').setImage( canvasUrl );
            $('.paint',this.content).css( { zIndex:this.model.get('canvas_index') } );

            if( this.model.get('canvas_index') == this.maxIndex ) {
              $('.btn_layer',this.el).addClass('btn-primary');
            }
          }
        }
      }else{
        // if not isEditable , set image to img tag
        if(canvasUrl !== null && canvasUrl !== undefined && canvasUrl != ""){
          this.canvasImage.src = canvasUrl; 
          $(this.canvasImage).css( { position: 'relative', zIndex:this.model.get('canvas_index') } );
        }
      }
  },

  addBalloonView: function( model , t , options ){
    this.addItemView( BalloonView , model , t , options );
  }, 

  addCharacterView: function( model , t , options ){
    this.addItemView( CharacterView , model , t , options );
  },

  addItemView: function( viewClass , model , t , options ){
     // console.log('load entry item');

     this.maxIndex = this.model.get('canvas_index') != null  ? this.model.get('canvas_index') : 0;

     var itemView = new viewClass( { model:model , parentView: this , isEditable: this.isEditable });
     itemView.appendTo( this.content);
     this.itemNum ++;
     this.itemList.push(itemView);
     this.maxIndex = ( model.get('z_index') > this.maxIndex ) ?   model.get('z_index') : this.maxIndex;
  },

  
  events: {
    "click" : "onClick" ,
    "dblclick" : "dblclick",
    "click .btn_balloon": "addNewBalloon",
    "click .btn_character": "addNewCharacter",
    "click .btn_remove": "destroyEntry",
    "click .btn_entry": "copyEntry",
    "click .btn_layer": "changeLayer",

    "click .add_default_balloon_icon": "addDefaultBalloon",
    "click .add_default_character_icon": "addDefaultCharacter",
    "click .new_entry_handle": "addEntry"
  },
  
  onDisplay: function(){
    // do something when entry displayed
    //console.log('disp entry');
    for(var i = 0; i < this.itemList.length; i++){
      this.itemList[i].onDisplay();
    }
    this.effecter.runSelectedEffect();
    return this;
  },

  onPreDisplay: function(){
    // do something when entry displayed
    //console.log('pre disp entry');
    for(var i = 0; i < this.itemList.length; i++){
      this.itemList[i].onPreDisplay();
    }
    this.effecter.resetEffect();
    return this;
  },

  onClick: function(ev){
    //console.log("click entry");
    //console.log(ev.target);
    texts = $('.text',this.el);
    for( i = 0 ; i < texts.length; i++ ) {
      if( texts[i] != ev.target) 
        $(texts[i]).blur();
    }
  },

  dblclick: function(ev){
    // re edit of text does not works i don know why
    //console.log("dblclick entry " + ev.target);
    //if( $(ev.target).hasClass('sticky') == false ){$('textarea').blur();}
  },

  onCanvasClick: function(){
    //this.onViewClick({target: 'canvas'});
    this.isDrawDown = true;
    this.effecter.changeSelecter();
    
    //this.onViewClick({target: 'canvas'})
    
    // trigger blur event
    $('#static_body').mousedown();
    $('.text',this.el).blur();
  },

  keyctrl: function(event){
    var self = this;
	  	switch(event){
		  	case "undo":
		  		console.log( "Ctrl-Z is Pressed on", self);
					break;

				case "redo":
					console.log( "Shift-Ctrl-Z is Pressed on", self);
					break;

				default:
					console.log("keyctrl:", event, "|", self);
          if( $('.paint', self.el)[0] )
            self.model.save({canvas: $('.paint', self.el)[0].toDataURL('image/png')},{wait: true});
					break;
			}
	},

  onDraw: function(){
     //this.model.save({canvas: $('.paint', this.el)[0].toDataURL('image/png')},{wait: true});
  },

  onResize: function(){
    //console.log(this.content.height());
    //console.log(this.content.width());
    this.model.save({ 'height':this.content.height() ,'width':this.content.width()});
    
    //for reflush canvas size
    $('canvas',this.content).remove();
    var self = this;
    this.content.wPaint({
        drawDown:  self.onCanvasClick ,
        drawUp: self.onDraw,
				EditMenuCallback: self.keyctrl
      });
    this.canvasFlag = true;
    //re render view
    this.parentView.render();
    this.render();

    ///this.model.save();
  },

  addBalloon: function( str , w , h , l , t ){
    //console.log("addBalloon");
    if(typeof str === 'undefined') str = 'クリックして編集';
    if(typeof w === 'undefined') w = 100;
    if(typeof h === 'undefined') h = 50;
    if(typeof l === 'undefined') l = Math.random() * (this.model.get('width') - w); 
    if(typeof t === 'undefined') t = Math.random() * (this.model.get('height') - h);

    this.model.balloons.create(
      {
        left: l,top: t, width: w, height: h ,
        z_index: this.maxIndex+1,
        content: str,
        border: ''
      });
    this.maxIndex++;

    //temp
    this.model.save();

    $('.btn_layer',this.el).removeClass('btn-primary');
  },

  addCharacter: function( id , w , h , l , t){
    //console.log("addCharacter");
    //var image = new ImageItem( this._self , src ,{});
    //image.appendTo( this.content);
    if(typeof id === 'undefined') id = 0;
    if(typeof w === 'undefined') w = 100;
    if(typeof h === 'undefined') h = 100;
    if(typeof l === 'undefined') l = Math.random() * (this.model.get('width') - w); 
    if(typeof t === 'undefined') t = Math.random() * (this.model.get('height') - h);


    this.model.characters.create(
      {
        left: l,top: t, width: w, height: h,
        z_index: this.maxIndex+1,
        character_image_id: id
      });
    this.maxIndex++;
    this.model.save();

    $('.btn_layer',this.el).removeClass('btn-primary');

  },

  addNewBalloon: function(){
    this.addBalloon();
  },

  addNewCharacter: function(){
    this.addCharacter();
  },

  addDefaultBalloon: function(e){
    var $icon = $('.add_default_balloon_icon');
    console.log($icon.offset(),$(this.el).offset());
    this.addBalloon('' , $icon.width(),$icon.height(),
      -$icon.offset().left + $(this.content).offset().left ,
      - $icon.offset().top + $(this.content).offset().top  
      );
  },

  addDefaultCharacter: function(e){
    var $icon = $('.add_default_character_icon');
    this.addCharacter(0 , $icon.width(),$icon.height(),
      - $icon.offset().left + $(this.content).offset().left ,
      - $icon.offset().top + $(this.content).offset().top  
      );

  },

  destroyEntry: function(e){
    //console.log("remove");
    this.destroy_view();

    this.parentView.model.destroy_entry(this.model);
    this.parentView.model.fetch();

  },

  copyEntry: function(e){
    // console.log("addEntry");
    var chapter = this.parentView.model;
    var currentIndex =  chapter.entries.indexOf(this.model);
    
    this.model.save();

    var attributes = this.model.dup();

    this.parentView.addEntryWithOrder(attributes , currentIndex);
  },

  addEntry: function(e){
    // console.log("addEntry");
    var chapter = this.parentView.model;
    var currentIndex =  chapter.entries.indexOf(this.model);
   
    var attributes ={"canvas_index":1,"height":320,"width":480}  

    this.parentView.addEntryWithOrder(attributes , currentIndex);
  },

  changeLayer: function(e){
    //console.log("changeLayer");
    var canvas = $('canvas',this.el);
    //var index = 5;

    $('.btn_layer',this.el).toggleClass('btn-primary');
    if( $('.btn_layer',this.el).hasClass('btn-primary')){
      canvas.zIndex( this.maxIndex + 1 ); 
      this.maxIndex ++;
      this.model.set('canvas_index',canvas.zIndex());
      this.model.save();
    }
    else{ 
      canvas.zIndex(0);
      this.model.set('canvas_index',canvas.zIndex());
      this.model.save();
    }
     // console.log(canvas);
  }
});
