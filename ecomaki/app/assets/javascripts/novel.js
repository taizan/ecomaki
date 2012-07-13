//= require jquery.jStageAligner
/*
entry_width = 800;
entry_height = 255;
entry_num = 0;
entry_pos = 0;
defImage = "";

function xmlLoad(){
    //alert("load");
    $.ajax({
        url:'/characters.xml',
        type:'get',
        dataType:'xml',
        timeout:1000,
        success:parse_xml
    });
}

function parse_xml(xml,status){
    if(status!='success')return;
    $(xml).find('character').each(disp_picker);
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


function resizeTextarea(textarea) {
  		var lines = textarea.value.split('＼n');
  		var width = textarea.cols;
  		var height = 1;
  		for (var i = 0; i < lines.length; i++) {
    		var linelength = lines[i].length;
    		if (linelength >= width) {
      			height += Math.ceil(linelength / width);
    		}
  		}
  		height += lines.length;
  		textarea.rows = height-1;
}

function pickImage(ev){
  selectedImage = ev.target; 
  xmlLoad();
  $('#picker').show('fast');
  $("#pickerCancelBtn").click(function(){
        $('#picker').find($('img')).remove();
	$('#picker').hide();
        }
    );

}
*/

entry_n = 0;

$(function() {
        tool = new SketchTool();
	tool.appendTo('#content');
        tool.setDefaultParet();	
	$('#inputform').keypress(function (e) {
		if(e.which == 13){

		    //entry = new Entry();
		    entry = new EntryHandle("normal","");
                    entry.addWith($('#inputform').val(),
	               {width: 200,height: 100,top: entry_height/2,left:entry_width/2, zIndex: 1},
                       "/images/characters/1.jpg",
	               {height: entry_height,top: 0,left:50, zIndex: 0});

		    $('#inputform').val(""); 
		}  
	    });
	$('#textInputform').keypress(function (e) {
                if(e.which == 13){
                    textentry = new EntryHandle("text",$('#textInputform').val());
                    textentry.add();
                    $('#textInputform').val("");
                }
            });
	$('#entrylist').sortable( ) .mousedown(function(){
                focusedText.blur();

        });//list > List?

	$( "#chapterList" ).sortable();
	
	isChapterHided = true;
	//init 	
	$( "#sideMenu .nav-header").parent().find('li').hide();
        $( "#sideMenu .nav-header").show();
	$('#content').css({left:-200});

	$( "#sideMenu .nav-header").click(
	        function(ev) {
                   if(isChapterHided){
			$(this).parent().find('li').show();
			$('#content').css({left:0});
 			isChapterHided = false;
		   }else{ 
                   	$(this).parent().find('li').hide();
			$('#content').css({left:-200});
                   	$(this).show();
 			isChapterHided = true;
  		   }
             });		

        $("#picker").hide();

	$("#comment")
        	.jStageAligner("RIGHT_MIDDLE", {time: 150})
        	.click(function(){
        		$(this).fadeTo("fast",1.0);
        		})
        	.blur(function() {
        		$(this).fadeTo("fast",0.5);
        	})
        	.keypress(function (e) {
      			if(e.which == 13){
      				text = $("#comment").val();	
      				t = $("#comment").position().top;
      				l = $("#comment").position().left;
      				
       				commented = $('<textarea readonly>'+text+'</textarea>');
       				commented
        				.appendTo($('#commentList'))
        				.css({position: "absolute",top: t, left: l})
        				.width($("#comment").width()).hide().css({'z-index':1})
        				.show("slow");
    
      			resizeTextarea(commented[0]);
      			commented.animate(commented.height(),"slow");
      			
      			$("#comment").val("").css({'z-index':2}); 
      		}  
  		});
    	
    });

// character upload
$(function () {
	$('#character_upload').fileupload({
		dataType: 'json',
		done: function(e, data) {
		    alert('done');
		},
		    fail: function(e, data) {
		    alert(data)
			}
	    });
    });
