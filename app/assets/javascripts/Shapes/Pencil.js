Config.Shapes["Pencil"] = {
	"drawDown": function(e, $this){
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
		
		"drawMove": function(e, $this)
		{
			$this.ctx.lineTo(e.pageX, e.pageY);
			$this.ctx.stroke();
		},
		
		"drawUp": function(e, $this)
		{
			$this.ctx.closePath();
		}
};
