$(function(){
  toolMenu = new ToolMenu();
  toolMenu.init();
});


function ToolMenu(){}


ToolMenu.prototype = {
	toolbox : null,

  init : function(){

		ToolMenu.prototype.toolbox =
			$('<div id="toolbox" class="editer_item"></dvi>')
				.css({position: 'fixed' });

		$('body')	.append(ToolMenu.prototype.toolbox);

    //default is hide
    $('#toolbox').hide();
  }

}
