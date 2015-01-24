EntryTemplate = function(){};

EntryTemplate.prototype = 
{
  // get template from novel 1

  //fetchしてコールバックをとる必要あり
  novel: new Novel({id: 1}),

  initialize : function(callback){
    var option = {};
    if(callback) option = {success:callback};
    EntryTemplate.prototype.novel.fetch(option); 
  },

  getTemplate : function(i){
    
    var chapter = EntryTemplate.prototype.novel.chapters.at(i);
    console.log(i);
    if( chapter.entries.length > 0 ){
      var j = Math.floor((Math.random() * chapter.entries.length));
      return chapter.entries.at(j).dup();
    }

    return EntryTemplate.prototype.templateList[i][0];
  },

  // テンプレートで操作する必要あり 
  addToTemplate : function( novel , novelId  ){
    if( novel ) novel = _novel;
    if( novelId ) novelId = _novel.id;

    var targetNovle = new Novel({id : novelId}); 

    targetNovle.fetch({ success:function(){
        var targetChapter = targetNovle.chapters.at(0);
   
        for( var i = 0; i < targetChapter.entries.length ; i++){
          var chapter = novel.chapters.at(i%4);   
          var attr = targetChapter.entries.at(i).dup();
          if(chapter) chapter.entries.create_after(attr , 0);
        }
      }
    });
  },

  // old 
  getTemplateFromList : function(i){
    if ( EntryTemplate.prototype.templateList[i]) {
      var tempList = EntryTemplate.prototype.templateList[i];
      if ( tempList.length > 0 ) {
        var i = Math.floor((Math.random() *  tempList.length ));
        return tempList[i];
      } 
    }
    return null;
  },
 
  templateList:
  [
    // on person temp
    [
      {"canvas_index":1,"height":320,"width":640}  
    ],

    // two person temp
    [
      {"canvas_index":1,"height":320,"width":640}  
    ],

    // description temp
    [
      {"canvas_index":1,"height":320,"width":640}  
    ]
  ],
}
