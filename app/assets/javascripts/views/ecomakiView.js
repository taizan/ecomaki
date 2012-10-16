ecomakiView = Backbone.View.extend({
  isEditable: true,
  isDisplayed: false,
  parentView: {},
  childViews: [],
  elementList: "",
  tmpl: "",
  childViewType: {},

  initialize: function(args) {
    _.bindAll(this, 
		    "onInit",
				"onAppend",
				"render",
				"addOne",
				"addAll",
				"appendTo",
				"saveTitle",
				"saveDescription",
				"onScroll",
				"onScrollEnd",
				"onDisplay",
				"hideButton"
			);

    var _self = this;

    this.isEditable = args.isEditable;
		this.parentView = args.parentView;

    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.render, this);


    var template = _.template( $(this.tmplId).html(),this.model.attributes);
    $(template).appendTo(this.el);
    //console.log(this.el);

    $(window).scroll(this.onScroll);
    //console.log(this.model.chapters.models);
		
		this.hideButton();
		
		//call each vie initialize
    this.onInit(args);
  },

  onInit: function(args){},

  onAppend: function(){},

  events: {
    
  },

  appendTo: function(target){
    var _self = this;
    $(this.el).appendTo(target);

    this.onAppend();
    //this.render();
  },

  addOne: function (item,t,options) {
    //console.log(item);
    view = new (this.childViewType)({model: item , parentView: this ,isEditable: this.isEditable});
    this.childViews.push(view);
    $(this.elementList,this.el).insertAt(options.index,view.render().el);

    //for detect scroll amount 
    this.onScroll();
  },

  addAll: function () {
    $(this.elementList,this.el).empty();
    this.childViews = [];

    _(this.model.chapters.models).each(this.addOne);

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

    if( $(this.el).offset().top - window_center_height < scroll
        && scroll < $(this.el).offset().top - window_center_height + $(this.el).height() )
    {
      if(this.isDisplayed == false){
        this.isDisplayed = true;
        this.onDisplay();
      }
    } else if(this.isDisplayed) {
      this.isDisplayed = false;
    }

    if(height <= window_height + scroll + offset ){
      this.onScrollEnd();
    }

  },
	
	onDisplay: function(){},
	
	onScrollEnd: function(){},
	
	
  hideButton: function(){
    var button = '.buttons';
    var _self = this;
    $(this.el)
      .mouseover(function(){
        if(_self.isEditable){
          $(this).find(button).show();
        }
      })
      .mouseout(function(){
        $(this).find(button).hide();
      })
      .find(button).hide();
    return this;
  },
	
});
