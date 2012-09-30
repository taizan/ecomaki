$(function() {
  tool = new SketchTool();
  tool.appendTo('#novel_container');
  tool.setDefaultParet();
  tool.hide();

  //  $( "#chapterList" ).sortable();

  novel = new Novel({ id:1});

  novelView = new NovelView({model: novel});
  $('#content').append(novelView.el);

  isChapterHided = true;

  //init
  $("#sideMenu .nav-header").parent().find('li').hide();
  //$( "#sideMenu .nav-header").show();
  //$('#content').css({left:-200});

  $( "#sideMenu .nav-header").click(
    function(ev) {
      if(isChapterHided){
        $(this).parent().find('li').show();
        $('#content').css({left:0});
        isChapterHided = false;
      }else{
        $(this).parent().find('li').hide();
        $('#content').css({left:-200});
        $(this).show();
        isChapterHided = true;
      }
    });

  $("#picker").hide();
});
