//= require jquery.jStageAligner

entry_width = 800;
entry_height = 255;
entry_num = 0;
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


function setEntry(str,strPos,src,srcPos) {
    newEntry =  $('<div class="entry"><img src="'+src+'" class="resizableImage" ></img><div class="draggable"><div class="sticky"><div class="wrap">'+str+'</div></div></div>');
    newEntry.appendTo("#entrylist")
    	    .css({position: "absolute",top: entry_height*entry_num,left: 0})
    	    ;
    entry_num = entry_num+1;
    
    newEntry.width(entry_width).height(entry_height);
    //moveinputform to next
    $('#inputform').css({position: "absolute",top: entry_height*entry_num,left: 0});
    
   
    newEntry.children(".resizableImage")
      .css({position: "absolute",top: 0,left: 0, height: entry_height})
      .css(srcPos)
      .width(srcPos.width)
      .height(srcPos.height);
    
    
    newEntry.children(".resizableImage")
	.resizable({containment: "parent parent")
     	.parent().draggable({
     	containment: "parent"
    }).dblclick(pickImage);
    
    newEntry.children(".draggable").draggable({
	containment: "parent"
    })
    .width(newEntry.find(".sticky").width())

    .height(newEntry.find(".sticky").height())
    .css({position: "absolute",top: 0,left: 100})
    .css(strPos)
    .width(strPos.width)
    .height(strPos.height);
    
    newEntry.find(".wrap").css({'margin': '10px'});
    newEntry.find(".sticky").resizable({
       resize: function(event, ui) { 
         var st = $(event.target).parent(); // resizable
         st.parent().width(st.width());
         st.parent().height(st.height());
       }
    })
    .width(strPos.width)
    .height(strPos.height);
 
    newEntry.find(".sticky").dblclick(function() {
        text = $(".wrap",this).html().split("<br>").join('\n');
        text = text.replace(/&amp;/g,"&");
     	text = text.replace(/&quot;/g,"/");
     	text = text.replace(/&#039;/g,"'");
        text = text.replace(/&lt;/g,"<");
       	text = text.replace(/&gt;/g,">");
        $(this).hide();
        
	$('<textarea></textarea>')
		.appendTo($(this).parent())
        	.focus()
        	.select()
        	.val(text)
        	.blur(function() {
       			text = $(this).val().split('\n').join("<br>");
        	        $(this).hide();
        		var st = $(this).parent();
        		st.find(".sticky").show();
			$(".wrap",st).html(text);
        	})
        	.height(
			$(this).height()
        	)
        	.width(
			$(this).width()
        	);
	}	
	);
								
								
}

entry_n = 0;

$(function() {
	
	$('#inputform').keypress(function (e) {
		if(e.which == 13){
		    setEntry($('#inputform').val(),
	               {width: 200,height: 100,top: 50,left:50},"/images/characters/1.jpg",
	               {width: 200,height: 100,top: 50,left:50});
		    $('#inputform').val(""); 
		}  
	    });

	$( "#chapterList" ).sortable();

        $("#picker").hide().css({'z-index':3});

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
