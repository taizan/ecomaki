// change deletemeter from <%= %> to {{ }}
$(function(){
  _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g,
      evaluate : /\{%(.+?)%\}/g,
  };
});

EntryView = Backbone.View.extend({

  className : 'entry',
  isDisplayed: false,

  initialize: function(args){
    var _self = this;

    this.itemNum = 1;
    this.parentView = args.parentView;
    this.isEditable = args.isEditable;

    //console.log(args);
    //console.log(args.parentView);
    _.bindAll(this, "render");
    _.bindAll(this,
        'click',
        'onScroll',
        'displayed',
        'onLoad',
        'addBaloon',
        'addPicture',
        'addDefaultBaloon',
        'addDefaultPicture',
        'remove',
        'addEntry',
        'changeLayer',
        'hideButton');

    this.model.bind("change", this.render);

    var template = _.template( $("#entry_template").html(),this.model.attributes);
    $(this.el).html(template);

    // entry content of view
    this.content = $(this.el).find('.entry-content');
    //console.log(this.content);
    
    $(window).scroll(this.onScroll);

  },

  onLoad: function(){
    var _self = this;

    // init height width
    var model_width = this.model.get('width');
    var model_height = this.model.get('height');
    var button_offset = 40;

    this.content.width( model_width ).height( model_height );
    $(this.el).width( this.content.width() + button_offset ).height( this.content.height() );
    $('.buttons',this.el).css( { left: this.content.width() } );

    this.canvasFlag = true;
    this.isDrawDown = false;
    if(this.isEditable){
      this.content.wPaint({
          image: this.model.get('canvas') , 
          drawDown: function(){ _self.isDrawDown = true; } 
        });
      $('.paint',this.content).zIndex(this.model.get('canvas_index'));
      console.log(this.model.get('canvas_index'));
      console.log($('.paint',this.content));
      this.content.mouseleave(function(){ 
          if(_self.isDrawDown){
            _self.isDrawDown = false;
            _self.canvasFlag = false;
            _self.model.save({canvas: $('.paint', _self.el)[0].toDataURL('image/png')},{wait: true});
            // do not reflesh canvas at mouse leave
            console.log('save');
          } 
        });
    }else{
      this.canvasImage = new Image();
      this.canvasImage.src = this.model.get('canvas');
      $(this.canvasImage).appendTo(this.content).width( model_width ).height( model_height );
    }
    
    return this.render();
  },

  render: function(){

    var _self = this;
    var content = this.content;

     //console.log('render');

    // init height width
    var model_width = this.model.get('width');
    var model_height = this.model.get('height');
    var button_offset = 40;

    this.content.width( model_width ).height( model_height );
    $(this.el).width( this.content.width() + button_offset ).height( this.content.height() );
    $('.buttons',this.el).css( { left: this.content.width() } );

    $('.item',this.el).remove();

    // set image to canvas
    if(this.isEditable){
      if(this.canvasFlag){
        this.content.data('_wPaint_canvas').setImage( this.model.get('canvas') );
        $('.paint',this.content).css( { zIndex:this.model.get('canvas_index') } );
        console.log('reflesh canvas');
      }else{
        this.canvasFlag = true;
      }
    }else{
      this.canvasImage.src = this.model.get('canvas'); 
      $(this.canvasImage).css( { zIndex:this.model.get('canvas_index') } );
    }

    this.itemNum = 1;
    this.maxIndex = this.model.get('canvas_index') != null ? this.model.get('canvas_index') : 0;
    

    _(this.model.balloons.models).each(
      function(item){
        //console.log(item);
        var baloon = new BaloonItem(item , _self ,_self.isEditable);
        baloon.appendTo( content);
        this.itemNum ++;
        this.maxIndex = item.get('z_index') > this.maxIndex ? item.get('z_index') : this.maxIndex;
      }
    );

    _(this.model.characters.models).each(
      function(item){
        //console.log(item);
        var image = new ImageItem(item ,  _self  ,_self.isEditable);
        image.appendTo( content);
        this.itemNum ++;
        this.maxIndex = item.get('z_index') > this.maxIndex ? item.get('z_index') : this.maxIndex;
      }
    );

    
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
  
  displayed: function(){
    // do something when entry displayed
    console.log('disp entry');
    return this;
  },

  onScroll: function(){ 
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    //console.log(this.isDisplayed);
    if( $(this.el).offset().top < scroll
        && scroll < $(this.el).offset().top + $(this.el).height() )
    {
      if(this.isDisplayed == false){
        this.isDisplayed = true;
        this.displayed();
      }
    } else if(this.isDisplayed) {
      this.isDisplayed = false;
    }
    return this;
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
    var button = '.buttons';
    var _self = this;
    $(this.el)
      .mouseover(function(){
        if(_self.isEditable){
          $(this).find(button).show();
        }
      })
      .mouseout(function(){
        $(this).find(button).hide();
      })
      .find(button).hide();
    return this;
  },

  addBaloon: function( str ){
    console.log("addBaloon");
    this.model.balloons.create(
      {
        left: 0,top: 0, width: 100, height: 50 ,
        content: str,
        border: ''
      });

    //temp
    this.model.save();
    this.model.trigger('change');

    //var baloon =  new BaloonItem( this._self , str , { width: 100,height: 50 } );
    //baloon.appendTo( this.content );
  },

  addPicture: function( id ){
    console.log("addPicture");
    //var image = new ImageItem( this._self , src ,{});
    //image.appendTo( this.content);
    this.model.characters.create(
      {
        left: 0,top: 0, width: 100, height: 100,
        character_id: Config.prototype.character_idtourl(id)
      });
    this.model.save();
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
    $(this.el).remove();
    this.parentView.model.destroy_entry(this.model);
    this.parentView.model.fetch();
  },

  addEntry: function(e){
    console.log("addEntry");
    console.log(this);
    //this.model.
    this.parentView.model.create_entry(
      {
        height: 200,
        width: 500,
        canvas_index: 0,
      }
    );
  },

  changeLayer: function(e){
    console.log("changeLayer");
    var canvas = $('canvas',this.el);
    //var index = 5;

    $('.--btn-layer',this.el).toggleClass('btn-primary');
    if( $('.--btn-layer',this.el).hasClass('btn-primary')){
      canvas.zIndex( this.maxIndex + 1 ); 
      this.maxIndex ++;
      this.model.set('canvas_index',this.maxIndex);
      this.model.save();
    }
    else{ 
      canvas.zIndex(0);
      this.model.save();
    }
      console.log(canvas);
    //$('#sketchTool').show();
    //this.sketch.setImg();
  }
});
