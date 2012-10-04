
jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size();
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index);
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last());
  }
  return this;
};

var NovelView = Backbone.View.extend({
  className: 'novel',
  isEditable: false,
  lastChapter: 0,
  chapterViews: [],

  initialize: function(arg) {
    _.bindAll(this, "render","addOne","addAll","appendTo","saveTitle","saveDescription","addChapter","onScroll");

    var _self = this;

    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.render, this);
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);

    var template = _.template( $("#novel_template").html(),this.model.attributes);
    $(template).appendTo(this.el);
    //console.log(this.el);

    $(window).scroll(this.onScroll);
    //console.log(this.model.chapters.models);
  },

  events: {
    "click #add_chapter" : "addChapter",
  },

  appendTo: function(target){
    var _self = this;
    $(this.el).appendTo(target);

    if(this.isEditable){
      $('#title').dblclick( function(){ editableTextarea(this,_self.saveTitle);});
      $('#description').dblclick(function(){editableTextarea(this,_self.saveDescription);});
    }
  },

  addOne: function (item,t,options) {
    //console.log(item);
    view = new ChapterView({model: item , parentView: this ,isEditable: this.isEditable});
    this.chapterViews.push(view);
    $('.chapterList',this.el).insertAt(options.index,view.render().el);

    if(this.chapterViews.length == 1) {
      view.onLoad();
      this.lastChapter =1;
    }
  },

  addAll: function () {
    $('.chapterList',this.el).empty();
    this.chapterViews = [];

    _(this.model.chapters.models).each(this.addOne);

  },

  render: function() {
    $('#title .text').html(this.model.get('title'));
    $('#description .text').html(this.model.get('description'));
    this.addAll();
  },

  saveTitle: function(txt){
    this.model.set('title',txt);
    this.model.save();
  },

  saveDescription: function(txt){
    this.model.set('description',txt);
    this.model.save();
  },

  addChapter: function(e){
    console.log("addChapter");
    this.model.create_chapter();
  },

  onScroll: function(){
    var window_height = Config.prototype.getScreenSize().y;
    var height = document.documentElement.scrollHeight || document.body.scrollHeight;
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var offset = 100;
    //console.log(scroll + window_height + offset -  height);
    // load chapter if scroll to end 
    // too short chapter canbe bug reason
    if(height < window_height + scroll + offset){
      var i =this.lastChapter++;
      if(i < this.chapterViews.length ){
        this.chapterViews[i].onLoad();
        return this;
      }
    }
  },
});
