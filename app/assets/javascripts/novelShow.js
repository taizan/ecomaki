//= require underscore
//= require backbone
//= require ./models
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./tools/textEditTool
//= require ./tools/effecter
//= require ./callbackControle


$(function(d,s,id) {
  
  var id = $('.novel_container').attr('id');
  var root = $('.novel_container').attr('root');

  var chain = new CallbackChane();



  if(root){
    chain.push( function(){ $.ajax({
        type: 'GET',
        url: root+"/extern/show_temp",
        datatype: 'html',
        success: function(data){ 
            console.log(data);
            $(data).appendTo('body'); 
            (chain.next())();
          }
      }); 
    });
  }
  //var urls = location.href.split('/');

  chain.push(function(){
    _novel = new Novel({id: id,password: null ,root: root});
    _novel.fetch({success: chain.next()});
  });

  chain.push( function(){
      if(_novel.get('status') == "publish"){
        _novelView = new NovelView({model: _novel , isEditable: false , isPreView: false });
        _novelView.appendTo($('#content'));
      } else{
        alert('公開されていません。');
        _novel = null;
      }
  });

  var nx = chain.next();
  nx();

  $(document).tooltip();
  
});

