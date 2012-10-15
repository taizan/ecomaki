$(function(){
  isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1);
  isIE = (navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0);
  isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
  if (isOpera) isIE = false;
  isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);

  if (!window.console){
    window.console = {
      log : function(msg){
          // do nothing.
      }
    };
  }
  
  config = new Config();
});

function Config()
{

}

Config.prototype.character_idtourl = function(id) {
    return '/characters/image/' + id;
}

Config.prototype.character_urltoid =  function(url) {
    var elements = url.split('/');
    if (elements.length < 1)
  return null;
    return elements[elements.length-1];
}

Config.prototype.background_idtourl = function(id) {
    if(id != null){ return '/assets/' + id + '.png';}
    else{return '/assets/0.png';}
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
