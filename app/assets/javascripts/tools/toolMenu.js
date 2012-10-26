$(function(){
  toolMenu = new ToolMenu();
  toolMenu.init();
});


function ToolMenu(){}


ToolMenu.prototype = {
  menu : null,

  init : function(){
	  var menuHandle = $('<div class="_tool_handle"></div>');

    ToolMenu.prototype.menu =  
        $('<div class="_tool_menu"></div>')
          .css({position: 'fixed', left:  5, top:  50})
          .draggable({
              handle: menuHandle,
            })
          .append(menuHandle)
      
    $('body').append(ToolMenu.prototype.menu);
  }

}
