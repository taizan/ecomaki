//= require underscore
//= require backbone
//= require jquery.form
//= require wColorPicker.1.2.min
//
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
  
  var id = $('.novel_container').attr('id');
  
  var isEditable = true;
    
  var urls = location.href.split('/');
  var pass = urls.length > 5 ? urls[5] : null;  
  console.log(pass);

  initializeView(id,pass,isEditable);

  if(isEditable) initializeTool(isEditable);

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
        $('#preview p').html('Preview');
        $('#toolbox').show();
      }else{
        $('#preview p').html('Edit');
        $('#toolbox').hide();
      }
    });
  
  $('#publish').click(function(){ 
      novel.save({'status': 'publish'}); 
      alert("作品を公開しました！ソーシャルメディアなどで宣伝しましょう！"); 
    });
  
  //チュートリアルセットアップ
  var tutorial = $($('#tutorial_template').html())
    .appendTo('body')
    .dialog()
    .parent().css({ 'top': 40, 'left': 0 , 'position': 'fixed'});


  var tutorial_progless = 0;

  // チュートリアルの進む
  //
  $('#tutorial_next_button').click( function() {
    tutorial_progless++;
    var next = $('#tutorial_template_' + tutorial_progless ).html();
    if( next) {
      $('#tutorial_content').html( next )
      console.log($('#tutorial_template_' + tutorial_progless ).html());
      $('#tutorial_back_button').show();
    }
    else{
      $('#tutorial_content').html( 'End' );
      $('#tutorial_next_button').hide();
    }
  });

  // チュートリアルの戻る
  $('#tutorial_back_button').click( function() {
    tutorial_progless--;
    var prev = $('#tutorial_template_' + tutorial_progless ).html();
    if( prev) {
      $('#tutorial_content').html( next )
      console.log($('#tutorial_template_' + tutorial_progless ).html());
      $('#tutorial_next_button').show();
    }
    else{
      $('#tutorial_content').html( $('#tutorial_template_0' ).html() );
      $('#tutorial_back_button').hide(); 
    }
  });

  //console.log($('#tutorial_template').html());
}

function onStaticBodyClick(ev){
  //console.log(ev);
  TextEditMenu.prototype.onBlur(ev);
  TextEdit.prototype.onBlur(ev);
  Picker.prototype.onBlur(ev);
}
