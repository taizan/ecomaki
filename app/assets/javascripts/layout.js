$(function(){
    $('#bookmarks').hide();
    $('.navbar')
      .mouseover(function(){
        $('#bookmarks').show();
      })
      .mouseout(function(){
        $('#bookmarks').hide();
      });
  
})
