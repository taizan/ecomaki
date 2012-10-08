$(function() {
  var urls = location.href.split('/');
  var id = urls[urls.length-1];
  //console.log(id);
  novel = new Novel({ id: id});
  var isEditable = true;

  //novelView = new NovelView({model: novel , isEditable: isEditable});
  //novelView.appendTo($('#content'));
  novelView = new NovelView({model: novel , isEditable: isEditable});

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
