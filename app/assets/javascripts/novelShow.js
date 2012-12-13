//= require underscore
//= require backbone
//= require jquery.form
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./tools/textEdit
//= require ./tools/textEditTool
//= require ./tools/effecter



$(function() {
  
  var id = $('.novel_container').attr('id');
  
  var isEditable = false;
    
  var urls = location.href.split('/');

  initializeView(id,null,isEditable);

});


function initializeView(id,pass,isEditable){
  _novel = new Novel({id: id,password: pass});
  _novelView = new NovelView({model: _novel , isEditable: isEditable});
  _novelView.appendTo($('#content'));

  $(document).tooltip();
}


