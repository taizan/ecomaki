//= require jquery.jStageAligner
//position obj is there some nomal one?

var ctor = function(){};

function inherits(parent, protoProps, staticProps) {
  var child;

  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ parent.apply(this, arguments); };
  }

  _.extend(child, parent);

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();

  if (protoProps) _.extend(child.prototype, protoProps);
  if (staticProps) _.extend(child, staticProps);
  child.prototype.constructor = child;
  child.__super__ = parent.prototype;

  return child;
};

var EntryItem = function(item,view,isEditable){
  this.view = view;
  this.item = item;
  this.isEditable = isEditable;
  this.content = this.view.content;
  
  this.defaultInitialize.apply(this,arguments);

  this.initialize.apply(this,arguments);

};

EntryItem.extend = function (protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};

EntryItem.prototype = {
  // for over ride
  initialize: function(){},

  // for over ride
  tmpl: '',

  defaultInitialize: function(){
    _.bindAll(this,"onChange","onResize","onDragStart","onDragStop","appendTo","setButton","init");
    this.item.on('change',this.onChange);
    this.$el = $(this.tmpl);
    this.el = this.$el[0];

    this.$el
      .css({position: 'absolute', top: this.item.get('top'), left: this.item.get('left') })
      .width(this.item.get('width')).height(this.item.get('height'));
  },

  onChange: function(){
    //console.log('on item change');
    //this.item.save();
  },

  appendTo: function(target){
    this.$el.appendTo(target);
    this.el = this.$el[0];
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
  },

  onDragStop: function(){
    this.item.set('top' , $(this.el).offset().top - $(this.content).offset().top );
    this.item.set('left' , $(this.el).offset().left - $(this.content).offset().left );
    this.item.save();
    this.showButton();
  },

  setButton: function(target){
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
          $(this).find('.ui-resizable-handle').show();
        }
      })
      .mouseout(function(){
        button.hide();
        $(this).find('.ui-resizable-handle').hide();
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
    var parent = this.$el.parent();
    parent.find('.item-remove').css({ display: 'block' });
    parent.find('.ui-resizable-handle').css({ display: 'block'});
  },

  hideButton: function() {
    var parent = this.$el.parent();
    parent.find('.item-remove').css({ display: 'none' });
    parent.find('.ui-resizable-handle').css({ display: 'none'});
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

      $(this.el).draggable({
        containment: "parent",
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).resizable({
        containment: "parent",
        stop: this.onResize
      });

      $(this.el).dblclick(this.editText);
      this.setButton(this.el);
    }
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
    $(this.el).attr('src', Config.prototype.character_idtourl( this.item.get('character_id') ) );
  },
  //post append messod
  init: function(){
    if(this.isEditable){
      $(this.el).resizable({
        //  containment: "parent parent" ,
        aspectRatio: true,
        stop: this.onResize
      });

      $(this.el).parent().draggable({
        start: this.onDragStart,
        stop: this.onDragStop
      });

      $(this.el).dblclick(this.selectImage);
      this.setButton($(this.el).parent());
    }
  },

  selectImage: function(ev){
    console.log('selectimage');console.log(this);
    console.log(this.setImage);
    var picker = new Picker(this.setImage);
    picker.pickImage(ev);
  },

  setImage: function(img){
    this.item.set('character_id' , Config.prototype.character_urltoid(img.src) );
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
