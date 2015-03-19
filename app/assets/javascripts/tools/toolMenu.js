$(function(){

function ToolMenu(){};


ToolMenu.prototype = {
	toolbox : null,

  init : function(){

		ToolMenu.prototype.toolbox =
			$('#tool_tabs').tabs();

  }

};

  toolMenu = new ToolMenu();
  toolMenu.init();

});

