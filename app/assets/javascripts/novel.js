//= require underscore
//= require backbone
//= require jquery.form
//= require wColorPicker.1.2.min
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./tools/textEdit
//= require ./tools/toolMenu
//= require ./tools/textEditTool
//= require ./tools/picker
//= require ./tools/effecter
//= require ./tools/console
//= require ./tools/wPaint



$(function() {
  
  var params = $('.novel_container').attr('id').split('/');
  var id = params[1];
  var mode = params[0];
  
  var isEditable = (mode == 'edit');
    
  var urls = location.href.split('/');

  
  var pass = urls.length > 5 ? urls[5] : null;  
  console.log(pass);

  initializeView(id,pass,isEditable);

  if(isEditable) initializeTool(isEditable);

});

// Parse the URL and set Novel model.
function setMode(){
    //http://ecomaki.com/novel/1
    //http://ecomaki.com/edit/1/[hash]
    //var urls = location.href.split('/');
    //var mode = urls[3];
    //var id = urls[4];
}

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

function initializeTool(isEditable){
  $('#toolbox').show();

  Picker.prototype.initialize();

  $('#preview').show();
  $('#preview').click(function(){
      isEditable = isEditable ? false : true;
      $('#content').empty();
      novelView = new NovelView({model: novel , isEditable: isEditable});
      novelView.appendTo($('#content'));
      if(isEditable) {
        //$('#preview').html('Preview');
        $('#toolbox').show();
      }else{
        //$('#preview').html('Edit');
        $('#toolbox').hide();
      }
    });
}

function onStaticBodyClick(ev){
  //console.log(ev);
  TextEditMenu.prototype.onBlur(ev);
  TextEdit.prototype.onBlur(ev);
  Picker.prototype.onBlur(ev);
}
