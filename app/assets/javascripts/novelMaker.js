//= require underscore
//= require backbone
//= require jquery.form
//= require wColorPicker.1.2.min
//
//= require ./models
//= require ./views/makerView/makerViews
//
//= require ./views/ecomakiView
//= require ./views/entryItems
//= require ./views/entryView
//= require ./views/chapterView
//= require ./views/novelView
//= require ./views/musicPlayer
//= require ./tools/textEditTool
//= require ./tools/effecter





$(function() {
  
  var id = $('.novel_container').attr('id');
  
  var isEditable = true;
    
  var urls = location.href.split('/');
  var pass = urls.length > 5 ? urls[5] : null;  
  //console.log(pass);

  initializeView(id,pass,isEditable);

  if(isEditable) initializeTool(isEditable,id);


  function initializeView(id,pass,isEditable){
    _novel = new Novel({id: id,password: pass});
    _novel.fetch({
      success: function(){
        _novelView = new MakerNovelView({ model: _novel });
        _novelView.appendTo($('#content'));
      }
     });
  }

  function initializeTool(isEditable,id){
    _novelPreview = null;
    $('#preview_button').click(function(){
        console.log('preview');
        isEditable = isEditable ? false : true;
			  $('#preview_button img').attr('src', '/assets/novel/' + (isEditable ? 'preview.png' : 'edit.png'));
			  $('#preview_button span').text(isEditable ? 'Preview' : 'Edit');

        if(! _novelPreview) {
          _novelPreview = new NovelView({model: _novel , isEditable: false });
          _novelPreview.appendTo($('#preview_content'));
        }else{
          _novelPreview.render();
        }

        if(isEditable) {
          $('#toolbox').show();
          $('#content').show();
          $('#preview_content').hide();
        }else{
          $('#toolbox').hide();
          $('.tutorial_dialog').hide();
          $('#content').hide();
          $('#preview_content').show();
        }

      });
    


    $('#publish_button').click(function(){ 
      var chane = new CallbackChane();
      var new_novel;
      var url = "/novels/"+ id +"/dup_no_redirect.json"
      console.log(url);

/*
      chane.push( function(arg){
          console.log(arg);
          console.log('make model');
          new_novel = new Novel({id: arg.id , password: arg.password});
          new_novel.fetch({success:chane.next()});
        });
*/           
      chane.push( function(){
          console.log('copy make');
          _novelView.copyTo(new_novel , chane.next());
        });
         
      chane.push( function(){
          console.log('change status');
          new_novel.save({'status': 'publish'},{success:chane.next()}); 
        });
           
                    
      chane.push( function(){
          console.log('move page');
          document.location = '/novels/'+ new_novel.id ;
        });

      jQuery.getJSON(
          url,            // リクエストURL
          //chane.next()
          function(arg){ 
            //console.log(arg);
            console.log('make model');
            new_novel = new Novel({id: arg.id , password: arg.password});
            new_novel.fetch({success:chane.next()});
          }
          
        );

     });

   }

});
