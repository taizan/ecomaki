  isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1);
  isIE = (navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0);
  isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
  if (isOpera) isIE = false;
  isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);

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

