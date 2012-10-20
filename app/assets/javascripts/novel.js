//= require underscore
//= require backbone
//= require wColorPicker.1.2.min
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./views/textEdit
//= require ./tools/toolMenu
//= require ./tools/picker
//= require ./tools/effecter
//= require ./tools/console
//= require ./tools/wPaint



$(function() {
  var urls = location.href.split('/');
  var id = urls[urls.length-1];
  //console.log(id);
  novel = new Novel({ id: id});
  var isEditable = true;

  //novelView = new NovelView({model: novel , isEditable: isEditable});
  //novelView.appendTo($('#content'));
  novelView = new NovelView({model: novel , isEditable: isEditable});
  novelView.appendTo($('#content'));

  $('#editButton').click( function() {
        if(isEditable){
          isEditable = false;
        }else{
          isEditable = true;    
        }
        $('#content').empty();
        novelView = new NovelView({model: novel , isEditable: isEditable});
        novelView.appendTo($('#content'));
  if(isEditable){
    $('._wPaint_menu').show();
    //$('#console').show();  
  }
  else{
    $('._wPaint_menu').hide();
  }
} ).css({zIndex: 9999});

    $('#console').hide();  
  //$('#content').append(novelView.el);
  
  

  $("#picker").hide();
  $('#side_menu').hide();
});
