/******************************************
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
(function($)
{
	var shapes = ['Rectangle', 'Ellipse', 'Line', 'Text'];

	$.fn.wPaint = function(option, settings)
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
			
			$('body')
			.append(mainMenu.generate(canvas, textMenu))
			.append(textMenu.generate(canvas, mainMenu));

			//init the snap on the text menu
			mainMenu.moveTextMenu(mainMenu, textMenu);

			//init mode
			mainMenu.set_mode(mainMenu, canvas, $settings.mode);
			
			//pull from css so that it is dynamic
			var buttonSize = $("._wPaint_icon").outerHeight() - (parseInt($("._wPaint_icon").css('paddingTop').split('px')[0]) + parseInt($("._wPaint_icon").css('paddingBottom').split('px')[0]));
			
			mainMenu.menu.find("._wPaint_fillColorPicker").wColorPicker({
				mode: "click",
				initColor: $settings.fillStyle,
				buttonSize: buttonSize,
				onSelect: function(color){
					canvas.settings.fillStyle = color;
					canvas.textInput.css({color: color});
				}
			});
			
			mainMenu.menu.find("._wPaint_strokeColorPicker").wColorPicker({
				mode: "click",
				initColor: $settings.strokeStyle,
				buttonSize: buttonSize,
				onSelect: function(color){
					canvas.settings.strokeStyle = color;
				}
			});
			
			if($settings.image) canvas.setImage($settings.image);
			
			elem.data('_wPaint_canvas', canvas);
		});
	}

	$.fn.wPaint.defaultSettings = {
		mode				: 'Pencil',			// drawing mode - Rectangle, Ellipse, Line, Pencil, Eraser
		lineWidthMin		: '0', 				// line width min for select drop down
		lineWidthMax		: '10',				// line widh max for select drop down
		lineWidth			: '2', 				// starting line width
		fillStyle			: '#FFFFFF',		// starting fill style
		strokeStyle			: '#FFFF00',		// start stroke style
		fontSizeMin			: '8',				// min font size in px
		fontSizeMax			: '20',				// max font size in px
		fontSize			: '12',				// current font size for text input
		fontFamilyOptions	: ['Arial', 'Courier', 'Times', 'Trebuchet', 'Verdana'],
		fontFamily			: 'Arial',			// active font family for text input
		fontTypeBold		: false,			// text input bold enable/disable
		fontTypeItalic		: false,			// text input italic enable/disable
		fontTypeUnderline	: false,			// text input italic enable/disable
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
		this.settings = settings;
		
		this.draw = false;

		this.canvas = null;
		this.ctx = null;

		this.canvasTemp = null;
		this.ctxTemp = null;
		
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		
		this.textInput = null;
		
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
		
		/*******************************************************************************
		 * Generate canvases and events
		 *******************************************************************************/
		generate: function(width, height)
		{	
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			
			//create local reference
			var $this = this;
			
			$(this.canvas)
			.attr('width', width + 'px')
			.attr('height', height + 'px')
			.css({position: 'absolute', left: 0, top: 0})
			.mousedown(function(e)
			{
				e.preventDefault();
				e.stopPropagation();
				$this.draw = true;
				$this.callFunc(e, $this, 'Down');
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
			
			$(this.canvasTemp).css({position: 'absolute'}).hide();
			
			return $(this.canvasTemp);
		},
		
		generateTextInput: function()
		{
			var $this = this;
			
			$this.textCalc = $('<div></div>').css({display:'none', fontSize:this.settings.fontSize, lineHeight:this.settings.fontSize+'px', fontFamily:this.settings.fontFamily});
			
			$this.textInput = 
			$('<textarea class="_wPaint_textInput" spellcheck="false"></textarea>')
			.css({display:'none', position:'absolute', color:this.settings.fillStyle, fontSize:this.settings.fontSize, lineHeight:this.settings.fontSize+'px', fontFamily:this.settings.fontFamily})

			if($this.settings.fontTypeBold) { $this.textInput.css('fontWeight', 'bold'); $this.textCalc.css('fontWeight', 'bold'); }
			if($this.settings.fontTypeItalic) { $this.textInput.css('fontStyle', 'italic'); $this.textCalc.css('fontStyle', 'italic'); }
			if($this.settings.fontTypeUnderline) { $this.textInput.css('textDecoration', 'underline'); $this.textCalc.css('textDecoration', 'underline'); }
			
			$('body').append($this.textCalc);
			
			return $this.textInput;
		},
		
		callFunc: function(e, $this, event)
		{
			$e = jQuery.extend(true, {}, e);
			
			var canvas_offset = $($this.canvas).offset();
			
			$e.pageX = Math.floor($e.pageX - canvas_offset.left);
			$e.pageY = Math.floor($e.pageY - canvas_offset.top);
			
			var mode = $.inArray($this.settings.mode, shapes) > -1 ? 'Shape' : $this.settings.mode;
			var func = $this['draw' + mode + '' + event];	
			
			if(func) func($e, $this);
		},
		
		/*******************************************************************************
		 * draw any shape
		 *******************************************************************************/
		drawShapeDown: function(e, $this)
		{
			if($this.settings.mode == 'Text')
			{
				//draw current text before resizing next text box
				if($this.textInput.val() != '') $this.drawTextUp(e, $this);
				
				$this.textInput.css({left: e.pageX-1, top: e.pageY-1, width:0, height:0});
			}

			$($this.canvasTemp)
			.css({left: e.pageX, top: e.pageY})
			.attr('width', 0)
			.attr('height', 0)
			.show();

			$this.canvasTempLeftOriginal = e.pageX;
			$this.canvasTempTopOriginal = e.pageY;
			
			var func = $this['draw' + $this.settings.mode + 'Down'];
			
			if(func) func(e, $this);
		},
		
		drawShapeMove: function(e, $this)
		{
			var xo = $this.canvasTempLeftOriginal;
			var yo = $this.canvasTempTopOriginal;
			
			var half_line_width = $this.settings.lineWidth / 2;
			
			var left = (e.pageX < xo ? e.pageX : xo) - ($this.settings.mode == 'Line' ? Math.floor(half_line_width) : 0);
			var top = (e.pageY < yo ? e.pageY : yo) - ($this.settings.mode == 'Line' ? Math.floor(half_line_width) : 0);
			var width = Math.abs(e.pageX - xo) + ($this.settings.mode == 'Line' ? $this.settings.lineWidth : 0);
			var height = Math.abs(e.pageY - yo) + ($this.settings.mode == 'Line' ? $this.settings.lineWidth : 0);

			$($this.canvasTemp)
			.css({left: left, top: top})
			.attr('width', width)
			.attr('height', height)
			
			if($this.settings.mode == 'Text') $this.textInput.css({left: left-1, top: top-1, width:width, height:height});
			
			$this.canvasTempLeftNew = left;
			$this.canvasTempTopNew = top;
			
			var func = $this['draw' + $this.settings.mode + 'Move'];
			
			if(func)
			{
			    var factor = $this.settings.mode == 'Line' ? 1 : 2;
			    
				e.x = half_line_width*factor;
				e.y = half_line_width*factor;
				e.w = width - $this.settings.lineWidth*factor;
				e.h = height - $this.settings.lineWidth*factor;
				
				$this.ctxTemp.fillStyle = $this.settings.fillStyle;
				$this.ctxTemp.strokeStyle = $this.settings.strokeStyle;
				$this.ctxTemp.lineWidth = $this.settings.lineWidth*factor;
				
				func(e, $this);
			}
		},
		
		drawShapeUp: function(e, $this)
		{
			if($this.settings.mode != 'Text')
			{
				$this.ctx.drawImage($this.canvasTemp ,$this.canvasTempLeftNew, $this.canvasTempTopNew);
				
				$($this.canvasTemp).hide();
				
				var func = $this['draw' + $this.settings.mode + 'Up'];
				if(func) func(e, $this);
			}
		},
		
		/*******************************************************************************
		 * draw rectangle
		 *******************************************************************************/		
		drawRectangleMove: function(e, $this)
		{
			$this.ctxTemp.beginPath();
			$this.ctxTemp.rect(e.x, e.y, e.w, e.h)
			$this.ctxTemp.closePath();
			$this.ctxTemp.stroke();
			$this.ctxTemp.fill();
		},
		
		/*******************************************************************************
		 * draw ellipse
		 *******************************************************************************/
		drawEllipseMove: function(e, $this)
		{
			var kappa = .5522848;
			var ox = (e.w / 2) * kappa; 	// control point offset horizontal
			var  oy = (e.h / 2) * kappa; 	// control point offset vertical
			var  xe = e.x + e.w;           	// x-end
			var ye = e.y + e.h;           	// y-end
			var xm = e.x + e.w / 2;       	// x-middle
			var ym = e.y + e.h / 2;       	// y-middle
		
			$this.ctxTemp.beginPath();
			$this.ctxTemp.moveTo(e.x, ym);
			$this.ctxTemp.bezierCurveTo(e.x, ym - oy, xm - ox, e.y, xm, e.y);
			$this.ctxTemp.bezierCurveTo(xm + ox, e.y, xe, ym - oy, xe, ym);
			$this.ctxTemp.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			$this.ctxTemp.bezierCurveTo(xm - ox, ye, e.x, ym + oy, e.x, ym);
			$this.ctxTemp.closePath();
			if($this.settings.lineWidth > 0)$this.ctxTemp.stroke();
			$this.ctxTemp.fill();
		},
		
		/*******************************************************************************
		 * draw line
		 *******************************************************************************/	
		drawLineMove: function(e, $this)
		{				
			var xo = $this.canvasTempLeftOriginal;
			var yo = $this.canvasTempTopOriginal;
			
			if(e.pageX < xo) { e.x = e.x + e.w; e.w = e.w * -1}
			if(e.pageY < yo) { e.y = e.y + e.h; e.h = e.h * -1}
			
			$this.ctxTemp.lineJoin = "round";
			$this.ctxTemp.beginPath();
			$this.ctxTemp.moveTo(e.x, e.y);
			$this.ctxTemp.lineTo(e.x + e.w, e.y + e.h);
			$this.ctxTemp.closePath();
			$this.ctxTemp.stroke();
		},
		
		/*******************************************************************************
		 * draw pencil
		 *******************************************************************************/
		drawPencilDown: function(e, $this)
		{
			$this.ctx.lineJoin = "round";
			$this.ctx.lineCap = "round";
			$this.ctx.strokeStyle = $this.settings.strokeStyle;
			$this.ctx.fillStyle = $this.settings.strokeStyle;
			$this.ctx.lineWidth = $this.settings.lineWidth;
			
			//draw single dot in case of a click without a move
			$this.ctx.beginPath();
			$this.ctx.arc(e.pageX, e.pageY, $this.settings.lineWidth/2, 0, Math.PI*2, true);
			$this.ctx.closePath();
			$this.ctx.fill();
			
			//start the path for a drag
			$this.ctx.beginPath();
			$this.ctx.moveTo(e.pageX, e.pageY);
		},
		
		drawPencilMove: function(e, $this)
		{
			$this.ctx.lineTo(e.pageX, e.pageY);
			$this.ctx.stroke();
		},
		
		drawPencilUp: function(e, $this)
		{
			$this.ctx.closePath();
		},

		/*******************************************************************************
		 * draw text
		 *******************************************************************************/
		
		drawTextDown: function(e, $this)
		{
			$this.textInput.val('').show().focus();
		},
		
		drawTextUp: function(e, $this)
		{
			var fontString = '';
			if($this.settings.fontTypeItalic) fontString += 'italic ';
			//if($this.settings.fontTypeUnderline) fontString += 'underline ';
			if($this.settings.fontTypeBold) fontString += 'bold ';
			
			fontString += $this.settings.fontSize + 'px ' + $this.settings.fontFamily;
			
			//setup lines
			var lines = $this.textInput.val().split('\n');
			var linesNew = [];
			var textInputWidth = $this.textInput.width() - 2;
			
			var width = 0;
			var lastj = 0;
			
			for(var i=0, ii=lines.length; i<ii; i++)
			{
				$this.textCalc.html('');
				lastj = 0;
				
				for(var j=0, jj=lines[0].length; j<jj; j++)
				{
					width = $this.textCalc.append(lines[i][j]).width();
					
					if(width > textInputWidth)
					{
						linesNew.push(lines[i].substring(lastj,j));
						lastj = j;
						$this.textCalc.html(lines[i][j]);
					}
				}
				
				if(lastj != j) linesNew.push(lines[i].substring(lastj,j));
			}
			
			lines = $this.textInput.val(linesNew.join('\n')).val().split('\n');
			
			var offset = $this.textInput.position();
			var left = offset.left;// + parseInt($this.fontOffsets[$this.settings.fontFamily][$this.settings.fontSize][0] || 0);
			var top = offset.top;// + parseInt($this.fontOffsets[$this.settings.fontFamily][$this.settings.fontSize][1] || 0);
			var underlineOffset = 0;// = parseInt($this.fontOffsets[$this.settings.fontFamily][$this.settings.fontSize][2] || 0);
			
			for(var i=0, ii=lines.length; i<ii; i++)
			{
				$this.ctx.fillStyle = $this.settings.fillStyle;
				
				$this.ctx.textBaseline = 'top';
				$this.ctx.font = fontString;
				$this.ctx.fillText(lines[i], left, top);
				
				top += $this.settings.fontSize;
				
				if(lines[i] != '' && $this.settings.fontTypeUnderline)
				{
					width = $this.textCalc.html(lines[i]).width();
					
					//manually set pixels for underline since to avoid antialiasing 1px issue, and lack of support for underline in canvas
					var imgData = $this.ctx.getImageData(0, top+underlineOffset, width, 1);
					
					for (j=0; j<imgData.width*imgData.height*4; j+=4)
					{
						imgData.data[j] = parseInt($this.settings.fillStyle.substring(1,3), 16);
						imgData.data[j+1] = parseInt($this.settings.fillStyle.substring(3,5), 16);
						imgData.data[j+2] = parseInt($this.settings.fillStyle.substring(5,7), 16);
						imgData.data[j+3] = 255;
					}
					
					$this.ctx.putImageData(imgData, left, top+underlineOffset);
				}
			}
		},
		
		/*******************************************************************************
		 * eraser
		 *******************************************************************************/
		drawEraserDown: function(e, $this)
		{
			$this.ctx.save();
			$this.ctx.globalCompositeOperation = 'destination-out';
			$this.drawPencilDown(e, $this);
		},
		
		drawEraserMove: function(e, $this)
		{
		    $this.drawPencilMove(e, $this);
		},
		
		drawEraserUp: function(e, $this)
		{
			$this.drawPencilUp(e, $this);
			$this.ctx.restore();
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
		generate: function(canvas, textMenu)
		{
			var $canvas = canvas;
			this.textMenu = textMenu;
			var $this = this;
			
			//setup the line width select
			var options = '';
			for(var i=$canvas.settings.lineWidthMin; i<=$canvas.settings.lineWidthMax; i++) options += '<option value="' + i + '" ' + ($canvas.settings.lineWidth == i ? 'selected="selected"' : '') + '>' + i + '</option>';
			
			var lineWidth = $('<div class="_wPaint_lineWidth _wPaint_dropDown" title="line width"></div>').append(
				$('<select>' + options + '</select>')
				.change(function(e){ $canvas.settings.lineWidth = parseInt($(this).val()); })
			)
			
			//content
			var menuContent = 
			$('<div class="_wPaint_options"></div>')
			.append($('<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>').click(function(){ $this.set_mode($this, $canvas, 'Rectangle'); }))
			.append($('<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>').click(function(){ $this.set_mode($this, $canvas, 'Ellipse'); }))
			.append($('<div class="_wPaint_icon _wPaint_line" title="line"></div>').click(function(){ $this.set_mode($this, $canvas, 'Line'); }))
			.append($('<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>').click(function(){ $this.set_mode($this, $canvas, 'Pencil'); }))
			.append($('<div class="_wPaint_icon _wPaint_text" title="text"></div>').click(function(){ $this.set_mode($this, $canvas, 'Text'); }))
			.append($('<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>').click(function(e){ $this.set_mode($this, $canvas, 'Eraser'); }))
			.append($('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
			.append(lineWidth)
			.append($('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'))

			//handle
			var menuHandle = $('<div class="_wPaint_handle"></div>')
			
			//get position of canvas
			var offset = $($canvas.canvas).offset();
			
			//menu
			return this.menu = 
			$('<div class="_wPaint_menu"></div>')
			.css({position: 'absolute', left: offset.left + 5, top: offset.top + 5})
			.draggable({
				handle: menuHandle, 
				drag: function(){$this.moveTextMenu($this, $this.textMenu)}, 
				stop: function(){$this.moveTextMenu($this, $this.textMenu)}
			})
			.append(menuHandle)
			.append(menuContent);
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
			
			if(mode == 'Text') $this.textMenu.menu.show();
			else
			{
				$canvas.drawTextUp(null, $canvas);
				$this.textMenu.menu.hide();
				$canvas.textInput.hide();
			}
			
			$this.menu.find("._wPaint_icon").removeClass('active');
			$this.menu.find("._wPaint_" + mode.toLowerCase()).addClass('active');
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
})(jQuery);