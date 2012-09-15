
entry_n = 0;

$(function() {
        tool = new SketchTool();
	tool.appendTo('#novel_container');
        tool.setDefaultParet();
        tool.hide();
/*	
	$('#inputform').keypress(function (e) {
		if(e.which == 13){

		    //entry = new Entry();
		    entry = new EntryHandle("normal","");
                    entry.addWith($('#inputform').val(),
	               {width: 200,height: 100,top: entry_height/2,left:entry_width/2, zIndex: 1},
                       "/characters/image/0",
	               {height: entry_height,top: 0,left:50, zIndex: 0});

		    $('#inputform').val(""); 
		}  
	    });
	$('#entrylist').sortable( ) .mousedown(function(){
                focusedText.blur();

        });//list > List?
*/
	$( "#chapterList" ).sortable();

        novel = new Novel({ id:1});

       // chapter = new ChapterView( { model: novel.chapters.models[0]} );
     	novelView = new NovelView({model: novel});
        $('#content').append(novelView.el);	
    
	isChapterHided = true;
	
	//init 	
	$("#sideMenu .nav-header").parent().find('li').hide();
        //$( "#sideMenu .nav-header").show();
	//$('#content').css({left:-200});

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
        
        /*
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
    	*/
    });

