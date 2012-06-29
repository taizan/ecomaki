//= require jquery.jStageAligner

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


function setEntry(str,strPos,src,srcPos) {
    newEntry =  $('<li class="entry"><img src="'+src+'" class="resizableImage" ></img><div class="draggable"><div class="sticky"><div class="text">'+str+'</div></div></li>');
    newEntry.appendTo("#entrylist")
       .css({position: "relative"})
    	    ;
    entry_num = entry_num+1;
    entry_pos += entry_height;
    
    newEntry.width(entry_width).height(entry_height);
    //moveinputform to next
    //$('#inputArea').css({position: "absolute",top: entry_pos,left: 0});
    
   
    newEntry.children(".resizableImage")
      .css({position: "absolute",top: 0,left: 0, height: entry_height})
      .css(srcPos)
      .width(srcPos.width)
      .height(srcPos.height);
    
    
    newEntry.children(".resizableImage")
	.resizable(
            {containment: "parent parent"}
         )
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
    
    newEntry.find(".text").css({'margin': '10px'});
    newEntry.find(".sticky").resizable({
      //containment: 'parent parent',
      resize: function(event, ui) { 
        var st = $(event.target).parent(); //sticky 
        var ent = st.parent().parent();
        if(st.hasClass('sticky')){
          if(st.offset().left + st.width() > ent.offset().left + ent.width() )
            st.width(ent.offset().left + ent.width() - st.offset().left);
          if(st.offset().top + st.height() > ent.offset().top + ent.height() )
            st.height(ent.offset().top + ent.height() - st.offset().top);

          st.parent().width(st.width());
          st.parent().height(st.height());
        }
       }
    })
    .width(strPos.width)
    .height(strPos.height);
 
    newEntry.find(".sticky").dblclick(editTextArea);
								
								
}

function setTextEntry(str){
newTextEntry = $('<li class="entry text-entry"><div><p class="text"> ' + str + ' </p></div></li>');
   newTextEntry.appendTo("#entrylist")
       .css({position: 'relative',width: entry_width })
   newTextEntry.find('.text').css({'margin': '12px'})
       .parent().dblclick(editTextArea);
   entry_num +=1;
   entry_pos += newTextEntry.height();    
   //$('#inputArea').css({position: "absolute",top: entry_pos,left: 0});
}

function editTextArea(){
        text = $(".text",this).html().split("<br>").join('\n');
        text = text.replace(/&amp;/g,"&");
        text = text.replace(/&quot;/g,"/");
        text = text.replace(/&#039;/g,"'");
        text = text.replace(/&lt;/g,"<");
        text = text.replace(/&gt;/g,">");
        hidedText = $(this).hide();

        $('<textarea></textarea>')
                .appendTo($(this).parent())
                .focus()
                .select()
                .val(text)
                .blur(function() {
                        text = $(this).val().split('\n').join("<br>");
                        var st = $(this).parent();
                        hidedText.show();
                        $(".text",st).html(text);
                        $(this).remove();
                })
                .height(
                        $(this).height()
                )
                .width(
                        $(this).width()
                );
}


entry_n = 0;

$(function() {
	
	$('#inputform').keypress(function (e) {
		if(e.which == 13){
		    setEntry($('#inputform').val(),
	               {width: 200,height: 100,top: entry_height/2,left:entry_width/2},
                       "/images/characters/1.jpg",
	               {height: entry_height,top: 0,left:50});
		    $('#inputform').val(""); 
		}  
	    });
	$('#textInputform').keypress(function (e) {
                if(e.which == 13){
                    setTextEntry($('#textInputform').val());
                    $('#textInputform').val("");
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
