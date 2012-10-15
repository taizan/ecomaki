Config.Shapes["Line"] = {
	"drawDown": function(e, $this){
	},
	"drawMove": function(e, $this){
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
	"drawUp": function(e, $this){
	}
}
