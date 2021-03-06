//position obj is there some nomal one?

//=require jquery.ui.rotatable

_BalloonView = Backbone.View.extend ({

  //className : "balloon",

  initialize: function(args){
    this.parentView = args.parentView;
    this.isEditable = args.isEditable;
    this.content = this.parentView.content;
  
    _.bindAll(this,
      "render",
      "onEdit",
      "appendTo",
          //"onClick",
      //"onSelect",
      //"onResize",
      //"onDragStart",
      //"onDragStop",
      //"onRender",
      "onDisplay",
      "onPreDisplay"
      //"onDefaultItemClick"
      //"destroyView"
      );
  },
  
  onEdit: function(data){
    //console.log(data);
    //console.log(this.model);
    this.model.set(data);
    this.model.save();
    //console.log(this.model.isDefaultItem);
    //this.model.save();
  },
  
  render: function(){
    //$(this.el).editable("render",{data:this.model.attributes , isEditable:this.isEditable})
    $(this.el).editable("render",{data:this.model.attributes , isEditable:this.isEditable})
    
  },
  
  appendTo: function(target){
      var self = this;
      if( this.model.isDefaultItem ) return;
      $(this.el).appendTo(target);
    
      $(this.el).editable({
        onEdit: this.onEdit,
        onRemove:  function(){ self.model.destroy(); },
        data:this.model,
        className:"balloon"
      });

      //initialize effecter object
      this.effecter = new Effecter(this.el,this.model,'option', "balloon"+ this.model.get('id') );
      console.log(this.effecter);
      this.model.bind('change:option', this.effecter.resetEffect );

      this.onAppend();
      this.render();
    },
  
  onDisplay: function(){
      console.log(this);
      this.effecter.runSelectedEffect();
    },

  onPreDisplay: function(){
    this.effecter.resetEffect(); 
  },
  
  onSelect: function(){
      this.effecter.changeSelecter();
  },
  
  onAppend: function(){},
});


EntryItemView = Backbone.View.extend ({

  initialize: function(args){
     
    this.parentView = args.parentView;
    this.isEditable = args.isEditable;
    this.content = this.parentView.content;
     
     _.bindAll(this,
        "render",
        "onSync",
        "onClick",
        "onSelect",
        "onResize",
        "onResizeBase",
        "onRotate",
        "onDragStart",
        "onDragStop",
        "onDrag",
        "onRender",
				"onDisplay",
				"onPreDisplay",
				"onDefaultItemClick",
        "isIn",
        "destroyView"
      );
   
    this.model.bind('destroy', this.destroyView, this);

    this.defaultInitialize.apply(this,arguments);

    this.onInit.apply(this,arguments);
  },

  onSync: function(){
    //console.log('onsync');
  },


  defaultInitialize: function(){
    //this.el = this.tmpl;
    var z = this.model.get('z_index') != null ? this.model.get('z_index') : 0;  

    var rotation = this.model.get('rotation');
    rotation = (rotation == null)? 0 : rotation;
    $(this.el).rotate( rotation );
    
    $(this.el)
      .css({ top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
     
  },

  render: function(){
    //console.log('render');
    //console.log(this);
    
    this.defaultInitialize();
    
    this.onRender();
  },
 

  // DOM　に追加された時に呼ばれる
  appendTo: function(target){
    var self = this;
    $(this.el).appendTo(target);

    //initialize effecter object
    this.effecter = new Effecter(this.el,this.model,'option',this.className + this.model.get('id') );
    this.model.bind('change:option', this.effecter.resetEffect )

    //initialize draggable 
    //resizable is initialized at each item onAppend
    if(this.isEditable){ 

      var angle = this.model.get('rotation');
      if( !angle ) angle = 0;
      $(this.el).rotatable({
          angle:angle/180*Math.PI,
          stop: this.onRotate,
          handle: $('<i class="icon_rotate icon-repeat item_button" title="ドラッグして回転"/>')
          //rotateIconClass:  "icon-repeat item_button",
      });
      $(this.el)
        .click(this.onClick)
        .draggable({
          drag: self.onDrag,
          start: self.onDragStart,
          stop: self.onDragStop
      });        
        //start: this.onDragStart, stop: this.onDragStop });
    }

    this.onAppend();

    // default item func
    if(this.model.isDefaultItem){
      var defaultItemClick = function(){
          self.parentView.model.isNewEntry = false;
          $(self.el).removeClass('default_item');
          self.onDefaultItemClick(function(){
              self.model.isDefaultItem = false;
            });
          $(self.el).unbind( 'click', defaultItemClick );
        };

      $(this.el).click(defaultItemClick);
      $(this.el).addClass('default_item');
    }


    // do post append method

    if(this.isEditable){ 
      $(this.el).mousedown(this.onSelect);
      this.setRemoveButton();
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ"});
      //console.log(this.$el);
      this.initButton();
    }

    this.render();
    //$(this.el).click();
  },

  onSelect: function(){
    $('.target_on').removeClass('target_on').addClass('target_off');
    $('.target_off',this.el).removeClass('target_off').addClass('target_on');
    this.effecter.changeSelecter();
  },


  onRotate: function( ){
    var data = {
      'rotation' : $(this.el).rotate()
    }
    if(this.model.isDefaultItem){
      this.model.set(data);
    }else{
      this.model.save(data);
    }
    console.log(this.model);
  },

  onResize: function(){},

  onResizeBase: function(){
      var data = {
          'width' : $(this.el).width() ,
          'height': $(this.el).height() ,
          'top'   : $(this.el).offset().top - $(this.content).offset().top ,
          'left'  : $(this.el).offset().left - $(this.content).offset().left 
        };

    if(this.model.isDefaultItem){
      this.model.set(data);
    }else{
      this.model.save(data);
    }

    this.onResize();
  },

  onDragStart: function ( event, ui ) {
    //resize bug fix ui drag
    var left = parseInt( $( this.el ).css( 'left' ), 10 );
    left = isNaN( left ) ? 0 : left;
    var top = parseInt( $( this.el ).css( 'top' ), 10 );
    top = isNaN( top ) ? 0 : top;
    __recoupLeft = left - ui.position.left;
    __recoupTop = top - ui.position.top;
    //console.log(self);
    
    var z = this.parentView.maxIndex ;
    this.parentView.maxIndex++;

    this.model.set({'z_index': z});
    $(this.el).css({'zIndex':z});

    // donot save here because it triger render 
    //this.model.save();
  },

  onDrag:  function ( event, ui ) {
    //resize bug fix ui drag `enter code here`
    __dx = ui.position.left - ui.originalPosition.left;
    __dy = ui.position.top - ui.originalPosition.top;
    //ui.position.left = ui.originalPosition.left + ( __dx/__scale);
    //ui.position.top = ui.originalPosition.top + ( __dy/__scale );
    ui.position.left = ui.originalPosition.left + ( __dx);
    ui.position.top = ui.originalPosition.top + ( __dy );
            //
    ui.position.left += __recoupLeft;
    ui.position.top += __recoupTop;

    var temp_deg_0 = $($(this.el)[0]).rotate();
    $(this.el).rotate(0);
    this.model.set({
          'top' : $(this.el).offset().top - $(this.content).offset().top ,
          'left': $(this.el).offset().left - $(this.content).offset().left
        });
    $(this.el).rotate(temp_deg_0);


    if( this.isIn() ){
      $(this.el).css("opacity", 1.0);
    }else{
      $(this.el).css("opacity", 0.2);
    }
  },

  onDragStop: function(){

    //console.log(this.isIn());
    if( !this.isIn() ){
      console.log("delete");
      this.model.destroy();
      return;
    }

    if(!this.model.isDefaultItem){
      this.model.save();
    }
  },

  isIn: function(){
     //oonsole.log(temp_deg_0);
    var temp_deg_0 = $($(this.el)[0]).rotate();
    var rad = temp_deg_0 * (Math.PI / 180); 
    var entry = this.parentView.model;
    var p = [];
    var top   = this.model.get("top");
    var left  = this.model.get("left");
    var h = this.model.get("height");
    var w = this.model.get("width");

    p[0] = { x: left+w/2 -w/2*Math.cos(rad)+h/2*Math.sin(rad)  , y:top+h/2 -w/2*Math.sin(rad)-h/2*Math.cos(rad) };
    p[1] = { x: left+w/2 +w/2*Math.cos(rad)-h/2*Math.sin(rad)  , y:top+h/2 +w/2*Math.sin(rad)+h/2*Math.cos(rad) };
    p[2] = { x: left+w/2 -w/2*Math.cos(rad)-h/2*Math.sin(rad)  , y:top+h/2 -w/2*Math.sin(rad)+h/2*Math.cos(rad) };
    p[3] = { x: left+w/2 +w/2*Math.cos(rad)+h/2*Math.sin(rad)  , y:top+h/2 +w/2*Math.sin(rad)-h/2*Math.cos(rad) };
   
    //console.log(p);

    var isIn = false;
    for( var i =0; i < 4 ; i++) if( p[i].x > 0 ) {
      isIn = true;
      break;
    }
    if( !isIn ) return false;
    isIn = false;

    for( var i =0; i < 4 ; i++) if( p[i].x < entry.get("width") ) {
      isIn = true;
      break;
    }
    if( !isIn ) return false;
    isIn = false;

    for( var i =0; i < 4 ; i++) if( p[i].y > 0 ) {
      isIn = true;
      break;
    }
    if( !isIn ) return false;
    isIn = false;

    for( var i =0; i < 4 ; i++) if( p[i].y < entry.get("height") ) {
      isIn = true;
      break;
    }

    return isIn; 
  },

  showOutLine: function(){
    var self = this;
    $(this.el)
      .mouseover(function(){
          $(self.el).css({ border: '1px solid gray'});
        })
      .mouseout(function(){
          $(self.el).css({ border: 'none'});
        });
  },

  initButton: function() {
    var self = this;

    $(this.el)
      .mouseover(function(){
          if(self.isEditable){ $('.item_button',self.el).show(); }
        })
      .mouseout(function(){
          $('.item_button',self.el).hide();
        });

    $('.item_button',self.el).hide();
  },

  setRemoveButton: function(){
    var self = this;
    $('<i class="icon-remove-sign item_button item_remove" title="削除" />')
      .appendTo(this.el).hide();

    $('.item_remove',this.el)
      .click( function(){ self.model.destroy(); });
  },


  onDisplay: function(){
    this.effecter.runSelectedEffect();
  },

	onPreDisplay: function(){
    this.effecter.resetEffect(); 
  },

  onClick: function(){
    //this.effecter.changeSelecter();
    this.onSelect();
  },

  destroyView: function() {
    //COMPLETELY UNBIND THE VIEW
    this.undelegateEvents();
    
    this.$el.removeData().unbind(); 

    this.model.unbind('change',this.render);
  
    //Remove view from DOM
    this.onRemove();
    this.remove();  
    Backbone.View.prototype.remove.call(this);
   
  },

  // for over ride
  onInit: function(){},

  onAppend: function(){},

  onRemove: function() {},

  onRender: function(){},

  onDefaultItemClick: function(){}

});


BalloonView = EntryItemView.extend({
  //tmpl : '<div class=" balloon" ><div class="text"></div></div>',
  className : "balloon",

  onInit: function(){
    _.bindAll(this,
      "saveText", 
      "saveBackground" , 
      "setBackgroundButton",
      "setBalloonEditable",
      'getDefauttText',
      'editStart',
      'editEnd',
      'onResize',
      "onDefaultItemClick");

    $('<div class="text htext" ></div><div class="target_off target_balloon"></div>').appendTo(this.el);
  },

  defaultText: "ダブルクリックして編集",

  getDefauttText : function(){
    return this.defaultText;
  },

  onAppend: function(){
		var self = this;

		this.textMenu = new TextEditMenu(this);

    if(this.isEditable){

      this.model
        .bind('change:font_size change:font_family change:font_style change:font_color',this.textMenu.applyFont)
        .bind('change:border_width change:border_radius change:border_style change:border_color',this.textMenu.applyFont)
        .bind('change:entry_balloon_background_id change:background_color',this.textMenu.applyFont);

      $(this.el)
        .resizable({
          alsoResize: $('.text',this.el),
          //containment: "parent",
          stop: this.onResizeBase ,
          autoHide: true
        })
        // TEMP ? goto temp html?
        .attr({title:"ダブルクリックで編集、ドラッグで移動"});


      this.setBalloonEditable();
      this.setBackgroundButton();
    //If this view was Default item , call addTo once 
    }else{
      // for sync preview 
      this.model.bind('sync',this.render);
    }
  },

  onRemove: function(){
    this.model
      .unbind('change:font_size change:font_family change:font_style change:font_color',this.textMenu.applyFont)
      .unbind('change:border_width change:border_radius change:border_style change:border_color',this.textMenu.applyFont)
      .unbind('change:entry_balloon_background_id change:background_color',this.textMenu.applyFont);
    
    this.model.unbind('sync',this.render);
  },

  onResize:function(){

    var $text = $(".text",this.el);

    $(".htext",this.el)
      .width(  $(this.el).width() );
    $('.vtext', this.el ).width( 'auto' );

    $text
      .height( $(this.el).height() );
    /*  
    $text
      .css({
      "left" : "50%",
      "top" : "50%",
      "margin-left": "-"+$text.width()/2+"px",
      "margin-top": "-"+$text.height()/2+"px",
    });
    */
  },


  setBalloonEditable: function(){
		var self = this;

    $(this.el)
      .bind('dblclick', this.editStart);

    $('.text',this.el)
      .blur(this.editEnd);
      //.bind('input', this.saveText);

  },

  editStart: function(){
    // disable draggable when focusing contenteditable
    // and disable text render with isEditing flag
		var self = this;

    //if text was Deafault , reset it
    if( this.model.get('content') == this.defaultText ){
      $('.text',this.el).html('');
      this.model.set('content',"");
    }

    if ( ! $(self).is('.ui-draggable-dragging') && !self.isEditing ) {
      $(self.el).draggable("option","disabled",true).removeClass('ui-state-disabled');
      self.el.removeAttribute('aria-disabled');

      $('.text',self.el).attr('contenteditable','true').focus();
      // this.setFocus();
      self.isEditing = true;
    }

    self.textMenu.changeSelecter(self.el);
    $('.ui-tooltip').hide();

  },
  
  editEnd: function( ev ){
    //console.log(ev);
    if( this.isEditing == true){
		  var self = this;
      this.saveText();
      //for trigger tutorial event or some blur event
      $(this.el).blur();
      $(self.el).draggable("option","disabled",false);
      $('.text',self.el).attr('contenteditable','false');
      self.isEditing = false;
     
      self.onResize();
    }
  },

  onDefaultItemClick: function(callback) {
    $('.text',this.el).html('');
    this.model.set('content',"");
    // add this model to entry collecti
    //this.model.defaultItemSave();
    this.model.addTo( this.parentView.model.balloons , callback);
    this.editStart();
  },



  // not work well 
  setFocus: function(){
    var node = $('.text',this.el)[0];
    var pos = 0;
    if(!node){
      return false;
    }else if(node.createTextRange){
      var textRange = node.createTextRange();
      textRange.collapse(true);
      textRange.moveEnd(pos);
      textRange.moveStart(pos);
      textRange.select();
      return true;
    }else if(node.setSelectionRange){
      node.setSelectionRange(pos,pos);
      return true;
    }
  },

  onRender: function(){
    //console.log(this.isEditing);
    if( !this.isEditing){
      var text =  this.model.get('content');
      if( text ) text = text.split('\n').join('<br>');
      $('.text',this.el).html( text )
        .height(this.model.get('height'));
 
      this.effecter.resetEffect(); 
      this.textMenu.applyFont();

      //vtextの場合widthを指定しない
      //$('.htext',this.el)
      //  .width(this.model.get('width'));

    }
  },


  saveText: function(txt){
    var self = this;
    console.log("set text");
    // to aviod call too many save method 
    if(!this.saving && !this.model.isDefaultItem){
      this.saving = true;

      //for div of vtext
      var txt = $('.text',this.el).html()
          .split("<div><br></div>").join("<br>")
          .split("<div>").join("<br>");
      $('.text',this.el).html( txt );

      txt = Config.prototype.escapeText( $('.text',this.el) ); 
      this.model.save( 
          'content',txt,
          {success: function(){ self.saving = false;}}
        );
    }
  },
  
  saveBackground: function(id){
    this.model.save('entry_balloon_background_id',id);
    //this.textMenu.applyFont();
  },

  setBackgroundButton: function(){
    var self = this;
    $('<i class="icon-comment item_button item_background" title="吹き出しのタイプ" />')
      .appendTo(this.el)
      .hide();

    $('.item_background',this.el).click(
      function(){
        //console.log(target);
        Picker.prototype.showBalloonList(self.saveBackground);
      }
    );
  },


});


CharacterView = EntryItemView.extend({
  //tmpl: '<div class="wrapper model model-resizable model-draggable"><img class="model_image"></div>',
  className : "character",
  //pre append method
  onInit: function(){
    _.bindAll(this,
      "selectCharacter","setCharacter", "onDefaultItemClick","setRefrectButton");
    $('<img class="character_image target_off">').appendTo(this.el);
    this.model.bind('sync',this.render,this);
  },
  
  onRemove: function(){
    this.model.unbind('change',this.render);
  },

  //post append messod
  onAppend: function(){
    if(this.isEditable){

      $(this.el)
        .resizable({
          //  containment: "parent parent" ,
          aspectRatio: true,
          stop: this.onResizeBase,
          autoHide: true,
          "handles": "n, e, s, w, ne, se, sw, nw",
        })
        .dblclick(this.selectCharacter)
        .attr({title:"ダブルクリックで画像選択、ドラッグして移動"});

      this.setRefrectButton();
      //set UI on mouseovered
      this.showOutLine();

      var self =this;
      $(this.el).mousedown(function(){
          $('.text').blur();
        });
    }
    
  },

  onRender: function(){
    var url = this.model.get('url');
    if( !url ) url = config.character_image_idtourl( this.model.get('character_image_id') );
    $('img',this.el).attr('src', url );
    if( this.model.get("refrect") == 1 ){
      $('img',this.el).addClass("refrect");
    }else{
      $('img',this.el).removeClass("refrect");
    }

    this.effecter.resetEffect(); 
  },

  selectCharacter: function(ev){
    //console.log(ev.target.tagName);
    
    //not show picker at icon click
    if( ev ) if ( ev.target.tagName == "I" ) return;

    Picker.prototype.showCharacterList(this.setCharacter);
  },

// use img to get size 
// this not clear bu fast
  setCharacter: function( data ){
    this.model.save(data);
    /*{
      'character_image_id' : image_id ,
      'character_id' : parseInt(character_id) ,
      'width' : img.width,
      'height': img.height,
    });*/

    this.parentView.setCharacterId( data.character_id ); 
  },

  setRefrectButton: function(){
    var self = this;
    $('<i class="icon-resize-horizontal item_button item_refrect" title="左右反転" />')
      .appendTo(this.el)
      .hide();

    $('.item_refrect',this.el).click(
      function(){
        //console.log(target);
        if ( self.model.get("refrect") == 1 ) {
          self.model.save("refrect",0);
        } else {
          self.model.save("refrect",1);
        }
      }
    );
  },


  onDefaultItemClick: function(callback) {
    console.log("on df clk",$(this.el));
    $(this.el).css({opacity: 1});
    // add this model to entry collection 
    //this.model.defaultItemSave();
    this.model.addTo( this.parentView.model.characters ,callback);
    this.selectCharacter();
  },
  
    
});
