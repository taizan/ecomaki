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
    return '/assets/' + id + '.png';
}

Config.prototype.background_urltoid =  function(url) {
    var elements = url.split('/');
    if (elements.length < 1)
        return null;
    return elements[elements.length-1];
}
