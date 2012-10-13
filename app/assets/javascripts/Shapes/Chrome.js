Config.Shapes["Chrome"] = {
	"drawDown": function(e, $this){
			//console.log($this.canvasTempLeftOriginal)
			//console.log($this.canvasTempTopOriginal)
			
			//start the path for a drag
			$this.canvasTempLeftOriginal = e.pageX;
			$this.canvasTempTopOriginal = e.pageY;
   		$this.ctx.lineWidth = 1 + $this.settings.lineWidth/10;
			//console.log($this.ctx.lineWidth);
			$this.ctx.lineCap = "round";
			$this.strokeColor = Config.prototype.hex2rgb($this.settings.strokeStyle);
//			[
//				parseInt( $this.settings.strokeStyle.slice(1,1+2), 16 ),
//				parseInt( $this.settings.strokeStyle.slice(3,3+2), 16 ),
//				parseInt( $this.settings.strokeStyle.slice(5,5+2), 16 ) ];
			//console.log($this.settings.strokeStyle);
			//$this.ctx.globalCompositeOperation = 'darker';
			//console.log($this.ctx.globalCompositeOperation);
			$this.ctx.beginPath();
		  $this.points = new Array();
			$this.count = 0;
			//console.log($this.ctx.strokeStyle);
	},
	"drawMove": function(e, $this){
			//console.error($this.ctx.strokeStyle);
		  $this.points.push([ e.pageX, e.pageY ]);
			$this.ctx.strokeStyle = Config.prototype.rgba2string( {r: $this.strokeColor.r , g: $this.strokeColor.g , b: $this.strokeColor.b , a: $this.settings.alpha });
			//console.log( Config.prototype.rgba2string( {r: $this.strokeColor.r , g: $this.strokeColor.g , b: $this.strokeColor.b , a: $this.settings.alpha }) == "rgba(" + $this.strokeColor.r + ", " + $this.strokeColor.g + ", " + $this.strokeColor.b + ", " + $this.settings.alpha + ")" );
			//console.log($this.ctx.strokeStyle);
			$this.ctx.moveTo($this.canvasTempLeftOriginal, $this.canvasTempTopOriginal);
			$this.ctx.lineTo(e.pageX, e.pageY);
			$this.ctx.stroke();

			(function(){
				var i, dx, dy, d;
				for (i = 0; i < $this.points.length; i++)
				{
					dx = $this.points[i][0] - $this.points[$this.count][0];
					dy = $this.points[i][1] - $this.points[$this.count][1];
					d = dx * dx + dy * dy;

					if (d < 1000){
						//$this.ctx.strokeStyle = Config.prototype.rgba2string( {r: Math.floor(Math.random() * $this.strokeColor.r) , g: Math.floor(Math.random() * $this.strokeColor.g) , b: Math.floor(Math.random() * $this.strokeColor.b) , a: $this.settings.alpha });
						//console.log($this.ctx.strokeStyle);
						//$this.ctx.beginPath();
						$this.ctx.moveTo( $this.points[$this.count][0] + (dx * 0.2), $this.points[$this.count][1] + (dy * 0.2));
						$this.ctx.lineTo( $this.points[i][0] - (dx * 0.2), $this.points[i][1] - (dy * 0.2));
						$this.ctx.stroke();
					}
				}
			})();
			$this.canvasTempLeftOriginal = e.pageX;
			$this.canvasTempTopOriginal = e.pageY;

			$this.count++;
	},
	"drawUp": function(e, $this){
	}
}
