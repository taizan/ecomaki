
jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size()
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element)
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last())
  }
  return this;
}

  var NovelView = Backbone.View.extend({
      className: 'novel',
      initialize: function() {
          _.bindAll(this, "render","addOne","addAll");

          this.model.bind('change', this.render, this);
          this.model.bind('destroy', this.render, this);
          //this.chapter = new ChapterView( { model: this.model.chapters.models[0]} );
	  this.model.chapters.bind('add', this.addOne);
          this.model.chapters.bind('refresh', this.addAll);

          this.addAll();
          console.log(this.model.chapters.models);
      },

      addOne: function (item,t,options) {
          console.log(item);
          console.log("add chapter");
          view = new ChapterView({model: item});
          $(this.el).insertAt(options.index,view.render().el);
      },

      addAll: function () {
          $(this.el).empty();
          _(this.model.chapters.models).each(this.addOne);
      },

      render: function() {
          this.addAll();
      }
  });

