// Colorpicker UI

$(function(){
    function colorPicker(parent){
        this.parent = parent;
        this.color = {r:0, g:0, b:0, a:1};
        this.colorBarWidth = 255;
        this.colorBarHeight = 18;
        this.colorBarLeft = 23;
        this.colorBarTop = 13;
        this.colorBarMargin = this.colorBarHeight + 15;
        this.colorBarCss = {left: this.colorBarLeft + "px"};
        this.currentTab = "rgb";
        
        this.createRgbPicker();
        this.createBarBackground();
        this.drawRgbPicker();
        this.displayTab();
        this.bindColorChangeEvent();
        this.bindSelectTab();
    }

    colorPicker.prototype.createBarBackground = function(){
        this.barBackground = document.createElement("canvas");
        var size = 10;
        $(this.barBackground).attr({width: size, height: size});
        var ctx = this.barBackground.getContext("2d");
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "rgb(50,50,50)";
        ctx.fillRect(0, 0, size / 2, size / 2);
        ctx.fillRect(size / 2, size / 2, size, size);
    };

    colorPicker.prototype.bindSelectTab = function(){
        var thisInstance = this;
        $("#rgb_button").click(function(){
            $(".colorpicker_tab_button").removeClass("selected");
            $(this).addClass("selected");
            thisInstance.currentTab = "rgb";
            thisInstance.displayTab();
        });
        $("#hsl_button").click(function(){
            $(".colorpicker_tab_button").removeClass("selected");
            $(this).addClass("selected");
            thisInstance.currentTab = "hsl";
            thisInstance.displayTab();
        });
    };

    colorPicker.prototype.displayTab = function(){
        $(".colorpicker_tab").hide();
        switch(this.currentTab){
            case "rgb":
                $("#rgb_picker").show();
                break;
            case "hsl":
                $("#hsl_picker").show();
                break;
            case "wheel":
                $("#wheel_picker").show();
                break;
        }
    };

    colorPicker.prototype.getRgbString =function(color){
        return "rgb(" + Math.round(color.r) + "," +  Math.round(color.g) + "," + Math.round(color.b) + ")";
    };

    colorPicker.prototype.getRgbaString =function(color){
        return "rgba(" + Math.round(color.r) + "," +  Math.round(color.g) + "," + Math.round(color.b) + "," + Math.round(color.a * 100) / 100  + ")";
    };

    colorPicker.prototype.onMouseEvents = function(e, target){
        var x = e.offsetX || e.layerX || 0;
        var y = e.offsetY || e.layerY || 0;
        x = x < 0 ? 0 : x;
        x = x > 255 ? 255 : x;
        var hslColor = false;
        
        switch(e.type){
            case "mousedown":
                if(target == "a"){
                    this.color[target] = x / this.colorBarWidth;
                }else if(target == "h" || target == "s" || target == "l"){
                    hslColor = this.rgbToHsl(this.color);
                    hslColor[target] = x / this.colorBarWidth;
                    this.color = this.hslToRgb(hslColor);
                }else{
                    this.color[target] = x;
                }
                this.dragBar = target;
                //this.drawRgbPicker();
                this.setColor();
                break;

            case "mouseout":
            case "mouseup":
                this.dragBar = "";
                break;

            case "mousemove":
                if(target == this.dragBar){
                    if(target == "a"){
                        this.color[target] = x / this.colorBarWidth;
                    }else if(target == "h" || target == "s" || target == "l"){
                        hslColor = this.rgbToHsl(this.color);
                        hslColor[target] = x / this.colorBarWidth;
                        this.color = this.hslToRgb(hslColor);
                    }else{
                        this.color[target] = x;
                    }
                    //this.drawRgbPicker();
                    this.setColor();
                }
                break;
        }
        return false;
    };


    colorPicker.prototype.createRgbPicker = function(){
        var outoftag = $("#outoftag_picker").get(0);
        this.colorSample = document.createElement("div");
        var $colorSample = $(this.colorSample);
        $colorSample.css({borderStyle:"solid", borderColor:"#000000", borderWidth:"1px", position: "absolute", left: "25px", top: "47px", width: "50px", height: "30px"});
        $colorSample.appendTo($(outoftag));
        
        this.colorValue = document.createElement("div");
        var $colorValue = $(this.colorValue);
        $colorValue.css({position: "absolute", left: "90px", top: "52px", width: "80px", height: "20px", fontSize: "14px"});
        $colorValue.appendTo($(outoftag));
        
        var rgbParent = $("#rgb_picker").get(0);
        this.rCanvas = this.createBar("r", 0, rgbParent);
        this.gCanvas = this.createBar("g", 1, rgbParent);
        this.bCanvas = this.createBar("b", 2, rgbParent);
        this.aCanvas = this.createBar("a", 0, outoftag);
        
        var hslParent = $("#hsl_picker").get(0);
        this.hCanvas = this.createBar("h", 0, hslParent);
        this.sCanvas = this.createBar("s", 1, hslParent);
        this.lCanvas = this.createBar("l", 2, hslParent);
    };

    colorPicker.prototype.createBar = function(name, n, parent){
        $("<div>" + name.toUpperCase() + "</div>").css({position: "absolute", left: "8px", top: this.colorBarTop + this.colorBarMargin * n + 2 + "px", width: "30px", height: "20px", fontSize: "14px", fontFamily: "monospace"}).appendTo($(parent));
        
        var canvas = document.createElement("canvas");
        var $canvas = $(canvas);
        $canvas.attr({id: "__colorpicker_" + name + "_canvas", width: this.colorBarWidth, height: this.colorBarHeight});
        $canvas.addClass("colorbar");
        $canvas.css(this.colorBarCss);
        $canvas.css({top: this.colorBarTop + this.colorBarMargin * n + "px"});
        $canvas.appendTo($(parent));
        this.addEventsToBar($canvas, name);
        return canvas;
    };

    colorPicker.prototype.addEventsToBar = function($bar, option){
        var thisInstant1 = this;
        $bar.mousedown(function(e){thisInstant1.onMouseEvents(e, option);});
        $bar.mouseup(function(e){thisInstant1.onMouseEvents(e, option);});
        $bar.mouseout(function(e){thisInstant1.onMouseEvents(e, option);});
        $bar.mousemove(function(e){thisInstant1.onMouseEvents(e, option);});
    };
    
    colorPicker.prototype.bindColorChangeEvent = function(){
        var thisInstant1 = this;
        painter.onColorChange.push(function(color){
            thisInstant1.color = color;
            thisInstant1.drawRgbPicker();
        });
    };

    colorPicker.prototype.drawRgbPicker = function(){
        $(this.colorSample).css({backgroundColor: this.getRgbString(this.color)});
        $(this.colorValue).text(this.getRgbaString(this.color));

        var ctx;
        var colors;
        
        var hslColor = this.rgbToHsl(this.color);

        // r
        ctx = this.rCanvas.getContext("2d");
        colors = [{r: 0, g: this.color.g, b: this.color.b, a: 1},
                  {r: 255, g: this.color.g, b: this.color.b, a: 1}];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, this.color.r, this.rCanvas.height);

        // g
        ctx = this.gCanvas.getContext("2d");
        colors = [{r: this.color.r, g: 0, b: this.color.b, a: 1},
                  {r: this.color.r, g: 255, b: this.color.b, a: 1}];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, this.color.g, this.gCanvas.height);

        // b
        ctx = this.bCanvas.getContext("2d");
        colors = [{r: this.color.r, g: this.color.g, b: 0, a: 1},
                  {r: this.color.r, g: this.color.g, b: 255, a: 1}];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, this.color.b, this.bCanvas.height);

        // a
        ctx = this.aCanvas.getContext("2d");
        colors = [{r: this.color.r, g: this.color.g, b: this.color.b, a: 0},
                  {r: this.color.r, g: this.color.g, b: this.color.b, a: 1}];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, this.color.a * 255, this.aCanvas.height);
        
        // h
        ctx = this.hCanvas.getContext("2d");
        colors = [this.hslToRgb({h:0, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.03, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.07, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.10, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.13, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.17, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.20, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.23, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.27, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.30, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.33, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.37, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.40, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.43, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.47, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.50, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.53, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.57, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.60, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.63, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.67, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.70, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.73, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.76, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.80, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.83, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.86, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.90, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.93, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:.96, s:1, l:.5, a: 1}),
                  this.hslToRgb({h:1, s:1, l:.5, a: 1})];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, hslColor.h * 255, this.hCanvas.height);

        // s
        ctx = this.sCanvas.getContext("2d");
        colors = [this.hslToRgb({h:hslColor.h, s:0, l:hslColor.l, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:1, l:hslColor.l, a: 1})];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, hslColor.s * 255, this.sCanvas.height);

        // l
        ctx = this.lCanvas.getContext("2d");
        colors = [this.hslToRgb({h:hslColor.h, s:hslColor.s, l:0, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.1, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.2, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.3, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.4, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.5, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.6, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.7, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.8, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:.9, a: 1}),
                  this.hslToRgb({h:hslColor.h, s:hslColor.s, l:1, a: 1})];
        this.drawColorBar(ctx, colors);
        this.drawColorBarMark(ctx, hslColor.l * 255, this.lCanvas.height);

        
    };

    colorPicker.prototype.drawColorBar = function(ctx, colors){
        ctx.save();
        var pattern = ctx.createPattern(this.barBackground, "repeat");
        ctx.beginPath();
        ctx.fillStyle = pattern;
        ctx.fillStyle = grad;
        ctx.rect(0, 0, this.colorBarWidth, this.colorBarHeight);
        ctx.fill();
        ctx.restore();
        for(var i = 0; i < colors.length - 1; i++){
            var progress0 = i / (colors.length - 1);
            var progress1 = (i + 1) / (colors.length - 1);
            ctx.save();
            var grad  = ctx.createLinearGradient(progress0 * this.colorBarWidth, 0, progress1 * this.colorBarWidth, 0);
            grad.addColorStop(0, this.getRgbaString(colors[i]));
            grad.addColorStop(1, this.getRgbaString(colors[i + 1]));
            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.rect(progress0 * this.colorBarWidth, 0, progress1 * this.colorBarWidth+1, this.colorBarHeight);
            ctx.fill();
            ctx.restore();
        }
    };

    colorPicker.prototype.drawColorBarMark = function(ctx, x, height){
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#000000";
        ctx.moveTo(x - 3, 0);
        ctx.lineTo(x + 3, 0);
        ctx.lineTo(x, 3);
        ctx.closePath();
        ctx.moveTo(x - 3, height);
        ctx.lineTo(x + 3, height);
        ctx.lineTo(x, height - 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };


    colorPicker.prototype.hslToRgb = function(hslColor){
        function h2v(hh,min,max){
            hh = hh % 360;
            if (hh <  0) hh = hh + 360;
            if (hh <  60) return min + (max - min) * hh / 60;
            if (hh >= 60 && hh < 180) return max;
            if (hh >= 180 && hh < 240) return min + (max - min) * (240 - hh) / 60;
            return min;
        }
        var h = hslColor.h * 360;
        var s = hslColor.s;
        var l = hslColor.l;
        var a = hslColor.a;
        var r = 0;
        var g = 0;
        var b = 0;
        if (s < 0) s = 0;
        if (s > 1) s = 1;
        if (l < 0) l = 0;
        if (l > 1) l = 1;
        h = h % 360;
        if (h < 0) h = h + 360;
        if (l <= 0.5){
            cmin = l * ( 1 - s );
            cmax = 2 * l - cmin;
        }else{
            cmax = l * ( 1 - s ) + s;
            cmin = 2 * l - cmax;
        }
        r = h2v(h + 120, cmin, cmax);
        g = h2v(h, cmin, cmax);
        b = h2v(h - 120, cmin, cmax);
        return {r: r * 255, g: g * 255, b: b * 255, a: a};
    };

    colorPicker.prototype.rgbToHsl = function(rgbColor){
        var r = rgbColor.r / 255;
        var g = rgbColor.g / 255;
        var b = rgbColor.b / 255;
        var a = rgbColor.a;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var l = (max + min) / 2;
        var h = 0;
        var s = 0;
        if(max != min){
            if(l < .5){
               s= (max - min) / (max + min);
            }else{
               s=(max - min) / (2 - max - min);
            }
            if(r == max){
               h = (g - b) / (max - min) / 6;
            }
            if(g == max){
               h = (2.0 + (b - r) / (max - min)) / 6;
            }
            if(b == max){
               h = (4.0 + (r - g) / (max - min)) / 6;
            }
        }
        if(h < 0){
            h += 1;
        }
        return {h: h, s: s, l: l, a: a};
    };

    colorPicker.prototype.setColor = function(){
        painter.setColor(this.color);
    };

    new colorPicker($("#colorpicker").get(0));
    
    $(".colorpicker_tab_button").hover(
        function(){$(this).addClass("hover");},
        function(){$(this).removeClass("hover");}
    );
    $(".colorpicker_tab_button").mousedown(
        function(){$(this).addClass("pushed");}
    );
});
