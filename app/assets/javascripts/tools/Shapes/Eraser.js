Config.Shapes["Eraser"] = {
	"drawDown": function(e, $this){
			//$this.drawPencilDown(e, $this);
     	$this.ctx.lineJoin = "round";
			$this.ctx.lineCap = "round";
			$this.ctx.strokeStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
			$this.ctx.fillStyle = Config.prototype.rgba2string($this.settings.strokeStyle);
			$this.ctx.lineWidth = $this.settings.lineWidth;

     	//draw single dot in case of a click without a move
			$this.ctx.beginPath();
			$this.ctx.arc(e.pageX, e.pageY, $this.settings.lineWidth/2, 0, Math.PI*2, true);
			$this.ctx.closePath();
			$this.ctx.fill();

     	//start the path for a drag
			$this.ctx.beginPath();
			$this.ctx.moveTo(e.pageX, e.pageY);
			$this.ctx.globalCompositeOperation = 'destination-out';
	},
	"drawMove": function(e, $this){
			//$this.drawPencilMove(e, $this);
			$this.ctx.save();
			$this.ctx.globalCompositeOperation = 'destination-out';
			$this.ctx.lineTo(e.pageX, e.pageY);
			$this.ctx.stroke();
			$this.ctx.restore();
	},
	"drawUp": function(e, $this){
			//$this.drawPencilUp(e, $this);
	}
}
