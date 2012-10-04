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

  initialize: function(arg){
    this._self = this;
    this.parentView = arg.parentView;
    //console.log(arg);
    //console.log(arg.parentView);
    _.bindAll(this, "render");
    _.bindAll(this,
        'click',
        'onScroll',
        'displayed',
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

    //cavas initialize
    this.sketch = new OverlaySketch($('canvas',this.el),this.model);
    this.sketch.init();
    
    $(window).scroll(this.onScroll);

    //this.render();
  },

  render: function(){

    var content = this.content;
    var _self = this._self;

    //     console.log('render');

    $('.item',this.el).remove();


    _(this.model.balloons.models).each(
      function(item){
        //console.log(item);
        var baloon = new BaloonItem(item , _self );
        baloon.appendTo( content);
      }
    );

    _(this.model.characters.models).each(
      function(item){
        //console.log(item);
        var image = new ImageItem(item ,  _self  );
        image.appendTo( content);
      }
    );

    //  console.log(this.model.get('canvas'));
    this.sketch.clear();
    this.sketch.loadImg(this.model.get('canvas'));

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
    $(this.el)
      .mouseover(function(){
        $(this).find(button).show();
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
    this.parentView.model.create_entry();
  },

  changeLayer: function(e){
    console.log("changeLayer");
    var canvas = $('canvas',this.el);
    var index = 5;

    $('.--btn-layer',this.el).toggleClass('btn-primary');

    if(canvas.zIndex() == index){ canvas.zIndex(0); }
    else{ canvas.zIndex(index); }
    console.log(canvas);
    $('#sketchTool').show();
    this.sketch.setImg();
    //  this.model.set('canvas' , this.sketch.getImg() );
    //  this.model.save();
  }
});
