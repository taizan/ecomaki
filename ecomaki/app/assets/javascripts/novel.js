//= require jquery.jStageAligner

entry_width = 512;
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

function xmlLoad(xml,parse_func){
    //alert("load");
    $.ajax({
        url:xml,
        type:'get',
        dataType:'xml',
        timeout:1000,
        success:parse_func
    });
}

function parse_xml(xml,status){
    if(status!='success')return;
    $(xml).find('character').each(disp_picker);
}

function disp_picker(){
    var id = $(this).find('id').text();
    var name = $(this).find('name').text();
    var height = $(this).find('height').text();
    var item = $('<li id="pickItem'+id+'" class="pickerItem"><img src="/images/characters/'+id +'.jpg"></li>')
	.click(function(){
 		selectedImage.src = '/images/characters/'+id +'.jpg' ;
		$('#picker').hide('fast') });
    item.appendTo($('#pickerList'));
}

function disp_entry(){
	var height;
	var width ;
	var top ;
	var left;
	var src;
}

function resizeTextarea(textarea) {
  		var lines = textarea.value.split('ÔººÓ');
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
  $('<li><button class="btn" id ="pickerCancelBtn">cancel</button></li>').appendTo($('#pickerList'));
  $("#pickerCancelBtn").click(function(){
        $("#picker").hide();
        }
    );
}

//strPos,srcPos
//{height: , width:,top:,left:}
function setEntry(str,strPos,srcPath,srcPos) {
    newEntry =  $('<div class="entry"><img src="'+srcPath+'" class="resizableImage" ></img><div class="draggable"><div class="sticky"><div class="wrap">'+str+'</div></div></div>');
    newEntry.appendTo("#entrylist")
    	    .css({position: "absolute",top: entry_height*entry_num,left: 0})
    	    .width(entry_width).height(entry_height);

    entry_num = entry_num+1;
 
    //moveinputform to next
    $('#inputform').css({position: "absolute",top: entry_height*entry_num,left: 0});
    var body_height = $('#body').height();
    $('#body').css(height: body_height+entry_height);
    
    //≤Ë¡¸
    newEntry.children(".resizableImage")
        .css({position: "absolute"})
        .css(srcPos)
		.resizable()
     	  .parent().draggable({
     	  containment: "parent"
         }).dblclick(pickImage);
    //•ª•Í•’
    newEntry.children(".draggable").draggable({ containment: "parent" })
    	.width(newEntry.find(".sticky").width())
    	.height(newEntry.find(".sticky").height())
    	.css({position: "absolute"})
    	.css(strPos);
    
    newEntry
    	.find(".wrap").css({'margin': '10px'})
    	.find(".sticky").resizable(); 
    newEntry.find(".sticky").dblclick(function() {
        text = $(".wrap",this).html().split("<br>").join('\n');
        text = text.replace(/&amp;/g,"&");
     	text = text.replace(/&quot;/g,"/");
     	text = text.replace(/&#039;/g,"'");
        text = text.replace(/&lt;/g,"<");
       	text = text.replace(/&gt;/g,">");
        $(this).hide();
        
        // ‘Ω∏•®•Í•¢
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
				require$(".wrap",st).html(text);
        	})
        	.height($(this).height())
        	.width($(this).width());
	}	
	);
								
								
}


$(function() {
	
	$('#inputform').keypress(function (e) {
		if(e.which == 13){
		    setEntry($('#inputform').val(),{},'/images/characters/1.jpg',{height: entry_height});
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
