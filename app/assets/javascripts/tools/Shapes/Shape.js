Config.Shapes["Shape"] = {
	"drawDown": function(e, $this){
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
			
			if(func) func(e, $this); // call specific function
	},
	"drawMove": function(e, $this){
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
				//console.log("drawmove");
			  var factor = $this.settings.mode == 'Line' ? 1 : 2;
			    
				e.x = half_line_width*factor;
				e.y = half_line_width*factor;
				e.w = width - $this.settings.lineWidth*factor;
				e.h = height - $this.settings.lineWidth*factor;
				
				$this.ctxTemp.fillStyle = Config.prototype.rgba2string($this.settings.fillStyle);
				$this.ctxTemp.strokeStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
				$this.ctxTemp.lineWidth = $this.settings.lineWidth*factor;
				
				func(e, $this); // call specific function
			}
	},
	"drawUp": function(e, $this){
				console.log("==================================");
				console.log($this.canvasTemp);
				console.log($this.canvasTempLeftNew);
				console.log($this.canvasTempTopNew);
				console.log($this.ctx.drawImage);
				console.log($this.ctx);
				console.log("==================================");
				$this.ctx.drawImage($this.canvasTemp ,$this.canvasTempLeftNew, $this.canvasTempTopNew);
				
				$($this.canvasTemp).hide();
				
				var func = $this['draw' + $this.settings.mode + 'Up'];
				if(func) func(e, $this); // call specific function
	}
}
