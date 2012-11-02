
$(function(){
	
  // browser typr detection
  isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1);
  isIE = (navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0);
  isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
  if (isOpera) isIE = false;
  isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);

  // for IE console dose not define problem
  if (!window.console){
    window.console = {
      log : function(msg){
          // do nothing.
      }
    };
  }

  // for use template arguments
  // change deletemeter from <%= %> to {{ }}
  _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g,
      evaluate : /\{%(.+?)%\}/g,
  };
 

  // for easy call of config function
});


jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size();
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index);
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last());
  }
  return this;
};

config = new Config();

function Config()
{

}


var ctor = function(){};

Config.prototype.inherits = function(parent, protoProps, staticProps) {
  var child;

  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ parent.apply(this, arguments); };
  }

  _.extend(child, parent);

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();

  if (protoProps) _.extend(child.prototype, protoProps);
  if (staticProps) _.extend(child, staticProps);
  child.prototype.constructor = child;
  child.__super__ = parent.prototype;

  return child;
};

Config.prototype.character_image_idtourl = function(id) {
    return '/characters/images/' + id;
}

Config.prototype.character_image_urltoid =  function(url) {
    var elements = url.split('/');
    if (elements.length < 1)
  return null;
    return elements[elements.length-1];
}

Config.prototype.background_idtourl = function(id) {
    if(id != null){ return '/background_images/images/' + id + '.png';}
    else{return '/background_images/images/0.png';}
}

Config.prototype.background_urltoid =  function(url) {
    var elements = url.split('/');
    if (elements.length < 1)
        return null;
    return elements[elements.length-1];
}

Config.prototype.musics = [null, 'dream', 'flower', 'orange'];

Config.prototype.music_id_to_url = function(music_id) {
    return "https://dl.dropbox.com/u/8270034/sketch/bgm/" + Config.prototype.musics[music_id] + ".mp3";
}

Config.prototype.getScreenSize = function() {
  var obj = new Object();
  if (!isSafari && !isOpera) {
    obj.x = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
    obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
  } else {
    obj.x = window.innerWidth;
    obj.y = window.innerHeight;
  }
  obj.mx = parseInt((obj.x)/2);
  obj.my = parseInt((obj.y)/2);
  return obj;
}

Config.prototype.hex2rgb = function(hexColorString){
	// Argument's value is expected String value formed such as "#FFFFFF"
	// Return value is also Array of three Integers such as [255, 255, 255]
	return {
		r: parseInt( hexColorString.slice(1,1+2), 16 ),
    g: parseInt( hexColorString.slice(3,3+2), 16 ),
    b: parseInt( hexColorString.slice(5,5+2), 16 ) };
}

Config.prototype.rgb2hex = function(rgbObject){
  var xx = function(num){
    var str = num.toString(16);
    if(str.length == 1){
      return "0" + str;
    }else{
      return str;
    }
  }
  return "#" + xx(rgbObject.r) + xx(rgbObject.g) + xx(rgbObject.b);
}

Config.prototype.rgba2string = function(rgba){
	return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
}

Config.Shapes = {};
