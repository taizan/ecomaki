ecomakiView = Backbone.View.extend({
  isEditable: true,
  isPreview: false,

  isDisplay: false,
  isDisplayed: false,

  isLoaded: false,

  parentView: {},
  childViews: [],
  childModels: {},
  elementList: "",
  tmpl: "",
  childViewType: function(){},

  initialize: function(args) {
    _.bindAll(this, 
		    "onInit",
				"onLoad",
				"onAppend",
				"render",
				"renderAll",
				"addOne",
				"addAll",
        "onAddChild",
				"appendTo",
				"load",
        "setEditable",
				"onScroll",
				"onScrollEnd",
				"onDisplay",
				"onPreDisplay",
				"onPostDisplay",
        "setCharacterId",
				"hideButton",
        "getBackgroundSrc",
        "onAddOption",
        "destroyView"
			);

    this.isEditable = args.isEditable;
    this.isPreview = args.isPreview;
		this.parentView = args.parentView;

    ///this.model.bind('change', this.render, this);
    this.model.bind('destroy',this.destroyView);

    //not use because too heavy
    this.onInit(args);
  },

  onInit: function(args){},

  load: function(){
    //this.isEditable = isEditable;
		this.isLoaded = true;
    $(this.el).empty();
		var template = _.template( $(this.tmplId).html() , this.model.attributes);
    //console.log($(this.tmplId).html());
    $(template).appendTo(this.el);
    //console.log(this.el);

    $(window).scroll(this.onScroll);

    //this.hideButton();
    this.onLoad();
	},

  onLoad: function(){},


  appendTo: function(target){
    $(this.el).appendTo(target);
    this.onAppend();
  },
	
  onAppend: function(){
    if(this.isLoaded )this.load();
  },


  addOne: function ( model , t , options ) {
    //console.log(model);
    var view = new (this.childViewType)({ 
        model: model , 
        parentView: this ,
        isEditable: this.isEditable , 
        isPreview: this.isPreview
      });
    //console.log(view);
    this.childViews.push(view);
    $(this.elementList,this.el).insertAt(options.index,view.el);
    view.onAppend();
    this.onAddChild(view);
  },

  onAddChild: function(view){},

  addAll: function () {
    //console.log('refresh');
    $(this.elementList,this.el).unbind().empty();
    this.childViews = [];
    _(this.childModels).each(this.addOne);

  },
	
  onChange: function(){
    //console.log("onchange");
  },

  renderAll : function(){
    this.render();
    for(i =0; i < this.childViews.length; i++ ){
      if( this.childViews[i].renderAll ){
        this.childViews[i].renderAll();
      } else {
        this.childViews[i].render();
      }
    }
  },


  setEditable: function(target , attr){
    var self=this;
    $(target,self.el)
      .attr("contenteditable","true")
      .bind('input', function(){
        self.isEditing = true;
        console.log("oninput");
        //self.model.save();
      })
      .bind('blur', function(){
        if(self.isEditing){
          console.log("onsave");
          var txt = Config.prototype.escapeText($(target,self.el));
          self.model.save( attr, txt );
          self.isEditing = false;
        }
      });
  },


  // set text to target DOM from model.attributes 
  // if attr was empty , set def txet
  setTextTo: function(attr, target , def){
    var txt = this.model.get(attr);
    if(txt == "" || txt == "<br>"|| txt === null || txt === undefined){
      if(this.isEditable) { txt = def; } 
      else {  txt = ''; }
      $(target).html(txt.split('\n').join('<br>'));
    }
    else {
      $(target).html(txt.split('\n').join('<br>'));
    }
  },

  setCharacterId: function(id){
    var idList =  this.model.get("character_ids");
    if( idList ){
      var addFlag = true;
      for( var i =0; i< idList.length; i++ ){
        if(idList[i] == id) addFlag = false;
      }
      if( addFlag ) {
        idList.push(parseInt(id));
        this.model.save();
      }
    }
    if( this.parentView ){
      this.parentView.setCharacterId(id);
    }
  },

  onScroll: function(){
    var window_height = config.getScreenSize().y;
    var window_center_height = config.getScreenSize().my;
    var height = document.documentElement.scrollHeight || document.body.scrollHeight;
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var offset = 100;

    if( scroll < $(this.el).offset().top - window_center_height )
    {
      if(this.isDisplayed === true || this.isDisplay === true){ this.onPreDisplay();}
      this.isDisplayed = false;
      this.isDisplay = false;
    }else if( $(this.el).offset().top - window_center_height < scroll
        && scroll < $(this.el).offset().top - window_center_height + $(this.el).height() )
    {
      if(this.isDisplay === false){
        this.isDisplay = true;
        this.onDisplay();
        /*
        for ( var i = 0; i < this.childViews.length ; i++) {
          if(this.childViews.onScroll) {
             this.childViews[i].onScroll() ;
          }
        }
        */
        return true;
      }
    } else if( $(this.el).offset().top - window_center_height + $(this.el).height() < scroll) {
      if(this.isDisplayed === false){ this.onPostDisplay();}
      this.isDisplayed = true;
      this.isDisplay = false;
    }

    if(  $(this.el).offset().top - window_height + $(this.el).height() < scroll ){
      this.onScrollEnd();
    } 

    return false;
  },
	
	onDisplay: function(){},

	onPreDisplay: function(){},

	onPostDisplay: function(){},
	
	onScrollEnd: function(){},
	
 

  hideButton: function(){
    if(!this.isHideButton){
      this.isHideButton = true;
      var hide_button = '.hide_buttons';
      var button = '.buttons';
      var self = this;
      $(this.el)
        .mouseover(function(){
          if(self.isEditable){
     //       $(this).children(button).show();
            $(hide_button,self.el).show();
          }
        })
        .mouseleave(function(ev){
            //console.log($(ev.toElement));
            if( !$(ev.toElement).hasClass('ui-tooltip-content')
                 && !$(ev.toElement).hasClass('ui-tooltip') ) {
              $(hide_button,self.el).hide();
            }
        });
      $(hide_button,this.el).hide();
    }
    return this;
  },


  getBackgroundSrc: function(){
    var id = this.model.get('background_image_id');
    if( id < 0){
      return this.model.get('background_url');
    }else{
      return config.background_idtourl(id);
    }
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


  onAddOption: function(){
    var self = this;
    return {
      callback:function(){
        $(self.el).trigger('onAdd');
        $('.new_entry_handle',self.el).trigger('onAdd');
      }
    }
  },

 onRemove: function() {},

});
