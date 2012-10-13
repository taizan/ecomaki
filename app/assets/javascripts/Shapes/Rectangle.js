Config.Shapes["Rectangle"] = {
	"drawDown": function(e, $this){},
	"drawUp": function(e, $this){},
	"drawMove": function(e, $this){
		$this.ctxTemp.beginPath();
		$this.ctxTemp.rect(e.x, e.y, e.w, e.h)
		$this.ctxTemp.closePath();
		$this.ctxTemp.stroke();
		$this.ctxTemp.fill();
	}
};
