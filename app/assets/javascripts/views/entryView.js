
EntryView = ecomakiView.extend({

  className : 'entry',
  tmplId: "#entry_template",
	
  onInit: function(args){
    this.itemNum = 0;
    this.itemList = [],
    
    _.bindAll(this,
        "addItemView",
        "addBalloonView",
        "addCharacterView",
        "onSelect",
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
        "addEntryFromTemplate",
        "changeLayer",
        "getCanvasUrl",
        "selectBackground",
        "setBackground"
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
    var button_offset = 20;

    $('.entry_wrapper',this.el)
      .width( this.model_width )
      .height( this.model_height )
      .css({'margin-left': -this.model_width/2 + 'px' , 'left':'50%'});

    $(this.content)
      .width( this.model_width )
      .height( this.model_height );

    if(this.editable) {
      $(this.content).css({'left': button_offset+'px'});
      $('.entry_wrapper',this.el).width( this.model_width + 2* button_offset );
    }

    //if( $(this.parentView.parentView.el).width )

    // to make center as content center add button_offset other hand 
    $(this.el)
    //  .width( this.content.width() + 2* button_offset )
      .height( this.content.height() );
    $('.hide_buttons',this.el).css( { left: this.content.width() } );
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

			//$(".character_wrapper" ,this.content ).wPaint({
			$(this.content ).wPaint({
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
          maxWidth: 620,
          minWidth: 240,
          grid: [20,20],
          autoHide: true,
        });


    }else{
      var canvasUrl = this.getCanvasUrl();  //this.model.get('canvas');
      //check data exist
      if(canvasUrl !== null && canvasUrl !== undefined && canvasUrl != ""){
        this.canvasImage  = new Image();
        this.canvasImage.src = canvasUrl;
        $(this.canvasImage)
          .addClass('paint').appendTo( $(".character_wrapper" ,this.content ));
          //.width( this.model_width ).height( this.model_height );
      }
    }

    // should be initialize after content resizable because conflict autoHide
    _(this.model.balloons.models).each( function(model){ self.addBalloonView( model , {} , {} ); } );

    _(this.model.characters.models).each( function(model){ self.addCharacterView( model , {} , {} ); } );

    //console.log(this.itemNum);
    //console.log(this.itemList);
    // should be afeter adding views
    if( this.isEditable  && ( this.model.isNewEntry || this.itemNum == 0 ) ) {
       this.addDefaultBalloon();
       this.addDefaultCharacter();
    }

    $('.entry_content', this.el).css(
        'background-image',
        "url(" + this.getBackgroundSrc() + ")"
      );

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
     
    }
    return this;
  },

  canvasRender: function() {
      var content = this.content;
      var canvasUrl = this.getCanvasUrl();
     // set image to canvas
      if(this.isEditable){
        // if isEditable , set image data to canvas
        if(this.canvasFlag){
          this.canvasFlag = false;
          //handle no data exception
          if(canvasUrl !== null && canvasUrl !== undefined && canvasUrl != ""){
            //$(".character_wrapper" ,this.content ).data('_wPaint_canvas').setImage( canvasUrl );
            $(this.content ).data('_wPaint_canvas').setImage( canvasUrl );
            $('.paint',this.content).css( { zIndex:this.model.get('canvas_index') } );

            //一番上のレイヤーにあるときは描画モード
            if( this.model.get('canvas_index') == this.maxIndex ) {
              $('.btn_layer',this.el).addClass('btn-primary');
              $('canvas',this.el).addClass('enable');
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

  addBalloonView: function( model , target , options ){
    this.addItemView( BalloonView , model , this.content , options );
  }, 

  addCharacterView: function( model , target , options ){
    var view = this.addItemView( CharacterView , model , $(".character_wrapper", this.content)  , options );
  },

  addItemView: function( viewClass , model , target , options ){
     // console.log('load entry item');

    this.maxIndex = this.model.get('canvas_index') != null  ? this.model.get('canvas_index') : 0;

    var itemView = new viewClass( { model:model , parentView: this , isEditable: this.isEditable });

    itemView.appendTo( target );

    this.itemNum ++;
    this.itemList.push(itemView);
    this.childViews.push(itemView);
    this.maxIndex = ( model.get('z_index') > this.maxIndex ) ?   model.get('z_index') : this.maxIndex;

    return itemView;
  },

  
  events: {
    "click" : "onClick" ,
    "dblclick" : "dblclick",
    "click .btn_balloon": "addNewBalloon",
    "click .btn_character": "addNewCharacter",
    "click .btn_remove": "destroyEntry",
    "click .btn_entry": "copyEntry",
    "click .btn_layer": "changeLayer",

    "click .btn_background": "selectBackground",

    "click .add_default_balloon_icon": "addDefaultBalloon",
    "click .add_default_character_icon": "addDefaultCharacter",
    //"click .new_entry_handle": "addEntry",
    "click .new_entry_handle": "addEntryFromTemplate",

    "mouseover" : "onSelect"
  },
  
  onSelect: function(){
    EntryView.prototype.selected = this;
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
    //$('.target').hide();
    $('.target_on').removeClass('target_on').addClass('target_off');
    $(this.content).removeClass('target_off').addClass('target_on');
    this.effecter.changeSelecter();
    
    //this.onViewClick({target: 'canvas'})
    
    // trigger blur event
    $('#static_body').mousedown();
    $('.text').blur();
  },

  keyctrl: function(event){
    var self = this;
    var save_image = function(){ 
      self.model.set({canvas: $('.paint', self.el)[0].toDataURL('image/png')});
      self.model.save_canvas( $('.paint', self.el)[0].toDataURL('image/png') );
    }; 
	  	switch(event){
		  	case "undo":
          save_image();
					break;
				case "redo":
          save_image();
					break;
				case "paste":
          save_image();
					break;
				case "cut":
          save_image();
					break;

				default:
					//console.log("keyctrl:", event, "|", self);
          //if( $('.paint', self.el)[0] )
					break;
			}
	},

  onDraw: function(){
     this.model.set({canvas: $('.paint', self.el)[0].toDataURL('image/png')});
     this.model.save_canvas( $('.paint', this.el)[0].toDataURL('image/png') );
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
    //if(typeof str === 'undefined') str = BalloonView.prototype.getDefaultBalloon();//"ダブルクリックして編集";
    if(typeof str === 'undefined') str = BalloonView.prototype.defaultText;
    if(typeof w === 'undefined') w = 170;
    if(typeof h === 'undefined') h = 70;
    if(typeof l === 'undefined') l = Math.random() * (this.model.get('width') - w); 
    if(typeof t === 'undefined') t = Math.random() * (this.model.get('height') - h);

    var newBalloon = this.model.balloons.create({
        left: l,top: t, width: w, height: h ,
        z_index: this.maxIndex+1,
        content: str,
        border: '',
        "font_size":16
      });

    this.maxIndex++;

    //exit paint mode
    if( $('.btn_layer',this.el).hasClass('btn-primary') ) 
      this.changeLayer();

    return newBalloon;
  },

  addCharacter: function( data ){
    //console.log("addCharacter");
    if(typeof data.character_image_id === 'undefined') 
      data.character_image_id = -1; // -1なら選択が開く
    if(typeof data.width === 'undefined') data.width = 100+Math.random()*100;
    if(typeof data.height === 'undefined') data.height = w;
    if(typeof data.left === 'undefined') data.left = Math.random() * (this.model.get('width') - data.width); 
    if(typeof data.top === 'undefined') data.top = this.model.get('height') - data.height;
    
    data.z_index = this.maxIndex+1;

    var newCharacter = this.model.characters.create(data);
    this.maxIndex++;
    this.model.save();

    if( $('.btn_layer',this.el).hasClass('btn-primary') )
        this.changeLayer();

    return newCharacter;
  },

  addNewBalloon: function(){
    this.addBalloon();
  },

  addNewCharacter: function(){
    self = this;
    Picker.prototype.showCharacterList( function(data){
      self.addCharacter( data );
      self.setCharacterId( data.character_id ); 
    }); 
    //this.addCharacter();
  },

  addDefaultBalloon: function(e){
    var self = this;
    var w = $(this.content).width() * 0.2 + 64;
    var h = $(this.content).height() * 0.2 + 16;
    var newBalloon = new EntryBalloon(
      {
        content: 'セリフの追加',
        left: $(this.content).width() * 0.7 - w/2,
        top: $(this.content).height() * 0.5 - h,
        width: w, height: h ,
        z_index: this.maxIndex+1,
        "font_size":16,
      });

    newBalloon.isDefaultItem = true;

    console.log("add def balloon");

    var newBalloonView = this.addItemView( BalloonView , newBalloon , this.content , {} );

    return newBalloon;
  },

  addDefaultCharacter: function(e){
    var self = this;

    var w = $(this.content).width() * 0.2 + 64;
    var h = w;

    var newCharacter = new EntryCharacter(
      {
        character_image_id: 0 ,
        left: $(this.content).width() * 0.3 - w/2,
        top: $(this.content).height() * 0.5 ,
        width: w, height: h,
        z_index: this.maxIndex+1,
      });

    newCharacter.isDefaultItem = true;
    //make view of default Item
    var newCharacterView = this.addItemView( CharacterView , newCharacter , $(".character_wrapper",this.content) , {} );
 
    return newCharacter;
  },

  destroyEntry: function(e){
    //console.log("remove");

    this.parentView.model.destroy_entry(this.model);
    //this.parentView.model.fetch();

  },

  copyEntry: function(e){
    // console.log("addEntry");
    this.model.save();
    var attributes = this.model.dup();
    this.model.collection.create_after(
        attributes ,
        this.model.get('order_number') ,
        this.onAddOption() );
    //newEntry.save();
  },

  addEntryFromTemplate: function(e){
    var type = (this.model.get('order_number'))%4;    

    console.log( this.model.get('order_number'));
    this.model.collection.create_entry_from_template( 
        type , this.model.get('order_number') , this.onAddOption() );

  },


  addEntry: function(e){
    console.log("addEntry", this.model.order_number);
    var attributes ={"canvas_index":1,"height":320,"width":480}  
    var newEntry = this.model.collection.create_after(
        attributes ,
        this.model.get('order_number') ,  
        this.onAddOption()
      );
  },

  changeLayer: function(){
    //console.log("changeLayer");
    var canvas = $('canvas',this.el);
    //var index = 5;

    $('.btn_layer',this.el).toggleClass('btn-primary');

    if( $('.btn_layer',this.el).hasClass('btn-primary')){
      canvas.zIndex( this.maxIndex + 1 ); 
      canvas.addClass("enable");
      this.maxIndex ++;
    }
    else{ 
      canvas.zIndex(0);
      canvas.removeClass("enable");
    }
    this.model.set('canvas_index',canvas.zIndex());
    this.model.save();
     // console.log(canvas);
  },

  getCanvasUrl : function(){
    var data = this.model.get("canvas");
    console.log ( data );
    if( !data ) return  "/entries/"+this.model.get("id")+"/canvas";
    return data;
  },

  selectBackground: function(ev){
    Picker.prototype.showBackgroundList(this.setBackground);
    // to stop  blur picker at on ecomakiView Click 
    // TEMP?
    ev.stopPropagation();
  },

  setBackground: function(data){
    console.log('change bg');
    this.model.set(data);
    this.model.save();
    
    $('.entry_content', this.el).css(
        'background-image',
        "url(" + this.getBackgroundSrc() + ")"
      );
  },


});
