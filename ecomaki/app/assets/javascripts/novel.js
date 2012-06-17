

entry_width = 512;
entry_height = 255;
entry_num = 0;

function setEntry(str) {
    $('<div class="entry"><img src="/development/images/characters/miku3.jpg" class="resizableImage" ></img><div class="draggable"><div class="sticky"><div class="wrap">'+str+'</div></div></div>')
    	    .appendTo("#entrylist")
    	    .css({position: "absolute",top: entry_height*entry_num,left: 0})
    	    ;
    entry_num = entry_num+1;
    
    $(".entry").width(entry_width).height(entry_height);
    
    $('#inputform').css({position: "absolute",top: entry_height*entry_num,left: 0});
    
   
    $(".resizableImage").css({position: "absolute",top: 0,left: 0});
    $(".draggable").css({position: "absolute",top: 0,left: 100});
    
    
    $(".resizableImage")
	.resizable()
     	.parent().draggable({
     	containment: "parent"
    });
    
    $(".resizable").resizable();
    
    
    $(".draggable").draggable({
	containment: "parent"
    })
    .width($(".sticky").width())
    .height($(".sticky").height());
    
    $(".wrap").css({'margin': '10px'});
    
    $(".sticky").dblclick(function() {
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
								}).resizable();
								
								
}


$(function() {
	
	$('#inputform').keypress(function (e) {
		if(e.which == 13){
		    setEntry($('#inputform').val());
		    $('#inputform').val(""); 
		}  
	    });
	/*$('#new').click(setEntry);*/
	
    });
