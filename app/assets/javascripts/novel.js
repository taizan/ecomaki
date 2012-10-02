$(function() {
  var urls = location.href.split('/');
  var id = urls[urls.length-1];
  console.log(id);
  novel = new Novel({ id: id});

  novelView = new NovelView({model: novel});
  $('#content').append(novelView.el);
  

  tool = new SketchTool();
  tool.appendTo('#novel_container');
  tool.setDefaultParet();
  tool.hide();
  

  $("#picker").hide();
  $('#side_menu').hide();
});
