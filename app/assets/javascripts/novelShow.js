//= require underscore
//= require backbone
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./tools/textEditTool
//= require ./tools/effecter



$(function() {
  
  var id = $('.novel_container').attr('id');
  
  var isEditable = false; 
    
  //var urls = location.href.split('/');

  _novel = new Novel({id: id,password: null});
  _novelView = new NovelView({model: _novel , isEditable: isEditable , isPreView: false});
  _novelView.appendTo($('#content'));

  $(document).tooltip();

});




