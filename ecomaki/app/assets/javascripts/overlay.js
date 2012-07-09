
SketchTool = function(){
};

SketchTool.prototype = {
    toolBody: '<div id="sketchTool"></div>',
    sliderBody: '<div id="slider"></div>',
    colorItemBody: '<li></li>',
    colorParetBody: '<ul id="paret"></ul>',
    exitButtonBody: '<input type="button" id="exit" value="exit" />',
    clearButtonBody: '<input type="button" id="clear" value="clear" />',
    appendTo: function(target){
        this.tool = $(this.toolBody);
        this.tool.appendTo(target);
	this.slider = $(this.sliderBody);
        this.slider.appendTo('#sketchTool');

	this.exitButton = $(this.exitButtonBody);
        this.exitButton.appendTo('#sketchTool');

	this.clearButton = $(this.clearButtonBody);
	this.clearButton.appendTo('#sketchTool');
    },
    addColor: function(color){
	var newColorItem = $(this.colorItem);
	newColorItem.css({'background-color':color});
	newColorItem.append('#paret');
    },
    hide: function(){
	this.tool.hide();
    },
    show: function(){
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
		e.preventDefault();
		OverlaySketch.prototype.context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
	    });

	$('#clear').click(function(e) {
		e.preventDefault();
		OverlaySketch.prototype.context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
	    });

	$('#exit').click(function() {
		//@TODO change method
		var d = canvas.toDataURL('image/png');
		d = d.replace('image/png', 'image/octet-stream');
		window.open(d, 'save');
	    });

    }
}
