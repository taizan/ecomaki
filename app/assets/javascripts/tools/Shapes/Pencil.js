Config.Shapes["Pencil"] = {
	"drawDown": function(e, $this){
			//console.log($this.settings.strokeStyle)
			console.log($this.settings.strokeStyle)
			var ss = $.extend({}, $this.settings.strokeStyle);
			//ss.a = Math.pow(ss.a, 3.6);
			//ss.a = ss.a < 0.6 ? ss.a : Math.pow(ss.a,2);
			console.log(ss)
			$this.ctx.lineJoin = "round";
			$this.ctx.lineCap = "round";
			$this.ctx.strokeStyle = Config.prototype.rgba2string(ss);
			//console.log($this.ctx.strokeStyle);
			$this.ctx.fillStyle = Config.prototype.rgba2string(ss);
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
