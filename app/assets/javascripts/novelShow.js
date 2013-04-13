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



$(function(d,s,id) {
  
  var id = $('.novel_container').attr('id');
  
  var isEditable = false; 
    
  //var urls = location.href.split('/');

  _novel = new Novel({id: id,password: null});
  _novel.fetch({
    success: function(){
      if(_novel.get('status') == "publish"){
        _novelView = new NovelView({model: _novel , isEditable: isEditable , isPreView: false});
        _novelView.appendTo($('#content'));
       }
       else{
        alert('公開されていません。');
        _novel = null;
       }
    }
  });


  $(document).tooltip();
  
  //$('#social_template').appendTo('body');

});

