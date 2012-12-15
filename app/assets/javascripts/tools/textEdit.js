//= require jquery.autosize-min
//
TextEdit = function(){ }


TextEdit.prototype = {
  
  isAppended: false,

  onBlur: function(ev){
    //console.log(ev);
    if( !$(ev.target).is('textarea') ){
        $('textarea').blur();
    }
  },

  editableTextarea: function(target,callback){
    //console.log(target);

    if ($('.editable_text').length == 0 ){
      
      TextEdit.prototype.isAppended = true;

      var text = $('.text',target).html();
      if(text === null || text === undefined){
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

      var focusedText = $( '<textarea class="editable_text" style="vertical-align: middle; text-align:center;" ></textarea>' )
          .height( $(target).height() ).width ( $(target).width() )
          .css({position: 'absolute', left:-5 ,top: -5})
          .appendTo(target)
          .focus().select()
          .autosize()
          .val(text);

      TextEdit.prototype.focusedText = focusedText;

      focusedText.blur(
        function() {
         var txt = $(this).val();
         $('.text',target).text(txt);
         txt = $('.text',target).html().split('\n').join('<br>') ;
         console.log(txt);
          $('.text',target).html(txt);

          callback( txt);

          $(this).remove();
          TextEdit.prototype.isAppended = false;
      });
    }
  }, 
  

}

//temp code
function editableTextarea(target,callback){
  TextEdit.prototype.editableTextarea(target,callback);
}
