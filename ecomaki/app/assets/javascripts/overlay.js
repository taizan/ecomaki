
SketchTool = function(){
};

SketchTool.prototype = {
    toolBody: '<div id="sketchTool"></div>',
    sliderBody: '<div id="slider"></div>',
    colorItemBody: '<li class="colorItem"></li>',
    colorParetBody: '<ul id="paret"></ul>',
    exitButtonBody: '<input type="button" id="exit" value="exit" />',
    clearButtonBody: '<input type="button" id="clear" value="clear" />',
    tool: [],
    appendTo: function(target){
        this.tool = $(this.toolBody);
	this.tool.css({ position: 'fixed' , background_color: 'gray'});
	this.paret = $(this.colorParetBody);
	this.slider = $(this.sliderBody);
        this.slider.slider();
	this.exitButton = $(this.exitButtonBody);
	this.clearButton = $(this.clearButtonBody);
        this.colorPicker = new colorPicker(this.tool);
	//this.colorPicker.hide();

        this.tool.draggable()
	    .append(this.slider)
            .append(this.exitButton)
            .append(this.clearButton)
	    .append(this.paret)
	    .appendTo(target);
        //this.slider.appendTo('#sketchTool');
        //this.exitButton.appendTo('#sketchTool');
	//this.clearButton.appendTo('#sketchTool');
        //this.paret.appendTo('#sketchTool');
        this.init();
    },
    init: function(){
    	this.exitButton.click(this.hide);
    },
    addColor: function(color){
	var newColorItem = $(this.colorItemBody);
	newColorItem.css({'background-color':color});
	newColorItem.appendTo('#paret');
        newColorItem
            .dblclick(function(event) { 
	     //      $('#colorPicker').show();
	     //	  coloerPicker.setTarget( event.target);
            })
            .click(function(e) {
                OverlaySketch.prototype.context.strokeStyle = $(this).css('background-color');
            });

    },
    setDefaultParet: function(){
	this.addColor('#000');
	this.addColor('#999');
	this.addColor('#f00');

	this.addColor('#0f0');
	this.addColor('#00f');
	this.addColor('#ff0');
	this.addColor('#fff');
    },
    hide: function(){
	this.tool.hide();
	$(this).parent().hide();
    },
    show: function(){
	$(this).parent().show();
	this.tool.show();
    }
}


// acanvas is jquery obj
OverlaySketch = function(acanvas){
    this.canvas = acanvas;
    this.canvasElem = this.canvas.get(0);
};


OverlaySketch.prototype = {

    brushSize: 1,
    offset: 0,
    flag: false,
    startX: 0,
    startY: 0,
    context: [], 
    init: function(){
		_.bindAll(this,'setImg','getImg');

        if(this.canvasElem.getContext) {
	    OverlaySketch.prototype.context = this.canvasElem.getContext('2d');
	}

	this.canvas.mousedown(function(e) {
                if(e.target.getContext) {
                    OverlaySketch.prototype.context = e.target.getContext('2d');
		}
     		t =OverlaySketch.prototype;
		t.flag = true;
		t.startX = e.pageX - $(this).offset().left - t.offset;
		t.startY = e.pageY - $(this).offset().top - t.offset;
		return false; // for chrome
	    });
	
	this.canvas.mousemove(function(e) {
		t = OverlaySketch.prototype;
		if (t.flag) {
		    endX = e.pageX - $(this).offset().left - t.offset;
                    endY = e.pageY - $(this).offset().top - t.offset;
		    // alert(e.pageX +','+ e.pageY + ' ; ' + $('canvas').offset().left  +','+$('canvas').offset().top);
                    t.context.lineWidth = t.brushSize;
		    t.context.lineJoin= "round";
		    t.context.lineCap = "round";
		    t.context.beginPath();
		    t.context.moveTo(t.startX, t.startY);
		    t.context.lineTo(endX, endY);
		    t.context.stroke();
		    t.startX = endX;
		    t.startY = endY;
		}
	    });
	
	this.canvas
            .on('mouseup', function() {
		    OverlaySketch.prototype.flag = false;
		})
	    .on('mouseleave', function() {
		    OverlaySketch.prototype.flag = false;
		});

	$("#slider").slider({
		    min: 0,
		    max: 100,
		    value : 1,
		    slide: function(evnt,ui){
		    OverlaySketch.prototype.brushSize = ui.value;
		}
	    });

        $('#paret li').click(function(e) {
		OverlaySketch.prototype.context.strokeStyle = $(this).css('background-color');
	    });

	$('#clear').click(function(e) {
		e.preventDefault();
		OverlaySketch.prototype.context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
	    });

	$('#exit').click(function() {
		//@TODO change method
		var d = this.canvas[0].toDataURL('image/png');
		d = d.replace('image/png', 'image/octet-stream');
		window.open(d, 'save');
	    });

    },
	clear:function(){
		OverlaySketch.prototype.context.clearRect(0, 0, $(this.canvas).width(), $(this.canvas).height());
	},
	
	getImg: function(){
		console.log(this.canvas[0]);
		var img = this.canvas[0].toDataURL();
		return img;
	},
	
	setImg: function(src){
		console.log('setimg');
		img = new Image();
		img.onload = function(){
			OverlaySketch.prototype.context.drawImage(img,0,0);
		}
		img.src = src;
	}
	
}
