//=require ./Shapes/Pencil
//=require ./Shapes/Line
//=require ./Shapes/Eraser
//=require ./Shapes/Ellipse
//=require ./Shapes/Rectangle
//=require ./Shapes/Chrome
//=require ./Shapes/Shape
//=require ./EditMenu

/******************************************
 *
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This wPaint jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @docs            http://www.websanova.com/plugins/websanova/paint
 * @version         Version x.x
 *
 ******************************************/
var debug = {};
(function($)
{
	/*** Bi-Directional Linked List for store/restore ***/
	var Node = {
		next: null,
		prev: null,
		canvas: null,
		tail: {}
	};

	//debug.tail = debug.head = Node.tail;
	var head = Node.tail;
	var target = null;
	var pushCanvas = function(canvas){
		var tmp = Object.create(Node);
		tmp.canvas = canvas;
		tmp.prev = head;
		head.next = tmp;

		head = tmp;
		//debug.head = head;
	};

	var storeCanvas = function(canvas){
		$(canvas).EditMenu('snapshot').EditMenu('edit');
		pushCanvas(canvas);
	};

	var copyCanvas = function(){
		//console.log("copy");
		target && $(target).EditMenu('copy');
	};

	var cutCanvas = function(){
		//console.log("cut");
		target && $(target).EditMenu('cut');
		pushCanvas(target);
	};

	var pasteCanvas = function(){
		//console.log("paste");
		target && $(target).EditMenu('paste');
		pushCanvas(target);
	};

	var restoreCanvas = function(){
		if(head && head.prev){
			$(head.canvas).EditMenu('undo');
			head = head.prev;
			//debug.head = head;
		}
	};

	var redoCanvas = function(){
		if(head.next){
			head = head.next;
			//debug.head;
			$(head.canvas).EditMenu('redo');
		}
	};

	var pressedKey = function(e){
		return (e.ctrlKey ? "ctrl-" : "") + (e.shiftKey ? "shift-" : "") + (e.altKey ? "alt-" : "") + e.keyCode;
	};

	var func = {
		/* key map
		 * "67" == 'c'
		 * "86" == 'v'
		 * "88" == 'x'
		 * "90" == 'z'
		 */
		"ctrl-90": restoreCanvas,
		"ctrl-shift-90": redoCanvas,
		"88": cutCanvas, 
		"67": copyCanvas,
		"86": pasteCanvas
	};

	$(document).keydown(function(e){
		//console.log(e);
		//console.log(pressedKey(e));
		//alert(e.keyCode);
		var f = func[pressedKey(e)];
		if(f){ f(); }
	});
	/*****************************************************/

	var shapes = ['Rectangle', 'Ellipse', 'Line', 'Text'];

	$.fn.wPaint = function(option, settings) // == $("#container").wPaint
	{
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option == 'string')
		{
			var data = this.data('_wPaint_canvas');
			var hit = true;

			if(data)
			{
				if(option == 'image' && settings === undefined) return data.getImage();
				else if(option == 'image' && settings !== undefined) data.setImage(settings);
				else if($.fn.wPaint.defaultSettings[option] !== undefined)
				{
					if(settings !== undefined) data.settings[option] = settings;
					else return data.settings[option];
				}
				else hit = false;
			}
			else hit = false;
			
			return hit;
		}
    

		//clean up some variables
		settings = $.extend({}, $.fn.wPaint.defaultSettings, settings || {});
		settings.lineWidthMin = parseInt(settings.lineWidthMin);
		settings.lineWidthMax = parseInt(settings.lineWidthMax);
		settings.lineWidth = parseInt(settings.lineWidth);
		settings.fontSizeMin = parseInt(settings.fontSizeMin);
		settings.fontSizeMax = parseInt(settings.fontSizeMax);
		settings.fontSize = parseInt(settings.fontSize);
	
    if(MainMenu.prototype.menu == null){
       MainMenu.prototype.init() ;
    }

		//appendShape(Canvas.prototype);
		//console.log(Canvas.prototype)

		//console.log(this)
		return this.each(function()
		{			
			var elem = $(this);
			var $settings = jQuery.extend(true, {}, settings);
			
			//test for HTML5 canvas
			var test = document.createElement('canvas');
			if(!test.getContext)
			{
				elem.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
				return false;	
			}
			
			var canvas = new Canvas($settings);
			var mainMenu = new MainMenu();
			var textMenu = new TextMenu();
			
			elem.append(canvas.generate(elem.width(), elem.height()));
			elem.append(canvas.generateTemp());
			elem.append(canvas.generateTextInput());
			
		
			mainMenu.generate(canvas)
			

			//init the snap on the text menu
			//mainMenu.moveTextMenu(mainMenu, textMenu);

			//init mode
			//mainMenu.set_mode(mainMenu, canvas, $settings.mode);
			
			
			
			if($settings.image) canvas.setImage($settings.image);
			
			elem.data('_wPaint_canvas', canvas);
		});
	}

	$.fn.wPaint.defaultSettings = {
		mode				: 'Pencil',			// drawing mode - Rectangle, Ellipse, Line, Pencil, Eraser
		lineWidthMin		: '0', 				// line width min for select drop down
		lineWidthMax		: '10',				// line widh max for select drop down
		lineWidth			: '2', 				// starting line width
		fillStyle			: {r:255, g:255, b:255, a:1.0},		// starting fill style
		strokeStyle			: {r:5, g:5, b:5, a:1.0},		// start stroke style
		fontSizeMin			: '8',				// min font size in px
		fontSizeMax			: '20',				// max font size in px
		fontSize			: '12',				// current font size for text input
		fontFamilyOptions	: ['Arial', 'Courier', 'Times', 'Trebuchet', 'Verdana'],
		fontFamily			: 'Arial',			// active font family for text input
		fontTypeBold		: false,			// text input bold enable/disable
		fontTypeItalic		: false,			// text input italic enable/disable
		fontTypeUnderline	: false,			// text input italic enable/disable
		//alpha				:	1.0,		// alpha blend
		image				: null,				// preload image - base64 encoded data
		drawDown			: null,				// function to call when start a draw
		drawMove			: null,				// function to call during a draw
		drawUp				: null				// function to call at end of draw
	};

	

	/**
	 * Canvas class definition
	 */
	function Canvas(settings)
	{
		Canvas.prototype.settings = settings;
    this.localSettings = settings;
		
		this.draw = false;

		this.canvas = null;
		this.ctx = null;

		this.canvasTemp = null;
		this.ctxTemp = null;
		
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		
		//this.textInput = null;
		Canvas.prototype.textInput = null;
		
		return this;
	}
	
	Canvas.prototype = 
	{
		//x,y,underlineY,underlineWidth
		/*fontOffsets: {
			'Arial'		: {'8': [2,2,-1,1], '9': [2,2,-1,1], '10': [2,2,-1,1], '11': [2,2,-1,1], '12': [2,3,-2,1], '13': [2,3,-2,1], '14': [2,2,-2,1], '15': [2,2,-1,1], '16': [2,2,-1,1], '17': [2,2,-2,1], '18': [2,3,-2,1], '19': [2,3,-2,1], '20': [2,3,-2,1]},
			'Courier'	: {'8': [2,1,-1,1], '9': [2,2,0,1], '10': [2,1,0,1], '11': [2,2,0,1], '12': [2,3,-1,1], '13': [2,2,0,1], '14': [2,2,0,1], '15': [2,2,-1,1], '16': [2,2,-1,1], '17': [2,2,0,1], '18': [2,1,0,1], '19': [2,2,-1,1], '20': [2,2,-1,1]},
			'Times'		: {'8': [2,2,-1,1], '9': [2,2,-1,1], '10': [2,2,-1,1], '11': [2,2,-1,1], '12': [2,3,-2,1], '13': [2,3,-2,1], '14': [2,2,-1,1], '15': [2,2,-1,1], '16': [2,2,-1,1], '17': [2,2,-2,1], '18': [2,3,-2,1], '19': [2,3,-2,1], '20': [2,3,-2,1]},
			'Trebuchet'	: {'8': [2,2,-1,1], '9': [2,2,-1,1], '10': [2,2,-1,1], '11': [2,2,-1,1], '12': [2,3,-2,1], '13': [2,3,-2,1], '14': [2,2,-1,1], '15': [2,2,-1,1], '16': [2,2,-1,1], '17': [2,2,-2,1], '18': [2,3,-2,1], '19': [2,3,-2,1], '20': [2,3,-2,1]},
			'Verdana'	: {'8': [2,2,-1,1], '9': [2,2,-1,1], '10': [2,2,-1,1], '11': [2,2,-1,1], '12': [2,3,-2,1], '13': [2,3,-2,1], '14': [2,2,-1,1], '15': [2,2,-1,1], '16': [2,2,-1,1], '17': [2,2,-2,1], '18': [2,3,-2,1], '19': [2,3,-2,1], '20': [2,3,-2,1]},
		},*/
		
		settings: {},
		textInput: null,
		/*******************************************************************************
		 * Generate canvases and events
		 *******************************************************************************/
		generate: function(width, height)
		{	
			canv = this.canvas = document.createElement('canvas');
      $(this.canvas).addClass('paint');
			this.ctx = this.canvas.getContext('2d');

			$(this.canvas).EditMenu('init', {callback: this.localSettings.EditMenuCallback});
			
			//create local reference
			var $this = this;
			var $canvas = $(this.canvas);
			
			$(this.canvas)
			.attr('width', width + 'px')
			.attr('height', height + 'px')
			.css({position: 'absolute', left: 0, top: 0})
			.mousedown(function(e)
			{ //this == canvas object
				//console.log(this);
				e.preventDefault();
				e.stopPropagation();
				//$canvas.EditMenu('snapshot').EditMenu('edit');
				storeCanvas(this);
				$this.draw = true;
				$this.callFunc(e, $this, 'Down');
        //console.log($this);
			})
			.mouseover(function(e){
				//console.log("over");
				target = this;
			})
			.mouseout(function(e){
				//console.log("out");
				if(target == this){ target = null; }
			});
			
			$(document)
			.mousemove(function(e)
			{
				if($this.draw) $this.callFunc(e, $this, 'Move');
			})
			.mouseup(function(e)
			{
				//make sure we are in draw mode otherwise this will fire on any mouse up.
				if($this.draw)
				{
					$this.draw = false;
					$this.callFunc(e, $this, 'Up');
				}
			});
			
			return $(this.canvas);
		},
		
		generateTemp: function()
		{
			this.canvasTemp = document.createElement('canvas');
			this.ctxTemp = this.canvasTemp.getContext('2d');
			
			$(this.canvasTemp).css({position: 'absolute', "z-index": 999999}).hide();
			
			return $(this.canvasTemp);
		},
		
		generateTextInput: function()
		{
			var $this = this;
			
			//$this.textCalc = $('<div></div>').css({display:'none', fontSize:this.settings.fontSize, lineHeight:this.settings.fontSize+'px', fontFamily:this.settings.fontFamily});
			
			//$this.textInput = 
			//$('<textarea class="_wPaint_textInput" spellcheck="false"></textarea>')
			//.css({display:'none', position:'absolute', color:this.settings.fillStyle, fontSize:this.settings.fontSize, lineHeight:this.settings.fontSize+'px', fontFamily:this.settings.fontFamily})

      //
			//if($this.settings.fontTypeBold) { $this.textInput.css('fontWeight', 'bold'); $this.textCalc.css('fontWeight', 'bold'); }
			//if($this.settings.fontTypeItalic) { $this.textInput.css('fontStyle', 'italic'); $this.textCalc.css('fontStyle', 'italic'); }
			//if($this.settings.fontTypeUnderline) { $this.textInput.css('textDecoration', 'underline'); $this.textCalc.css('textDecoration', 'underline'); }
			
			//$('body').append($this.textCalc);
			
			//return $this.textInput;
		},
		
		callFunc: function(e, $this, event)
		{
			//console.log($this)
			$e = jQuery.extend(true, {}, e);
			
			//console.log(e);
			//console.log($e);
			var canvas_offset = $($this.canvas).offset();
			
			$e.pageX = Math.floor($e.pageX - canvas_offset.left); // == $e.offsetX == e.offsetX
			$e.pageY = Math.floor($e.pageY - canvas_offset.top); // == $e.offsetY == e.offsetY
			
			// call call a general function before a specific function for each shape if it exists
			var mode = $.inArray($this.settings.mode, shapes) > -1 ? 'Shape' : $this.settings.mode;
			var func = $this['draw' + mode + '' + event];
			
			if(func) func($e, $this);

		  if($this.localSettings['draw' + event]) $this.localSettings['draw' + event].apply($this, [e, mode]);	
		},
		
		/*******************************************************************************
		 * save / load data
		 *******************************************************************************/
		getImage: function()
		{
			return this.canvas.toDataURL();
		},
		
		setImage: function(data)
		{
			var $this = this;
			
			var myImage = new Image();
			myImage.src = data;

			$this.ctx.clearRect(0, 0, $this.canvas.width, $this.canvas.height);			
			
			$(myImage).load(function(){
				$this.ctx.drawImage(myImage, 0, 0);
			});
		}
	}
	
	var appendShape = (function($canvas){
		$.each(Config.Shapes, function(name, shape){
			//console.log(name);
			//console.log(shape);
			$canvas["draw" + name + "Down"] = shape.drawDown;
			$canvas["draw" + name + "Move"] = shape.drawMove;
			$canvas["draw" + name + "Up"] = shape.drawUp;
		});
	})(Canvas.prototype);

	/**
	 * Main Menu
	 */
	function MainMenu()
	{
		this.menu = null;
		
		return this;
	}
	
	MainMenu.prototype = 
	{
    menu: null,
    //canvases: [],
    init: function(){
			var fillStyle		= {r:255, g:255, b:255, a:1};		// starting fill style
			var strokeStyle	= {r:5, g:5, b:5, a:1};		// start stroke style
			var fillButtonSize  = 15;
			var strokeButtonSize  = 24;

      var menuContent = $('<div id="paint_options" class="_wPaint_options"></div>')
           //.append($('<div class="_wPaint_icon _wPaint_text" title="text"></div>'))
           .append($('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'))
           .append($('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
           .append($('<label class="_wPaint_size_label _wPaint_label" >1px</label><div class="_wPaint_size_slider" title="ブラシサイズ Brush Size"></div>'))
           .append($('<label class="_wPaint_transparency_label _wPaint_label">100%</label><div class="_wPaint_transparency_slider" title="透明度　transparency"></div>'));
			$.each(Config.Shapes, function(name, shape){
					if( name.length > 0 && name != "Shape") menuContent.append($('<div class="_wPaint_icon' + ' _wPaint_' + name + ($.fn.wPaint.defaultSettings.mode == name ? ' active' : '') + '" title="'+ name + '"></div>'));
			});

     MainMenu.prototype.menu = $('#toolbox').append(menuContent);

			//@@@stroke|fill collor
			$("._wPaint_fillColorPicker").wColorPicker({
				mode: "click",
				initColor: config.rgb2hex(fillStyle),
				buttonSize: fillButtonSize,
				onSelect: function(color){
//          var canvases = MainMenu.prototype.canvases;
//          for( var i = 0 ; i < canvases.length ; i++){
//					  canvases[i].settings.fillStyle = color;
//					  canvases[i].textInput.css({color: color});
//          }
					$.each(config.hex2rgb(color), function(key, val){
						Canvas.prototype.settings.fillStyle = Canvas.prototype.settings.fillStyle || {};
						Canvas.prototype.settings.fillStyle[key] = val;
					});
					/* fix me ************************************************/
					//Canvas.prototype.textInput.css({color: color});
					/*********************************************************/
				}
			})
			$("._wPaint_strokeColorPicker").wColorPicker({
				mode: "click",
				initColor: config.rgb2hex(strokeStyle),
				buttonSize: strokeButtonSize,
				onSelect: function(color){
//          var canvases = MainMenu.prototype.canvases;
//          for( var i = 0 ; i < canvases.length ; i++){
//					  canvases[i].settings.strokeStyle = color;
//          }
					$.each(config.hex2rgb(color), function(key, val){
						Canvas.prototype.settings.strokeStyle = Canvas.prototype.settings.strokeStyle || {};
						Canvas.prototype.settings.strokeStyle[key] = val;
					});
				}
			});


    },
		generate: function(canvas)
		{
			var $canvas = canvas;
			var $this = this;

      //MainMenu.prototype.canvases.push($canvas);
			
	    this.menu = MainMenu.prototype.menu;		
			//content
			$.each(Config.Shapes, function(name, shape){
					if( name.length > 0 && name != "Shape") $("#paint_options ._wPaint_" + name).click(function(){ $this.set_mode($this, $canvas, name);})
			});
			//.find("._wPaint_text" ).click(function(){ $this.set_mode($this, $canvas, 'Text'); })
			$("#paint_options ._wPaint_size_slider").slider({
          min: 0,
          max: 100,
          value : 1,
          slide: function(evnt,ui){ 
//            var canvases = MainMenu.prototype.canvases;
//            for( var i = 0 ; i < canvases.length ; i++){
//					    canvases[i].settings.lineWidth = ui.value;
//            }
						Canvas.prototype.settings.lineWidth = ui.value;
            $("#paint_options ._wPaint_size_label").text(ui.value + "px");
          }
        })
			$("#paint_options ._wPaint_transparency_slider").slider({
          min: 0,
          max: 100,
          value : 100,
          slide: function(evnt,ui){ 
//            var canvases = MainMenu.prototype.canvases;
//            for( var i = 0 ; i < canvases.length ; i++){
//					    canvases[i].settings.alpha = ui.value/100;
//            }
					  Canvas.prototype.settings.strokeStyle.a = ui.value/100;
					  Canvas.prototype.settings.fillStyle.a = ui.value/100;
            $("#paint_options ._wPaint_transparency_label").text(ui.value + "%");
          }
        });
			
		},
		
		moveTextMenu: function(mainMenu, textMenu)
		{
			if(textMenu.docked)
			{
				textMenu.menu.css({left: parseInt(mainMenu.menu.css('left')) + textMenu.dockOffsetLeft, top: parseInt(mainMenu.menu.css('top')) + textMenu.dockOffsetTop});
			}
		},
		
		set_mode: function($this, $canvas, mode)
		{
			$canvas.settings.mode = mode;
			
			//if(mode == 'Text') $this.textMenu.menu.show();
			//else
			//{
				//$canvas.drawTextUp(null, $canvas);
				//$this.textMenu.menu.hide();
				//$canvas.textInput.hide();
			//}
			
			$this.menu.find("._wPaint_icon").removeClass('active');
			$this.menu.find("._wPaint_" + mode).addClass('active');
		}
	}
	
	/**
	 * Text Helper
	 */
	function TextMenu()
	{
		this.menu = null;
		
		this.docked = true;
		
		this.dockOffsetLeft = 0;
		this.dockOffsetTop = 36;
		
		return this;
	}
	
	TextMenu.prototype = 
	{
		generate: function(canvas, mainMenu)
		{
			var $canvas = canvas;
			var $this = this;
			
			//setup font sizes
			var options = '';
			for(var i=$canvas.settings.fontSizeMin; i<=$canvas.settings.fontSizeMax; i++) options += '<option value="' + i + '" ' + ($canvas.settings.fontSize == i ? 'selected="selected"' : '') + '>' + i + '</option>';
			
			var fontSize = $('<div class="_wPaint_fontSize _wPaint_dropDown" title="font size"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){ 
					var fontSize = parseInt($(this).val());
					$canvas.settings.fontSize = fontSize;
					$canvas.textInput.css({fontSize:fontSize, lineHeight:fontSize+'px'});
					$canvas.textCalc.css({fontSize:fontSize, lineHeight:fontSize+'px'});
				})
			)
			
			//setup font family
			var options = '';
			for(var i=0, ii=$canvas.settings.fontFamilyOptions.length; i<ii; i++) options += '<option value="' + $canvas.settings.fontFamilyOptions[i] + '" ' + ($canvas.settings.fontFamily == $canvas.settings.fontFamilyOptions[i] ? 'selected="selected"' : '') + '>' + $canvas.settings.fontFamilyOptions[i] + '</option>';
			
			var fontFamily = $('<div class="_wPaint_fontFamily _wPaint_dropDown" title="font family"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){ 
					var fontFamily = $(this).val();
					$canvas.settings.fontFamily = fontFamily;
					$canvas.textInput.css({fontFamily: fontFamily});
					$canvas.textCalc.css({fontFamily: fontFamily});
				})
			)
			
			//content
			var menuContent = 
			$('<div class="_wPaint_options"></div>')
			.append($('<div class="_wPaint_icon _wPaint_bold ' + ($canvas.settings.fontTypeBold ? 'active' : '') + '" title="bold"></div>').click(function(){ $this.setType($this, $canvas, 'Bold'); }))
			.append($('<div class="_wPaint_icon _wPaint_italic ' + ($canvas.settings.fontTypeItalic ? 'active' : '') + '" title="italic"></div>').click(function(){ $this.setType($this, $canvas, 'Italic'); }))
			.append($('<div class="_wPaint_icon _wPaint_underline ' + ($canvas.settings.fontTypeUnderline ? 'active' : '') + '" title="underline"></div>').click(function(){ $this.setType($this, $canvas, 'Underline'); }))
			.append(fontSize)
			.append(fontFamily)
			
			//handle
			var menuHandle = $('<div class="_wPaint_handle"></div>')
			
			//get position of canvas
			var offset = $($canvas.canvas).offset();
			
			//menu
			return this.menu = 
			$('<div class="_wPaint_menu"></div>')
			.css({display: 'none', position: 'absolute'})
			.draggable({
				snap: '._wPaint_menu', 
				handle: menuHandle,
				stop: function(){
					$.each($(this).data('draggable').snapElements, function(index, element){
						$this.dockOffsetLeft = $this.menu.offset().left - mainMenu.menu.offset().left;
						$this.dockOffsetTop = $this.menu.offset().top - mainMenu.menu.offset().top;
						$this.docked = element.snapping;
					}); 
				}
			})
			.append(menuHandle)
			.append(menuContent);
		},
		
		setType: function($this, $canvas, mode)
		{
			var element = $this.menu.find("._wPaint_" + mode.toLowerCase());
			var isActive = element.hasClass('active')
			
			$canvas.settings['fontType' + mode] = !isActive;
			
			isActive ? element.removeClass('active') : element.addClass('active');
			
			fontTypeBold = $canvas.settings.fontTypeBold ? 'bold' : 'normal';
			fontTypeItalic = $canvas.settings.fontTypeItalic ? 'italic' : 'normal';
			fontTypeUnderline = $canvas.settings.fontTypeUnderline ? 'underline' : 'none';
			
			$canvas.textInput.css({fontWeight: fontTypeBold}); $canvas.textCalc.css({fontWeight: fontTypeBold});
			$canvas.textInput.css({fontStyle: fontTypeItalic}); $canvas.textCalc.css({fontStyle: fontTypeItalic});
			$canvas.textInput.css({textDecoration: fontTypeUnderline}); $canvas.textCalc.css({textDecoration: fontTypeUnderline});
		}
	}
	
	//var tmp = Canvas.prototype.settings.strokeStyle;
//	setInterval(function(){
//		var tmp2 = Canvas.prototype.settings.strokeStyle;
//		console.log(tmp2);
//		console.log("-----------");
////		if(tmp && tmp2){
////			if( tmp.r != tmp2.r || tmp.g != tmp2.g || tmp.b != tmp2.b || tmp.a != tmp2.a ){
////				console.log("===========================================================");
////				console.log(tmp + " -> " + tmp2);
////				console.log("===========================================================");
////			}
////		}
//		//tmp = tmp2;
//	}, 1000);
})(jQuery);
