//position obj is there some nomal one?


EntryItemView = Backbone.View.extend ({

  initialize: function(args){
     
    this.parentView = args.parentView;
    this.isEditable = args.isEditable;
    this.content = this.parentView.content;
     
     _.bindAll(this,
        "onSync",
        "onClick",
        "onResize",
        "onDragStart",
        "onDragStop",
        "appendTo",
        "onAppend",
        "onRender",
        "initButton",
        "setRemoveButton",
        "showOutLine",
				"onDisplay",
				"onPreDisplay"
      );
   
    //this.model.bind('change', this.render, this);

    this.defaultInitialize.apply(this,arguments);

    this.onInit.apply(this,arguments);
  },

  onSync: function(){
    console.log('onsync');
  },

  // for over ride
  onInit: function(){},

  // for over ride
  tmpl: '',

  defaultInitialize: function(){
    //this.el = this.tmpl;
    var z = this.model.get('z_index') != null ? this.model.get('z_index') : 0;  

    $(this.el)
      .css({position: 'absolute', top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
     
  },

  render: function(){
    console.log('render');
    
    var z = this.model.get('z_index') != null ? this.model.get('z_index') : 0;  

    $(this.el)
      .css({position: 'absolute', top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
   
    this.onRender();
  },
  
  onRender: function(){},

  appendTo: function(target){
    $(this.el).appendTo(target);

    if(this.isEditable) $(this.el).click(this.onClick);
    
    this.onAppend();
    
    this.setRemoveButton();
    this.initButton();
    this.render();
  },

  onAppend: function(){},

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
    $(this.target).css({zIndex: z});
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
    var target = this.target; 
    var _self = this;
    $(target)
      .mouseover(function(){
        if(_self.isEditable){
          $(target).css({ border: '1px solid gray'});
        }
      })
      .mouseout(function(){
        $(target).css({ border: 'none'});
      });
  },

  initButton: function() {
    var target = this.target;
    var _self = this;

    $(target)
      .mouseover(function(){
        if(_self.isEditable){
          $('.item-button',target).show();
        }
      })
      .mouseout(function(){
        $('.item-button',target).hide();
      });

  },

  setRemoveButton: function(){
    var target = this.target;
    var self = this;
    var button = $('<i class="icon-remove-sign item-button item-remove" title="削除" />');
    button.appendTo(target);
    button.hide();


    $('.item-remove',target).click(
      function(){
        //console.log(target);
        self.destroyView();
        self.model.destroy();
      }
    );
  },
  
  onDisplay: function(){
    console.log('ondisp')
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

  onRemove: function() {},

});


BalloonView = EntryItemView.extend({
  //tmpl : '<div class=" balloon" ><div class="text"></div></div>',
  className : "balloon",

  onInit: function(){
    _.bindAll(this,"saveText", "saveBackground" , "setBackgroundButton","setBalloonEditable");
    //this.model.bind('sync', this.render, this);

    //$('<div class="text" contenteditable="true"></div>').appendTo(this.el);
    $('<div class="text" ></div>').appendTo(this.el);

  },

  onAppend: function(){

    //console.log(this.el);
    this.target = this.el;
		var self = this;

    this.effecter = new Effecter(this.target,this.model,'option','balloon'+this.model.get('id') );
    //this.fontSelecter = new FontSelecter(this.target,this.model);
		this.textMenu = new TextEditMenu(this.target, this.model);
    //this.effecter.resetEffect(); 
    //this.textMenu.applyFont();
    this.model.bind('change:option', this.effecter.resetEffect );
    this.model.bind('change:font_size change:font_family change:font_style change:font_color',this.textMenu.applyFont);
    this.model.bind('change:border_width change:border_radius change:border_style change:border_color',this.textMenu.applyFont);
    this.model.bind('change:entry_balloon_background_id change:background_color',this.textMenu.applyFont);
   

    if(this.isEditable){
		
      $(this.el).draggable({
        //containment: "parent",
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).resizable({
        alsoResize: $('.text',this.el),
        containment: "parent",
        stop: this.onResize ,
        autoHide: true
      });

      this.setBalloonEditable();

      this.setBackgroundButton();

      // TEMP ? goto temp html?
      $(this.el).attr({title:"クリックで編集、ドラッグで移動"});
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ"});
    }
    //this.fontSelecter.applyFont();
  },

  setBalloonEditable: function(){
		var self = this;
    $(this.el)
        .bind('click', function(){
            // disable draggable when focusing contenteditable
            // and disable text render with isEditing flag
            if ( ! $(self).is('.ui-draggable-dragging') && !self.isEditing ) {
              $(self.el).draggable("option","disabled",true).removeClass('ui-state-disabled');
              self.el.removeAttribute('aria-disabled');

              $('.text',self.el).attr('contenteditable','true').focus();
              self.isEditing = true;
            }

            self.textMenu.changeSelecter(self.target);
            $('.ui-tooltip').hide();
          });

      $('.text',this.el)
        .blur(function(ev){
            $(self.el).draggable("option","disabled",false);
            $('.text',self.el).attr('contenteditable','false');
            self.isEditing = false;
          })
        .bind('input', function(){
            var txt = Config.prototype.escapeText($('.text',self.el).html());
            self.saveText( txt );
         });


  },

  onRender: function(){
    $('.text',this.el)
      .html(this.model.get('content'))
      .width(this.model.get('width')).height(this.model.get('height'));
    this.effecter.resetEffect(); 
    this.textMenu.applyFont();
  },


  saveText: function(txt){
    this.model.set('content',txt);
    this.model.save();
  },
  
  saveBackground: function(txt){
    this.model.set('entry_balloon_background_id',txt);
    this.model.save();
    //this.textMenu.applyFont();
  },

  setBackgroundButton: function(){
    var target = this.target;
    var _self = this;
    var button = $('<i class="icon-comment item-button item-background" title="吹き出しのタイプ" />');
    button.appendTo(target);
    button.hide();

    var model = this.model;

    $('.item-background',target).click(
      function(){
        //console.log(target);
        Picker.prototype.showBalloonList(_self.saveBackground);
      }
    );
  },


});


CharacterView = EntryItemView.extend({
  //tmpl: '<div class="wrapper model model-resizable model-draggable"><img class="model_image"></div>',
  className : "character",
  //pre append method
  onInit: function(){
    _.bindAll(this,"selectCharacter","setCharacter");
    $('<img class="character_image">').appendTo(this.el);

    this.model.bind('sync', this.render, this);
  },

  //post append messod
  onAppend: function(){
    if(this.isEditable){
      this.target = this.el;
			this.effecter = new Effecter(this.target,this.model,'option' , 'image'+this.model.get('id'));


      $(this.el).resizable({
        //  containment: "parent parent" ,
        aspectRatio: true,
        stop: this.onResize,
        autoHide: true,
        "handles": "n, e, s, w, ne, se, sw, nw",
      });

      $(this.el).draggable({
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).click(this.selectCharacter);
      
      //set UI on mouseovered
      this.showOutLine();

      $(this.el).attr({title:"クリックで画像選択、ドラッグして移動; Click to select image.Dragg to move"});
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ; Drag to resize"});

    }else{
      this.target = $(this.el);
      this.effecter = new Effecter(this.target,this.model,'option');
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

});
