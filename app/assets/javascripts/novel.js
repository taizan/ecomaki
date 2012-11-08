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
//= require ./views/textEdit
//= require ./tools/toolMenu
//= require ./tools/picker
//= require ./tools/effecter
//= require ./tools/console
//= require ./tools/wPaint



$(function() {
  
  var isEditable = setMode();

  initializeView(isEditable);

  if(isEditable) initializeTool(isEditable);

});

// Parse the URL and set Novel model.
function setMode(){
    //http://ecomaki.com/novel/1
    //http://ecomaki.com/edit/1/[hash]
    var urls = location.href.split('/');
console.log(urls);    
    var mode = urls[3];
    var id = urls[4];
    var password = urls.length > 5 ? urls[5] : null;

    // Global novel model.
    novel = new Novel({id: id, password: password});

    var isEditable = (mode == 'edit');
    return isEditable;
}

function initializeView(isEditable){
  novelView = new NovelView({model: novel , isEditable: isEditable});
  novelView.appendTo($('#content'));

  $('#toolbox').hide();
  $('#console').hide();  
  $('#side_menu').hide();

  $(document).tooltip();
  $(document).click(onDocumentClick);
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

function onDocumentClick(ev){
  // this kind of selection is should be in blur itself not here
  //if( !$(ev.target).is('.sticky') && !$(ev.target).is('textarea') && !$(ev.target).is('.text')){
  //$('textarea').blur();
  TextEdit.prototype.onBlur(ev);
  //Picker.prototype.onBlur(ev);
  //if( !$(ev.target).is('#picker') && !$(ev.target).is('.picker_item') && !$(ev.target).is('.item_image')){
  Picker.prototype.onBlur(ev);
}
