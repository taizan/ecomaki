//position obj is there some nomal one?


EntryItemView = Backbone.View.extend ({

  initialize: function(args){
     
    this.parentView = args.parentView;
    this.isEditable = args.isEditable;
    this.content = this.parentView.content;
     
     _.bindAll(this,
        "render",
        "onSync",
        "onClick",
        "onResize",
        "onDragStart",
        "onDragStop",
        "onRender",
				"onDisplay",
				"onPreDisplay",
				//"onDefaultItemClick",
        "onDefaultItemOver", 
        "destroyView"
      );
   
    this.model.bind('destroy', this.destroyView, this);

    this.defaultInitialize.apply(this,arguments);

    this.onInit.apply(this,arguments);
  },

  onSync: function(){
    console.log('onsync');
  },


  defaultInitialize: function(){
    //this.el = this.tmpl;
    var z = this.model.get('z_index') != null ? this.model.get('z_index') : 0;  

    $(this.el)
      .css({position: 'absolute', top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
     
  },

  render: function(){
    //console.log('render');
    //console.log(this);
    
    var z = ( this.model.get('z_index') != null ) ? this.model.get('z_index') : 0;  

    $(this.el)
      .css({position: 'absolute', top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
   
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
      $(this.el)
        .click(this.onClick)
        .draggable({
          //containment: "parent",
          start: this.onDragStart,
          stop: this.onDragStop
        });
    }

    this.onAppend();
   
    // do post appedn method
    this.setRemoveButton();
    this.initButton();
    $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ; Drag to resize"});
   

    this.render();
    //$(this.el).click();
  },

  onResize: function(){
    this.effecter.changeSelecter();

    this.model.save({
        'width' : $(this.el).width() ,
        'height': $(this.el).height() ,
        'top'   : $(this.el).offset().top - $(this.content).offset().top ,
        'left'  : $(this.el).offset().left - $(this.content).offset().left 
      });
  },

  onDragStart: function(){
    this.effecter.changeSelecter();

    var z = this.parentView.maxIndex ;
    //if(this.model.get('z_index') < z) {
      z ++;
      this.parentView.maxIndex++;
    //}
    $(this.el).css({zIndex: z});
    this.model.set('z_index', z);
    // donot save here because it triger render 
    //this.model.save();
  },

  onDragStop: function(){
    this.model.save({
        'top' : $(this.el).offset().top - $(this.content).offset().top ,
        'left': $(this.el).offset().left - $(this.content).offset().left 
    });
    //console.log(this);
  },

  showOutLine: function(){
    var self = this;
    $(this.el)
      .mouseover(function(){
        if(self.isEditable){
          $(self.el).css({ border: '1px solid gray'});
        }
      })
      .mouseout(function(){
        $(self.el).css({ border: 'none'});
      });
  },

  initButton: function() {
    var self = this;

    $(this.el)
      .mouseover(function(){
        if(self.isEditable){
          $('.item-button',self.el).show();
        }
      })
      .mouseout(function(){
        $('.item-button',self.el).hide();
      });

  },

  setRemoveButton: function(){
    var self = this;
    $('<i class="icon-remove-sign item-button item-remove" title="削除" />')
      .appendTo(this.el)
      .hide();

    $('.item-remove',this.el).click(
      function(){
        //console.log(target);
        self.model.destroy();
      }
    );
  },

  onDefaultItemOver: function() {
    var self = this;
    $(this.el)
      .mouseover( function(){
        if(self.model.isDefaultItem) 
          $(self.el).css({opacity: 1});
        })
      .mouseout( function() {
        if(self.model.isDefaultItem) 
          $(self.el).css({opacity: 0.5});
        })
      .css({opacity: 0.5})
  },


  onDisplay: function(){
    this.effecter.runSelectedEffect();
  },

	onPreDisplay: function(){
    this.effecter.resetEffect(); 
  },

  onClick: function(){
    this.effecter.changeSelecter();
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


});


BalloonView = EntryItemView.extend({
  //tmpl : '<div class=" balloon" ><div class="text"></div></div>',
  className : "balloon",

  onInit: function(){
    _.bindAll(this,"saveText", "saveBackground" , "setBackgroundButton","setBalloonEditable",
      'editStart','editEnd',"onDefaultItemClick");
    //this.model.bind('sync', this.render, this);

    //$('<div class="text" contenteditable="true"></div>').appendTo(this.el);
    $('<div class="text" ></div>').appendTo(this.el);

  },

  onAppend: function(){

    //console.log(this.el);
		var self = this;

		this.textMenu = new TextEditMenu(this.el, this.model);

    if(this.isEditable){

    this.model
      .bind('change:font_size change:font_family change:font_style change:font_color',this.textMenu.applyFont)
      .bind('change:border_width change:border_radius change:border_style change:border_color',this.textMenu.applyFont)
      .bind('change:entry_balloon_background_id change:background_color',this.textMenu.applyFont);
   
      $(this.el)
        .resizable({
          alsoResize: $('.text',this.el),
          containment: "parent",
          stop: this.onResize ,
          autoHide: true
        })
        // TEMP ? goto temp html?
        .attr({title:"クリックで編集、ドラッグで移動"});


      this.setBalloonEditable();
      this.setBackgroundButton();

    //If this view was Default item , call addTo once 
    if(this.model.isDefaultItem){
      $(this.el).bind('click', this.onDefaultItemClick );
      this.onDefaultItemOver();
    }


    }
    //this.fontSelecter.applyFont();
    this.render();
  },

  onRemove: function(){
    this.model
      .unbind('change:font_size change:font_family change:font_style change:font_color',this.textMenu.applyFont)
      .unbind('change:border_width change:border_radius change:border_style change:border_color',this.textMenu.applyFont)
      .unbind('change:entry_balloon_background_id change:background_color',this.textMenu.applyFont);
  },

  setBalloonEditable: function(){
		var self = this;

    $(this.el)
      .bind('click', this.editStart);

    $('.text',this.el)
      .blur(this.editEnd)
      .bind('input', this.saveText);

  },

  editStart: function(){
    // disable draggable when focusing contenteditable
    // and disable text render with isEditing flag
		var self = this;

    if ( ! $(self).is('.ui-draggable-dragging') && !self.isEditing ) {
      $(self.el).draggable("option","disabled",true).removeClass('ui-state-disabled');
      self.el.removeAttribute('aria-disabled');

      $('.text',self.el).attr('contenteditable','true').focus();
      this.setFocus();
      self.isEditing = true;
    }

    self.textMenu.changeSelecter(self.el);
    $('.ui-tooltip').hide();

  },
  
  onDefaultItemClick: function() {

    if(this.model.isDefaultItem) {
      this.model.isDefaultItem = false;   
      $(this.el).unbind('click', this.onDefaultItemClick );
      
      $('.text',this.el).html('');
      // add this model to entry collecti
      //this.model.defaultItemSave();
      this.model.addTo( this.parentView.model.balloons );
    }
  },

  editEnd: function(){
		var self = this;
    $(self.el).draggable("option","disabled",false);
    $('.text',self.el).attr('contenteditable','false');
    self.isEditing = false;
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
    $('.text',this.el)
      .html( this.model.get('content') )
      .width(this.model.get('width')).height(this.model.get('height'));
    this.effecter.resetEffect(); 
    this.textMenu.applyFont();
  },


  saveText: function(txt){
    txt = Config.prototype.escapeText($('.text',this.el).html());
    this.model.save('content',txt);
  },
  
  saveBackground: function(id){
    this.model.save('entry_balloon_background_id',id);
    //this.textMenu.applyFont();
  },

  setBackgroundButton: function(){
    var self = this;
    $('<i class="icon-comment item-button item-background" title="吹き出しのタイプ" />')
      .appendTo(this.el)
      .hide();

    $('.item-background',this.el).click(
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
    _.bindAll(this,"selectCharacter","setCharacter", "onDefaultItemClick");
    $('<img class="character_image">').appendTo(this.el);
    this.model.bind('change',this.render,this);
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
          stop: this.onResize,
          autoHide: true,
          "handles": "n, e, s, w,this.onDefaultItemOver ne, se, sw, nw",
        })

        .click(this.selectCharacter)
      
        .attr({title:"クリックで画像選択、ドラッグして移動"});
      

      //set UI on mouseovered
      this.showOutLine();
    
      //If this view was Default item , call addTo once 
      if(this.model.isDefaultItem){
        $(this.el).bind( 'click', this.onDefaultItemClick );
        this.onDefaultItemOver();
      }

    }
    
  },

  onRender: function(){
    $('img',this.el).attr('src', config.character_image_idtourl( this.model.get('character_image_id') ) );
    this.effecter.resetEffect(); 
  },

  selectCharacter: function(ev){
    //console.log('selectimage');
    Picker.prototype.showCharacterList(this.setCharacter);
  },

// use img to get size 
// this not clear bu fast
  setCharacter: function(id,img){
    this.model.save({
      'character_image_id' : id ,
      'width' : img.width,
      'height': img.height,
    });
  },

  onDefaultItemClick: function() {
    // add this model to entry collection 
    //this.model.defaultItemSave();
    if(this.model.isDefaultItem) {
      this.model.isDefaultItem = false;   
      $(this.el).unbind( 'click', this.onDefaultItemClick );
      console.log('addto')
      this.model.addTo( this.parentView.model.characters );
    }
  },
  
    
});
