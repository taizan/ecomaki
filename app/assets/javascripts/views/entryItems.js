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

  //for ajust 
  target: {},

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
				"onPreDisplay",
        "runEffect",
        "effectCallback",
        "resetEffect",
        "appendEffectSelecterTo",
        "setEffect"

      );
    this.item.on('change',this.onChange);
    this.$el = $(this.tmpl);
    this.el = this.$el[0];
    var z;
    z = this.item.get('z_index') != null ? this.item.get('z_index') : 0;  

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

    $(this.el).click(this.onClick);
    this.init();
  },

  init: function(){},

  onResize: function(){
    this.item.set('width',$(this.el).width());
    this.item.set('height' , $(this.el).height());
    this.item.save();
  },

  onDragStart: function(){
    this.hideButton();

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
    this.showButton();
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
    var body = '<i class="icon-remove-sign item-button item-remove" />';
    var button = $(body);
    button.appendTo(target);
    button.hide();
    $(target).find('.ui-resizable-handle').hide();

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

  showButton: function() {
    var target = this.target;
    target.find('.item-remove').show();
    //target.find('.ui-resizable-handle').show();
  },

  hideButton: function() {
    var target = this.target;
    target.find('.item-remove').hide();
    //target.find('.ui-resizable-handle').hide();
  },
  
  onDisplay: function(){
    var option = this.item.get('option');
    if(option != null){
      var options = option.split(',');
      this.runEffect(options[0],options[1],parseInt(options[2]),{});
    }
    //this.runEffect(this.model.get('option'));
  },

	onPreDisplay: function(){
    this.resetEffect(); 
  },

  onClick: function(){
    console.log('on item click');
    $('._tool_menu .effect_selecter').remove();
    this.appendEffectSelecterTo($('._tool_menu'));
  },

  isRunnable: true,

  runEffect: function(selectedFunction , selectedEffect , speed , options){
    var options = {};
    // some effects have required parameters
    if ( selectedEffect === "scale" ) {
      options = { percent: 0 };
    } else if ( selectedEffect === "size" ) {
      options = { to: { width: 200, height: 60 } };
    } 
    //prevent overrapping of effect    
    if(this.isRunnable){
      switch(selectedFunction){
        case "show" :
          if(selectedEffect == 'none'){
            $(this.target).show( speed, this.effectCallback );
          }else{
            $(this.target).show( selectedEffect, options, speed, this.effectCallback );
          }
          break; 
        case "hide" :
          if(selectedEffect == 'none'){
            $(this.target).hide( speed, this.effectCallback );
          }else{
            $(this.target).hide( selectedEffect, options, speed, this.effectCallback );
          }
          break; 
        case "effect" :
          if(selectedEffect == 'none'){
            $(this.target).show( speed, this.effectCallback );
          }else{
            $(this.target).effect( selectedEffect, options, speed, this.effectCallback );
          }
          break;
      }

      this.isRunnable = false;
    }
  },

  effectCallback: function(){
    this.isRunnable = true;
  },

  resetEffect: function(){
      //console.log("reset effect");
      //$(this.target).stop();
      var option = this.item.get('option');
      if(option != null){
        var options = option.split(',');
        switch(options[0]){
          case "none" :
            $(this.target).show();
            break; 
          case "show" :
            $(this.target).hide();
            break; 
          case "hide" :
            $(this.target).show();
            break; 
          case "effect" :
            $(this.target).show();
            break;
       }
    }
  },
  
  appendEffectSelecterTo: function(target){    
    var selecterTemplate =  $("#effect_selecter_template").html();
    this.selecter = $(selecterTemplate);
    $(this.selecter).appendTo(target);
    _self = this;
    $(this.selecter).find('.functionTypes').change( _self.setEffect );
    $(this.selecter).find('.effectTypes').change( _self.setEffect );
    //$(this.selecter).find('.easeTypes').change( _self.setEffect );
    $(this.selecter).find('.durations').change( _self.setEffect );  
  },

  setEffect: function(){
    var optionString = 
        $(this.selecter).find('.functionTypes').val() + "," +
        $(this.selecter).find('.effectTypes').val() + "," +
        //$(this.selecter).find('.easeTypes').val() + "," +
        $(this.selecter).find('.durations').val();
    console.log(optionString);
    this.item.set('option',optionString);
    this.item.save();
  }
};


BaloonItem = EntryItem.extend({
  tmpl : '<div class="item baloon item-resizable item-draggable sticky"><div class="text"></div></div>',

  initialize: function(){
    _.bindAll(this,"editText","saveText");
    $('.text',this.el).html(this.item.get('content'));
  },

  init: function(){
    //console.log(this.el);
    if(this.isEditable){

    this.target = $(this.el);

      $(this.el).draggable({
        containment: "parent",
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).resizable({
        containment: "parent",
        stop: this.onResize ,
        autoHide: true
      });

      $(this.el).dblclick(this.editText);
      this.setButton();
    }
    this.resetEffect(); 
  },

  editText: function(){
    editableTextarea(this.el,this.saveText);
  },

  saveText: function(txt){
    this.item.set('content',txt);
    this.item.save();
  },

});


ImageItem = EntryItem.extend({
  tmpl: '<img class="item image item-resizable item-draggable"">',
  //pre append method
  initialize: function(){
    _.bindAll(this,"selectImage","setImage","init");
    $(this.el).attr('src', config.character_idtourl( this.item.get('character_id') ) );
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

      this.target = $(this.el).parent();

      $(this.el).parent().draggable({
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).dblclick(this.selectImage);
      this.setButton();
      this.showOutLine();
    }
    this.resetEffect(); 
  },

  selectImage: function(ev){
    console.log('selectimage');console.log(this);
    console.log(this.setImage);
    var picker = new Picker(this.setImage);
    picker.pickImage(ev);
  },

  setImage: function(img){
    this.item.set('character_id' , config.character_urltoid(img.src) );
    $(this.el).attr('src',img.src);

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
    // tmp
    $(this.el).parent().width(img.width).height(img.height);

    $(this.el).height(img.height).width(img.width);

    this.item.set('width' , img.width);
    this.item.set('height' , img.height);
  }

});
