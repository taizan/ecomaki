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
  var pass = urls.length > 5 ? urls[5] : null;  
  console.log(pass);

  initializeView(id,pass,isEditable);

});


function initializeView(id,pass,isEditable){
  novel = new Novel({id: id,password: pass});
  novelView = new NovelView({model: novel , isEditable: isEditable});
  novelView.appendTo($('#content'));

  $('#toolbox').hide();
  $('#console').hide();  
  $('#side_menu').hide();

  $(document).tooltip();
  $('#static_body').bind('mousedown',onStaticBodyClick);
}


function onStaticBodyClick(ev){
  //console.log(ev);
  TextEditMenu.prototype.onBlur(ev);
  TextEdit.prototype.onBlur(ev);
  Picker.prototype.onBlur(ev);
}
