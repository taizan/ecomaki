//= require underscore
//= require backbone
//= require jquery.form
//= require wColorPicker.1.2.min
//
//= require ./models
//= require ./views/ecomakiView
//= require ./views/makerView/makerViews



$(function() {
  
  var id = $('.novel_container').attr('id');
  
  var isEditable = false;
    
  var urls = location.href.split('/');
  var pass = urls.length > 5 ? urls[5] : null;  
  //console.log(pass);

  initializeView(id,pass,isEditable);

  if(isEditable) initializeTool(isEditable);


  function initializeView(id,pass,isEditable){
    _novel = new Novel({id: id,password: pass});
    _novel.fetch({
      success: function(){
        _novelView = new MakerNovelView({model: _novel , isEditable: isEditable , isPreView: false});
        _novelView.appendTo($('#content'));
      }
     });



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
  }

});
