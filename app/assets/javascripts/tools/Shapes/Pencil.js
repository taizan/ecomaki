Config.Shapes["Pencil"] = {
	"drawDown": function(e, $this){
			//console.log($this.canvas)
			console.log(e)
			$($this.canvasTemp)
				.css({left: 0, top: $this.canvas.top}) //I don't know why left = 0.
				.attr('width', $this.canvas.width)
				.attr('height', $this.canvas.height)
				.show()
			//console.log($this.settings.strokeStyle)
			//console.log($this.settings.strokeStyle)
			$this.ctxTemp.lineJoin = "round";
			$this.ctxTemp.lineCap = "round";
			$this.ctxTemp.strokeStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
			//console.log($this.ctxTemp.strokeStyle);
			$this.ctxTemp.fillStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
			$this.ctxTemp.lineWidth = $this.settings.lineWidth;
			
			//draw single dot in case of a click without a move
			$this.ctxTemp.beginPath();
			$this.ctxTemp.arc(e.pageX, e.pageY, $this.settings.lineWidth/2, 0, Math.PI*2, true);
			$this.ctxTemp.closePath();
			$this.ctxTemp.fill();
			
			//start the path for a drag
			$this.bpoint = [e.pageX, e.pageY];
			$this.vertices = [];
			console.log($this.ctxTemp);
		},
		
		"drawMove": function(e, $this)
		{
			$this.ctxTemp.clearRect(0, 0, $this.canvasTemp.width, $this.canvasTemp.height);
			$this.vertices.push([e.pageX, e.pageY]);
			//console.log($this.vertices)

			$this.ctxTemp.lineJoin = "round";
			$this.ctxTemp.lineCap = "round";
			$this.ctxTemp.strokeStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
			$this.ctxTemp.fillStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
			$this.ctxTemp.lineWidth = $this.settings.lineWidth;

			$this.ctxTemp.beginPath();
			$this.ctxTemp.moveTo($this.bpoint[0],$this.bpoint[1]);
			$.each($this.vertices, function(inx,point){
				$this.ctxTemp.lineTo(point[0],point[1]);
				//console.log(point);
			});
			$this.ctxTemp.stroke();
		},
		
		"drawUp": function(e, $this)
		{
			 $this.ctx.drawImage($this.canvasTemp, 0, 0);
			 $($this.canvasTemp).hide();
		}
};
