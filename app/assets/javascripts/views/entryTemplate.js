EntryTemplate = function(){};

EntryTemplate.prototype = 
{
  // get template from novel 1

  novel: new Novel({id: 1}),

  getTemplate : function(i){
    
    var chapter = EntryTemplate.prototype.novel.chapters.at(i);
    console.log(chapter);
    if( chapter.entries.length > 0 ){
      var j = Math.floor((Math.random() * chapter.entries.length));
      return chapter.entries.at(j).dup();
    }

    return EntryTemplate.prototype.templateList[i][0];
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
