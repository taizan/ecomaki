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
  //http://ecomaki.com/novel/1
  //http://ecomaki.com/edit/1/[hash]
  var urls = location.href.split('/');
  console.log(urls);
  var mode = urls[3]
  var id = urls[4];
  //console.log(id);
  console.log(mode);
  novel = new Novel({ id: id});
  //var isEditable = false;
  var isEditable = true;
  if(mode == 'edit') isEditable = true;
  //for debug only
  //if(urls.length > 5) isEditable = true;

  novelView = new NovelView({model: novel , isEditable: isEditable});
  novelView.appendTo($('#content'));


  $('#console').hide();  
  

  $("#picker").hide();
  $('#side_menu').hide();
});
