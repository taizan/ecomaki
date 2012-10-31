ChapterHanble = function(){};


ChapterHandle.prototype = {
  append : function(){
    $('body').append($('#chapter_handle_template').html);
    $('#chapter_hanble_list').sortable({
      start: this.onStart,
      stop: this.onStop,
    });
  },
  
   onStop: function(){

   },

   onStart: function(){

   },

   addNewChapter : function(chapterView){
      $('<div class="chapter_handle_item"></div>').appendTo('#chapter_handle_list')
        .text(chapterModel.get('titel'))
        .click(function() { chapterView.showThis() });
      this.capterList += chapterview;
   }
  
}
