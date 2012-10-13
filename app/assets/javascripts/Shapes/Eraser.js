Config.Shapes["Eraser"] = {
	"drawDown": function(e, $this){
			$this.ctx.save();
			$this.ctx.globalCompositeOperation = 'destination-out';
			$this.drawPencilDown(e, $this);
	},
	"drawMove": function(e, $this){
			$this.drawPencilMove(e, $this);
	},
	"drawUp": function(e, $this){
			$this.drawPencilUp(e, $this);
			$this.ctx.restore();
	}
}
