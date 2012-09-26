

function editableTextarea(target,callback){
                var text = $('.text',target).html();
		if(text == null || text == undefined){ 
			text = "[        ]";
		}else{
		console.log(text);
		text = text.split("<br>").join('\n');
                text = text
                        .replace(/&amp;/g,"&")
                        .replace(/&quot;/g,"/")
                        .replace(/&#039;/g,"'")
                        .replace(/&lt;/g,"<")
                        .replace(/&gt;/g,">");
		}

                var focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
                        .height( $(target).height() ).width ( $(target).width() )
                        .css({position: 'absolute', left:-5 ,top: -5})
                        .appendTo(target)
                        .focus().select()
                        .val(text);

                focusedText.blur(
                        function() {
                                var txt = $(this).val();
                                $('.text',target).text(txt);
                                txt = $('.text',target).html().split('\n').join('<br>') ;
                                $('.text',target).html(txt);

                                callback( txt);

                                $(this).remove();
                        });
  }
