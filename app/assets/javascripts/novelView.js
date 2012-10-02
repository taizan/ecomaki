
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
  lastChapter: 0,
  chapterViews: [],
  initialize: function() {
    _.bindAll(this, "render","addOne","addAll","saveTitle","saveDescription","onScroll");

    var _self = this;

    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.render, this);
    this.model.chapters.bind('add', this.addOne);
    this.model.chapters.bind('refresh', this.addAll);

    $('#title').dblclick( function(){ editableTextarea(this,_self.saveTitle);});
    $('#description').dblclick(function(){editableTextarea(this,_self.saveDescription);});
    
    $(window).scroll(this.onScroll);
    console.log(this.model.chapters.models);
  },

  addOne: function (item,t,options) {
    console.log(item);
    console.log(options);
    view = new ChapterView({model: item , parentView: this });
    console.log(view.parentView);
    this.chapterViews.push(view);
    $(this.el).insertAt(options.index,view.render().el);

    if(this.chapterViews.length == 1) {
      view.onLoad();
      this.lastChapter =1;
    }
  },

  addAll: function () {
    $(this.el).empty();
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
    // detect currentchapter and isdisplayed
    // this should be in chapter view?
    /*
    var currentChapter = 0;
    for(var j = 0;j<this.chapterViews.length;j++){
      if(scroll > $(this.chapterViews[j].el).offset().top ){
        currentChapter = j;
      } 
    }
    console.log(currentChapter);
    if (this.lastCurrentChapter != currentChapter) {
        this.chapterViews[currentChapter].displayed(true);
        if(this.lastCurrentChapter) this.chapterViews[this.lastCurrentChapter].displayed(false);
        this.lastCurrentChapter = currentChapter;
    }
    */
  },
});
