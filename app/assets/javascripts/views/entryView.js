
EntryView = ecomakiView.extend({

  className : 'entry',
  tmplId: "#entry_template",
  itemList: [],
	
  onInit: function(args){
    this.itemNum = 1;
    
    _.bindAll(this,
        "onClick",
        "onCanvasClick",
        "applySize",
        "onResize",
        "addBaloon",
        "addPicture",
        "addDefaultBaloon",
        "addDefaultPicture",
        "remove",
        "addEntry",
        "changeLayer"
      );
  },

  applySize: function(){
    // init height width
    this.model_width = this.model.get('width');
    this.model_height = this.model.get('height');
    var button_offset = 40;

    this.content.width( this.model_width ).height( this.model_height );
    $(this.el).width( this.content.width() + button_offset ).height( this.content.height() );
    $('.hide_buttons',this.el).css( { left: this.content.width() } );
  },

  onLoad: function(){
    console.log('entry load');
    var _self = this;
    // entry content of view
    this.content = $(this.el).find('.entry-content');
		
    this.applySize();
    
    $('.item',this.el).remove();
    $('.itemEffectSelecters',this.el).empty();

    this.canvasFlag = true;
    this.isDrawDown = false;
    if(this.isEditable){

      //--
      //set painting options
      this.content.wPaint({
          drawDown:  _self.onCanvasClick
        });

      this.content.mouseleave(function(){ 
          //console.log(_self.isDrawDown);
          if(_self.isDrawDown){
            _self.isDrawDown = false;
            _self.canvasFlag = true;
            _self.model.save({canvas: $('.paint', _self.el)[0].toDataURL('image/png')},{wait: true});
            // do not reflesh canvas at mouse leave
            console.log('save');
          } 
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
      this.canvasImage = new Image();
      $(this.canvasImage).addClass('paint');
      this.canvasImage.src = this.model.get('canvas');
      $(this.canvasImage).appendTo(this.content).width( this.model_width ).height( this.model_height );
    }
    this.effecter = new Effecter($('.paint',this.el),this.model,'option');
    
    return this.render();
  },

  render: function(){
    //if(this.isLoaded ==false && this.parentView.isLoaded){
     // console.log('load entry 2');
     // this.load(); 
    //}
    if(this.isLoaded){
      var _self = this;
      var content = this.content;
      //console.log('render');

      // init height width
      this.applySize();
    
      $('.item',this.el).remove();
      $('.itemEffectSelecters',this.el).empty();

      this.itemNum = 1;
      this.itemList = [];
      this.maxIndex = this.model.get('canvas_index') != null  ? this.model.get('canvas_index') : 0;
    
      var initItemView = function(item, itemClass) {
        //console.log(item);
        var itemView = new itemClass(item , _self ,_self.isEditable);
        itemView.appendTo( content);
        _self.itemNum ++;
        _self.itemList.push(itemView);
        _self.maxIndex = ( item.get('z_index') > _self.maxIndex ) ?   item.get('z_index') : _self.maxIndex;

      }

      _(this.model.balloons.models).each( function(item){ initItemView(item, BaloonItem); } );

      _(this.model.characters.models).each( function(item){ initItemView(item ,ImageItem ); } );

      // set image to canvas
      if(this.isEditable){
        if(this.canvasFlag){
          this.canvasFlag = false;

          this.content.data('_wPaint_canvas').setImage( this.model.get('canvas') );
          $('.paint',this.content).css( { zIndex:this.model.get('canvas_index') } );

          if( this.model.get('canvas_index') == this.maxIndex ) {
            $('.--btn-layer',this.el).addClass('btn-primary');
            //console.log('add btnprimary');
          }
        }
      }else{
        this.canvasImage.src = this.model.get('canvas'); 
        $(this.canvasImage).css( { position: 'relative', zIndex:this.model.get('canvas_index') } );
      }
      this.effecter.resetEffect();
    }

    return this;
  },

  events: {
    "click" : "onViewClick" ,
    "dblclick" : "dblclick",
    "click .--btn-baloon": "addDefaultBaloon",
    "click .--btn-picture": "addDefaultPicture",
    "click .--btn-remove": "remove",
    "click .--btn-entry": "addEntry",
    "click .--btn-layer": "changeLayer"
  },
  
  onDisplay: function(){
    // do something when entry displayed
    console.log('disp entry');
    for(var i = 0; i < this.itemList.length; i++){
      this.itemList[i].onDisplay();
    }
    this.effecter.runSelectedEffect();
    return this;
  },

  onPreDisplay: function(){
    // do something when entry displayed
    console.log('pre disp entry');
    for(var i = 0; i < this.itemList.length; i++){
      this.itemList[i].onPreDisplay();
    }
    this.effecter.resetEffect();
    return this;
  },

  onClick: function(ev){
    //console.log("click entry");
    //console.log(ev.target);
  },

  dblclick: function(ev){
    // re edit of text does not works i don know why
    //console.log("dblclick entry " + ev.target);
    //if( $(ev.target).hasClass('sticky') == false ){$('textarea').blur();}
  },

  onCanvasClick: function(){
    this.onViewClick({target: 'canvas'});
    this.isDrawDown = true;
    $('#toolbox .font_selecter').remove();
    this.effecter.changeSelecter();
  },


  onResize: function(){
    this.model.set('height',this.content.height());
    this.model.set('width',this.content.width());
    this.model.save();
    this.parentView.render();
  },

  addBaloon: function( str ){
    console.log("addBaloon");
    this.model.balloons.create(
      {
        left: 0,top: 0, width: 100, height: 50 ,
        z_index: this.maxIndex+1,
        content: str,
        border: ''
      });
    this.maxIndex++;

    //temp
    this.model.save();
    this.model.trigger('change');

    $('.--btn-layer',this.el).removeClass('btn-primary');
  },

  addPicture: function( id ){
    console.log("addPicture");
    //var image = new ImageItem( this._self , src ,{});
    //image.appendTo( this.content);
    this.model.characters.create(
      {
        left: 0,top: 0, width: 100, height: 100,
        z_index: this.maxIndex+1,
        character_image_id: id
      });
    this.maxIndex++;
    this.model.save();
    this.model.trigger('change');

    $('.--btn-layer',this.el).removeClass('btn-primary');

  },


  addDefaultBaloon: function(e){
    this.addBaloon('dbl click here');
  },

  addDefaultPicture: function(e){
    this.addPicture(1);
  },

  remove: function(e){
    console.log("remove");
    console.log(this);
    $(this.el).remove();
    this.parentView.model.destroy_entry(this.model);
    this.parentView.model.fetch();
  },

  addEntry: function(e){
    console.log("addEntry");
    //console.log(this);
    //this.model.
    var chapter = this.parentView.model;
    var currentIndex =  chapter.entries.indexOf(this.model);
    console.log( currentIndex);
    
    var newEntry = chapter.create_entry(
      {
        height: 320,
        width: 640,
        canvas_index: 1
      }
    );
    chapter.entries.create_after(newEntry, currentIndex);
    console.log( chapter.entries.indexOf(newEntry));
    //chapter.entries.save();
    
    //chapter.entries.move_at(newEntry, currentIndex+1);
    //chapter.trigger('change');
    //console.log("-addEntry");
  },

  changeLayer: function(e){
    console.log("changeLayer");
    var canvas = $('canvas',this.el);
    //var index = 5;

    $('.--btn-layer',this.el).toggleClass('btn-primary');
    if( $('.--btn-layer',this.el).hasClass('btn-primary')){
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
      console.log(canvas);
    //$('#sketchTool').show();
    //this.sketch.setImg();
  }
});
