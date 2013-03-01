//= require underscore
//= require backbone
//= require jquery.form
//= require wColorPicker.1.2.min
//
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/entryTemplate
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
  
  var isEditable = false;
    
  var urls = location.href.split('/');
  var pass = urls.length > 5 ? urls[5] : null;  
  //console.log(pass);

  initializeView(id,pass,isEditable);

  if(isEditable) initializeTool(isEditable);


  /*
  window.onbeforeunload = function () {
        if (document.title.indexOf("*") != -1) {
                    return ("You have unsaved changes...");
        }
  }
  window.onunload=function() {
    alert();
    return confirm('Are you sure you want to leave the current page?');
    
  }

  $(window).unload( function () { alert("Bye now!"); } );
  */
                                
  function initializeView(id,pass,isEditable){
    _novel = new Novel({id: id,password: pass});
    _novelView = new NovelView({model: _novel , isEditable: isEditable , isPreview: true});
    _novelView.appendTo($('#content'));


    $('#static_body').bind('mousedown',onStaticBodyClick);

  }

  function initializeTool(isEditable){

    $('#publish_button').click(function(){ 
        _novel.save({'status': 'publish'}); 
        alert("作品を公開しました！ソーシャルメディアなどで宣伝しましょう！"); 
      });

      setTutorial();
  }

  function onStaticBodyClick(ev){
    //console.log(ev);
    TextEditMenu.prototype.onBlur(ev);
    TextEdit.prototype.onBlur(ev);
    Picker.prototype.onBlur(ev);
  }

});
