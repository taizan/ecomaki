$(function(){
  toolMenu = new ToolMenu();
  toolMenu.init();
});


function ToolMenu(){}


ToolMenu.prototype = {
	toolbox : null,

  init : function(){

		ToolMenu.prototype.toolbox =
			$('#tool_tabs').tabs();

  }

}
