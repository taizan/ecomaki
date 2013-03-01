//position obj is there some nomal one?


EntryItemView = Backbone.View.extend ({

  initialize: function(args){
     _.bindAll(this,
        "onChange",
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
   
    this.parentView = args.parentView;
    this.isEditable = args.isEditable;
    this.content = this.parentView.content;
  
    this.defaultInitialize.apply(this,arguments);

    this.onInit.apply(this,arguments);

  },

  // for over ride
  onInit: function(){},

  // for over ride
  tmpl: '',

  defaultInitialize: function(){
   this.model.on('change',this.onChange);
    //this.el = this.tmpl;
    var z = this.model.get('z_index') != null ? this.model.get('z_index') : 0;  

    $(this.el)
      .css({position: 'absolute', top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
     
  },

  render: function(){
    var z = this.model.get('z_index') != null ? this.model.get('z_index') : 0;  

    $(this.el)
      .css({position: 'absolute', top: this.model.get('top'), left: this.model.get('left'), zIndex: z })
      .width(this.model.get('width')).height(this.model.get('height'));
    
    this.onRender();
  },
  
  onRender: function(){},

  onChange: function(){
    //console.log('on model change');
    //this.model.save();
  },

  appendTo: function(target){
    $(this.el).appendTo(target);

    if(this.isEditable) $(this.el).click(this.onClick);
    this.onAppend();
  },

  onAppend: function(){},

  onResize: function(){
    this.effecter.changeSelecter();

    this.model.set('width',$(this.el).width());
    this.model.set('height' , $(this.el).height());
    this.model.save();
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
    this.model.save();
  },

  onDragStop: function(){
    this.model.set('top' , $(this.el).offset().top - $(this.content).offset().top );
    this.model.set('left' , $(this.el).offset().left - $(this.content).offset().left );

    this.model.save();
    
    console.log(this);
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
    var _self = this;
    var button = $('<i class="icon-remove-sign item-button item-remove" title="削除" />');
    button.appendTo(target);
    button.hide();

    var model = this.model;

    $('.item-remove',target).click(
      function(){
        //console.log(target);
        $('.model',target).remove();
        $(target).remove();
        model.destroy();
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

});


BalloonView = EntryItemView.extend({
  //tmpl : '<div class=" balloon" ><div class="text"></div></div>',
  className : "balloon",

  onInit: function(){
    _.bindAll(this,"saveText", "saveBackground" , "setBackgroundButton");
    $('<div class="text"></div>').appendTo(this.el);
    $('.text',this.el).html(this.model.get('content'));
  },

  onAppend: function(){
    //console.log(this.el);
    this.target = $(this.el);
    this.effecter = new Effecter(this.target,this.model,'option','balloon'+this.model.get('id') );
    //this.fontSelecter = new FontSelecter(this.target,this.model);
		this.textMenu = new TextEditMenu(this.target, this.model);

    $(this.el).children().width(this.model.get('width')).height(this.model.get('height'));

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

      //$(this.el).click(this.editText);
      //$(this.el).click(this.fontSelecter.changeSelecter);
			var self = this;
      $(this.el).click((function(){
          editableTextarea(self.el,self.saveText);
          self.textMenu.changeSelecter(self.target)
          $('.ui-tooltip').hide();
        }));
      
      this.setRemoveButton();
      this.setBackgroundButton();
      this.initButton();

      // TEMP ? goto temp html?
      $(this.el).attr({title:"クリックで編集、ドラッグで移動"});
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ"});
    }
    //this.fontSelecter.applyFont();
  },

  onRender: function(){
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
    $('img',this.el).attr('src', config.character_image_idtourl( this.model.get('character_image_id') ) );
  },

  //post append messod
  onAppend: function(){
    if(this.isEditable){
      $(this.el).resizable({
        //  containment: "parent parent" ,
        aspectRatio: true,
        stop: this.onResize,
        autoHide: true,
        "handles": "n, e, s, w, ne, se, sw, nw",
      });

      this.target = $(this.el);
			this.effecter = new Effecter(this.target,this.model,'option' , 'image'+this.model.get('id'));

      $(this.el).draggable({
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).click(this.selectCharacter);
      $(this.el).click(function(){
        $('#toolbox .font_selecter').remove();
      });
      
      //set UI on mouseovered
      this.setRemoveButton();
      this.initButton();
      this.showOutLine();
      $(this.el).attr({title:"クリックで画像選択、ドラッグして移動; Click to select image.Dragg to move"});
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ; Drag to resize"});

    }else{
      this.target = $(this.el);
      this.effecter = new Effecter(this.target,this.model,'option');
    }
  },

  onRender: function(){
    this.effecter.resetEffect(); 
  },

  selectCharacter: function(ev){
    //console.log('selectimage');
    Picker.prototype.showCharacterList(this.setCharacter);
  },
// use img to get size 
// this not clear bu fast
  setCharacter: function(id,img){
    this.model.set('character_image_id' , id );
    var targetCharacter = $('img',this.el).attr('src',config.character_image_idtourl(id));
/*
    var destHeight = this.content.offset().top + this.content.height() - $(this.el).offset().top;
    if(destHeight < img.height ){
      console.log('modefy height');
      img.width =  img.width * destHeight / img.height;
      img.height = destHeight;
    }
    var destWidth = this.content.offset().left + this.content.width() - $(this.el).offset().left;
    if(destWidth < img.width ){
      // this should just this jyunjyo
      console.log('modefy height');
      img.height =  img.height * destWidth / img.width;
      img.width = destWidth;
    }

*/
    $(this.el).height(img.height).width(img.width);
    this.model.set('width' , img.width);
    this.model.set('height' , img.height);
    this.model.save();
  }

});
