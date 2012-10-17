ecomakiView = Backbone.View.extend({
  isEditable: true,

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
		this.parentView = args.parentView;

    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.render, this);


		//call each vie initialize
    this.onInit(args);
  },

  onInit: function(args){},


  load: function(){
		this.isLoaded = true;
		var template = _.template( $(this.tmplId).html(),this.model.attributes);
    $(template).appendTo(this.el);
    console.log(this.el);
    $(window).scroll(this.onScroll);

    this.hideButton();
    this.onLoad();

	},

  onLoad: function(){},


  events: {
    
  },

  appendTo: function(target){
    $(this.el).appendTo(target);
    this.onAppend();
  },
	
  onAppend: function(){
    if(this.isLoaded)this.load();
  },


  addOne: function (item,t,options) {
    //console.log(item);
    view = new (this.childViewType)({model: item , parentView: this ,isEditable: this.isEditable});
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
    this.model.set('title',txt);
    this.model.save();
  },

  saveDescription: function(txt){
    this.model.set('description',txt);
    this.model.save();
  },



  onScroll: function(){
    var window_height = config.getScreenSize().y;
    var window_center_height = config.getScreenSize().my;
    var height = document.documentElement.scrollHeight || document.body.scrollHeight;
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var offset = 100;

    if( scroll < $(this.el).offset().top - window_center_height )
    {
      if(this.isDisplayed == true || this.isDisplay == true){ this.onPreDisplay();}
      this.isDisplayed = false;
      this.isDisplay = false;
    }else if( $(this.el).offset().top - window_center_height < scroll
        && scroll < $(this.el).offset().top - window_center_height + $(this.el).height() )
    {
      if(this.isDisplay == false){
        this.isDisplay = true;
        this.onDisplay();
      }
    } else if( $(this.el).offset().top - window_center_height + $(this.el).height() < scroll) {
      if(this.isDisplayed == false){ this.onPostDisplay();}
      this.isDisplayed = true;
      this.isDisplay = false;
    }

    if( height <= window_height + scroll + offset ){
      this.onScrollEnd();
    }

  },
	
	onDisplay: function(){},

	onPreDisplay: function(){},

	onPostDisplay: function(){},
	
	onScrollEnd: function(){},
	
	
  hideButton: function(){
    var button = '.buttons';
    var _self = this;
    $(this.el)
      .mouseover(function(){
        if(_self.isEditable){
          $(this).children(button).show();
        }
      })
      .mouseout(function(){
        $(this).children(button).hide();
      })
      .find(button).hide();
    return this;
  },
	
});
