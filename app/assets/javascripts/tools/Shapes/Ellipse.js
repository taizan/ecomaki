Config.Shapes["Ellipse"] = {
	"drawDown": function(e, $this){
	},
	"drawUp": function(e, $this){
	},
	"drawMove": function(e, $this){
		var kappa = .5522848;
		var ox = (e.w / 2) * kappa;   // control point offset horizontal
		var  oy = (e.h / 2) * kappa;  // control point offset vertical
		var  xe = e.x + e.w;            // x-end
		var ye = e.y + e.h;             // y-end
		var xm = e.x + e.w / 2;         // x-middle
		var ym = e.y + e.h / 2;         // y-middle

		$this.ctxTemp.beginPath();
		$this.ctxTemp.moveTo(e.x, ym);
		$this.ctxTemp.bezierCurveTo(e.x, ym - oy, xm - ox, e.y, xm, e.y);
		$this.ctxTemp.bezierCurveTo(xm + ox, e.y, xe, ym - oy, xe, ym);
		$this.ctxTemp.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		$this.ctxTemp.bezierCurveTo(xm - ox, ye, e.x, ym + oy, e.x, ym);
		$this.ctxTemp.closePath();
		if($this.settings.lineWidth > 0)$this.ctxTemp.stroke();
		$this.ctxTemp.fill();
	}
}
