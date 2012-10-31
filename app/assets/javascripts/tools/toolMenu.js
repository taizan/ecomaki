$(function(){
  toolMenu = new ToolMenu();
  toolMenu.init();
});


function ToolMenu(){}


ToolMenu.prototype = {
	tab : {},

	toolbox : null,

  init : function(){
		ToolMenu.prototype.tab["paint"] =
			//$('<div class="toolbox" id="paint_tab"><img src="/assets/paint/toolbox/base/light_gray.png"></img></div>');
			$('<div id="paint_tab"></div>');

		ToolMenu.prototype.tab["anim"] =
			//$('<div class="toolbox" id="anim_tab"><img src="/assets/paint/toolbox/base/light_gray.png"></img></div>');
			$('<div id="anim_tab"></div>');

		ToolMenu.prototype.tab["text"] =
			//$('<div class="toolbox" id="text_tab"><img src="/assets/paint/toolbox/base/light_gray.png"></img></div>');
			$('<div id="text_tab"></div>');

		ToolMenu.prototype.toolbox =
			$('<div id="toolbox"></dvi>')
				.css({position: 'fixed', left: 5, top: 100, width: 709, height: 67})
				.append($('<ul></ul>)')
					.append($('<li><a href="#paint_tab"><span class="ui-icon"></span></a></li>'))
					.append($('<li><a href="#anim_tab"><span class="ui-icon"></span></a></li>'))
					.append($('<li><a href="#text_tab"><span class="ui-icon"></span></a></li>')))
				.append(ToolMenu.prototype.tab["paint"])
				.append(ToolMenu.prototype.tab["anim"])
				.append(ToolMenu.prototype.tab["text"])
				.draggable()
				.tabs();
				//.show();

		$('body')
			.append(ToolMenu.prototype.toolbox);
  }

}
