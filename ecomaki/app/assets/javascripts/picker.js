//= require jquery.jStageAligner


function loadXml(url,func){
    //alert("load");
    $.ajax({
        url:url,
        type:'get',
        dataType:'xml',
        timeout:1000,
        success:func
    });
}


function getActualDimension(image) {
    var run, mem, w, h, key = "actual";
 
    // for Firefox, Safari, Google Chrome
         if ("naturalWidth" in image) {
                 return {width: image.naturalWidth, height: image.naturalHeight};
         }
         if ("src" in image) { // HTMLImageElement
                 if (image[key] && image[key].src === image.src) {return  image[key];}
                             
                 if (document.uniqueID) { // for IE
                         w = $(image).css("width");
                         h = $(image).css("height");
                 } else { // for Opera and Other
                 mem = {w: image.width, h: image.height}; // keep current style
                 $(this).removeAttr("width").removeAttr("height").css({width:"",  height:""});    // Remove attributes in case img-element has set width  and height (for webkit browsers)
         	 w = image.width;
          	h = image.height;
         	image.height = mem.h;
                                                                                                                                                              }
        return image[key] = {width: w, height: h, src: image.src}; // bond
        }
	// HTMLCanvasElement
        return {width: image.width, height: image.height};
}


function parseCharacterXml(xml,status){
    if(status!='success')return;
    $(xml).find('character').each(disp_picker);
}

function disp_picker(){
    var id = $(this).find('id').text();
    var name = $(this).find('name').text();
    var height = $(this).find('height').text();
    var item = $('<li id="pickItem'+id+'" class="pickerItem"><img src="/images/characters/' + id +'.jpg"></li>');
    var dim = getActualDimension(item);
    item.click(function(){
       selectedImage.src = '/images/characters/'+id +'.jpg' ;
       selectedImage.width = dim.width*entry_height/dim.heiht;
       selectedImage.heght = entry_height;
       $('#picker').find($('img')).remove();
       $('#picker').hide('fast') });
       item.appendTo($('#pickerList'));
}




function pickImage(ev){
  selectedImage = ev.target; 
  loadXml("/characters.xml",parseCharacterXml );
  $('#picker').show('fast');
  $("#pickerCancelBtn").click(function(){
        $('#picker').find($('img')).remove();
	$('#picker').hide();
        }
    );

}



$(function() {

        //entry = new Entry();

    	
    });

