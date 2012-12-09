EntryTemplate = function(){};

EntryTemplate.prototype = 
{

  getTemplate : function(i){
    if ( EntryTemplate.prototype.templateList[i]) {
      var tempList = EntryTemplate.prototype.templateList[i];
      if ( tempList.length > 0 ) {
        var i = Math.floor((Math.random() *  tempList.length ));
        return tempList[i];
      } 
    }
    return null;
  },
 
  // on person temp
  templateList[0]: 
  [
  
  ],

  // two person temp
  templateList[1]: 
  [
  
  ],

  // description temp
  templateList[2]: 
  [
  
  ],
}
