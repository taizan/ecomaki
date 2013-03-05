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
				"addOne",
				"addAll",
        "onAddChild",
				"appendTo",
				"load",
				"saveTitle",
				"saveDescription",
				"onScroll",
				"onScrollEnd",
				"onDisplay",
				"onPreDisplay",
				"onPostDisplay",
				"hideButton"
			);

    var _self = this;

    this.isEditable = args.isEditable;
    this.isPreview = args.isPreview;
		this.parentView = args.parentView;

    //this.model.bind('change', this.render, this);
    //this.model.bind('sync',this.render,this);
    this.model.bind('destroy', this.render, this);


    //not use because too heavy
    this.onInit(args);
  },

  onInit: function(args){},


  load: function(){
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


  onViewClick: function(ev){
    //console.log(ev.target);
    //console.log('click view');
    //TextEditMenu.prototype.finish();
    //TextEdit.prototype.onBlur(ev);
    //Picker.prototype.onBlur(ev);
    //ev.stopPropagation();
  },

  appendTo: function(target){
    $(this.el).appendTo(target);
    this.onAppend();
  },
	
  onAppend: function(){
    if(this.isLoaded )this.load();
  },


  addOne: function ( model , t , options ) {
    //console.log(item);
    var view = new (this.childViewType)({ model: model , parentView: this ,isEditable: this.isEditable , isPreview: this.isPreview});
    //console.log(view);
    this.childViews.push(view);
    $(this.elementList,this.el).insertAt(options.index,view.render().el);
    view.onAppend();
    this.onAddChild(view);
  },

  onAddChild: function(view){},

  addAll: function () {
    $(this.elementList,this.el).empty();
    this.childViews = [];
    _(this.childModels).each(this.addOne);

  },
	
  onChange: function(){
    //console.log("onchange");
  },


  saveTitle: function(txt){
    this.model.save('title',txt);
  },

  saveDescription: function(txt){
    this.model.save('description',txt);
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

    if( height <= window_height + scroll + offset ){
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
      var _self = this;
      $(this.el)
        .mouseover(function(){
          if(_self.isEditable){
     //       $(this).children(button).show();
            $(hide_button,_self.el).show();
          }
        })
        .mouseleave(function(ev){
        //  $(this).children(button).hide();
            //console.log($(ev.toElement).hasClass('ui-tooltip-content'));
            //console.log($(ev.toElement));
            if( !$(ev.toElement).hasClass('ui-tooltip-content')
                 && !$(ev.toElement).hasClass('ui-tooltip') ) {
              $(hide_button,_self.el).hide();
            }
        });
      $(hide_button,this.el).hide();
    }
    return this;
  },
	
});
