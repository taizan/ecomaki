//= require jquery.jStageAligner
//position obj is there some nomal one?


var EntryItem = function(item,view,isEditable){
  this.parentView = view;
  this.item = item;
  this.isEditable = isEditable;
  this.content = this.parentView.content;
  
  this.defaultInitialize.apply(this,arguments);

  this.initialize.apply(this,arguments);

};

EntryItem.extend = function (protoProps, classProps) {
  var child = config.inherits(this, protoProps, classProps);
  child.extend = this.extend;
  
	return child;
};

EntryItem.prototype = {
  // for over ride
  initialize: function(){},

  // for over ride
  tmpl: '',

  defaultInitialize: function(){
    _.bindAll(this,
        "onChange",
        "onClick",
        "onResize",
        "onDragStart",
        "onDragStop",
        "appendTo",
        "setButton",
        "showOutLine",
        "init",
				"onDisplay",
				"onPreDisplay"
      );
    this.item.on('change',this.onChange);
    this.$el = $(this.tmpl);
    this.el = this.$el[0];
    var z = this.item.get('z_index') != null ? this.item.get('z_index') : 0;  

    this.$el
      .css({position: 'absolute', top: this.item.get('top'), left: this.item.get('left'), zIndex: z })
      .width(this.item.get('width')).height(this.item.get('height'));
     
  },

  onChange: function(){
    //console.log('on item change');
    //this.item.save();
  },

  appendTo: function(target){
    this.$el.appendTo(target);
    this.el = this.$el[0];

    if(this.isEditable) $(this.el).click(this.onClick);
    this.init();
  },

  init: function(){},

  onResize: function(){
    this.item.set('width',$(this.el).width());
    this.item.set('height' , $(this.el).height());
    this.item.save();
  },

  onDragStart: function(){
    var z = this.parentView.maxIndex ;
    //if(this.item.get('z_index') < z) {
      z ++;
      this.parentView.maxIndex++;
    //}
    $(this.el).css({zIndex: z});
    $(this.target).css({zIndex: z});
    this.item.set('z_index', z);
    this.item.save();
  },

  onDragStop: function(){
    this.item.set('top' , $(this.el).offset().top - $(this.content).offset().top );
    this.item.set('left' , $(this.el).offset().left - $(this.content).offset().left );

    this.item.save();
    
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

  setButton: function(){
    var target = this.target;
    var _self = this;
    var button = $('<i class="icon-remove-sign item-button item-remove" title="削除; remove" />');
    button.appendTo(target);
    button.hide();

    $(target)
      .mouseover(function(){
        if(_self.isEditable){
          button.show();
        }
      })
      .mouseout(function(){
        button.hide();
      });

    var item = this.item;

    $('.item-remove',target).click(
      function(){
        //console.log(target);
        $('.item',target).remove();
        $(target).remove();
        item.destroy();
      }
    );
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

};


BalloonItem = EntryItem.extend({
  tmpl : '<div class="item balloon item-resizable item-draggable sticky" ><div class="text"></div></div>',

  initialize: function(){
    _.bindAll(this,"saveText");
    $('.text',this.el).html(this.item.get('content'));
  },

  init: function(){
    //console.log(this.el);
    this.target = $(this.el);
    this.effecter = new Effecter(this.target,this.item,'option');
    //this.fontSelecter = new FontSelecter(this.target,this.item);
		this.textMenu = new TextEditMenu(this.target, this.item);

    this.$el.children().width(this.item.get('width')).height(this.item.get('height'));

    if(this.isEditable){

		
      $(this.el).draggable({
        containment: "parent",
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
        }));
      
      this.setButton();
      $(this.el).attr({title:"クリックで編集; click to edit"});
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ; Drag to resize"});
    }
    this.effecter.resetEffect(); 
    //this.fontSelecter.applyFont();
    this.textMenu.applyFont();
  },


  saveText: function(txt){
    this.item.set('content',txt);
    this.item.save();
  },

});


ImageItem = EntryItem.extend({
  tmpl: '<div class="wrapper item item-resizable item-draggable"><img class="item_image"></div>',
  //pre append method
  initialize: function(){
    _.bindAll(this,"selectImage","setImage","init");
    $('img',this.el).attr('src', config.character_image_idtourl( this.item.get('character_image_id') ) );
  },
  //post append messod
  init: function(){
    if(this.isEditable){
      $(this.el).resizable({
        //  containment: "parent parent" ,
        aspectRatio: true,
        stop: this.onResize,
        autoHide: true,
        "handles": "n, e, s, w, ne, se, sw, nw",
      });

      this.target = $(this.el);
			this.effecter = new Effecter(this.target,this.item,'option');

      $(this.el).draggable({
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).click(this.selectImage);
      $(this.el).click(function(){
        $('#toolbox .font_selecter').remove();
      });
      this.setButton();
      this.showOutLine();
      $(this.el).attr({title:"クリックで画像選択; click to select image"});
      $('.ui-resizable-handle',this.el).attr({title:"ドラッグしてリサイズ; Drag to resize"});
    }else{
      this.target = $(this.el);
      this.effecter = new Effecter(this.target,this.item,'option');
    }
    this.effecter.resetEffect(); 
  },

  selectImage: function(ev){
    //console.log('selectimage');
    Picker.prototype.showCharacterList(this.setImage);
  },
// use img to get size 
// this not clear bu fast
  setImage: function(id,img){
    this.item.set('character_image_id' , id );
    var targetImage = $('img',this.el).attr('src',config.character_image_idtourl(id));

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
    $(this.el).height(img.height).width(img.width);

    this.item.set('width' , img.width);
    this.item.set('height' , img.height);
  }

});
