//= require jquery.fileupload
//= require jquery.masonry.min 
//= require jquery.imagesLoaded 
//
function Picker( ){

}

Picker.prototype = {

  selectedCallback: null,

  visible: false,
  isApeended: false,

  initialize: function(){
   
    // hide on blur 
    $($('#character_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();
    $($('#background_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();
    $($('#music_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();

    $($('#balloon_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();
    Picker.prototype.setBalloonList();
			
    $('.picker_cancel_button').click(Picker.prototype.finish);

    // set form button click 
    $('#add_character_button')  .click(function(){ Picker.prototype.appendForm("/characters", "image");} );
    $('#add_background_button') .click(function(){ Picker.prototype.appendForm("/background_images","image");} );
    $('#add_music_button')      .click(function(){ Picker.prototype.appendForm("/background_musics","music");} );
  },

  onBlur: function(ev){
    //console.log(ev);
    if (Picker.prototype.isBlurable) {
      if( !$(ev.target).is('.picker_elem') ){
        Picker.prototype.finish();
      }
    }
  },

  appendForm: function(action,type,id){
    
    ///<input id="char_upload" type="file" name="image" data-url="/characters/images" multiple>
    var template = $("#upload_form_template").html();

    var form = $(template)
      .appendTo('body')
      //.attr({"action": "/characters/images", "method":"post","enctype":"multipart/form-data"  })
      .attr({"action": action , "method":"post","enctype":"multipart/form-data"  })
      .ajaxForm({
        beforeSubmit: function() {
          $('.submit_button',form).prop('disabled',true);
        },

        success: function() { 
          $(form).remove();
          if(confirm('Uploaded')) {
          if(action == "/characters" )  
            Picker.prototype.loadXml("/characters.xml" , Picker.prototype.parseCharacterXml );
          if(action == "/characters/images" )  
            Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.parseCharacterImageXml );
          if(action == "/background_images" )
            Picker.prototype.loadXml("/background_images.xml" , Picker.prototype.parseBackgroundXml );
          if(action == "/background_musics" )
            Picker.prototype.loadXml("/background_musics.xml" , Picker.prototype.parseMusicXml );
          }
          //alert("Uploaded"); 
                    
        },

        error: function(response) {
          //res= response;
          alert(response.responseText);
        }
        });
    //for character image upload
    if(action =="/characters/images" ) $('<input type="text" id="input_character_id" name="character_id" style="display : none">').appendTo(form).val(id);

    //for send type of file default image
    $('#input_file',form).attr('name',type);

    $('.cancel_button',form).click(function(){ $(form).remove()});
    //$('.submit_button',form).click(function(){ $('.submit_button',form).prop('disabled',true)});
  },


  loadXml: function(url,func){
    //alert("load");
    $.ajax({
      url:url,
      type:'get',
      dataType:'xml',
      timeout:1000,
      success:func
    });
  },

  parseMusicXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('background-music').each(
      function(){
        var id          = $(this).find('id').text();
        var name        = $(this).find('name').text();
        var author      = $(this).find('author').text();
        var description = $(this).find('description').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();

        var text = name +', '+ description +', by '+ author;
	var list_id = "#music_picker .picker_list"

        Picker.prototype.setMusicItem(list_id,id,text,id + ': '+name);
      }
    );
  },

  parseBackgroundXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('background-image').each(
      function(){
        var id          = $(this).find('id').text();
        var name        = $(this).find('name').text();
        var author      = $(this).find('author').text();
        var description = $(this).find('description').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();

        var text = name +', '+ description +', by '+ author;
        var list_id = '#background_picker .picker_list';

        Picker.prototype.setBackgroundItem(list_id,id,text,config.background_idtourl(id));
      }
    );
  },

  parseCharacterImageXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('character-image').each(
      function(){
        var id           = $(this).find('id').text();
        var name         = $(this).find('name').text();
        var character_id = $(this).find('character-id').text();
        var author       = $(this).find('author').text();
        var description  = $(this).find('description').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();

        var text = name +', '+ description +', by '+ author;
        var list_id = '#character_item_'+character_id;

        Picker.prototype.setCharacterImageItem(list_id,id,text,config.character_image_idtourl(id));
      }
    );
  },

  parseCharacterXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('character').each(
      function(){
        var id          = $(this).find('id').text();
        var name        = $(this).find('name').text();
        var author      = $(this).find('author').text();
        var description = $(this).find('description').text();
        var text = name +', '+ description +', by '+ author;

        if( $('#character_item_'+id).length == 0 ){
          //init header 
          var header =  $($('#picker_item_template').html())
            .attr({ 'id':'character_item_'+id ,'title': text })
            .appendTo('#character_picker .picker_list')
            .click(function( e ){ 
                //console.log(e.target);
                if( $(e.target).hasClass('add_character_image') === false ){
                  $('.image_list','#character_item_'+id).toggle();
                }
              })
            .imagesLoaded( function(){  $('.image_list',header).masonry({ itemSelecter: '.picker_image_item'}); });
          
	        $('.list_header_name',header).html( name );
	        $('.list_header_description',header).html( description );

          // init form add button
          $('.add_character_image_button','#character_item_'+id).click(function(){
              Picker.prototype.appendForm("/characters/images","image",id); 
              $('.image_list','#character_item_'+id).show();
            });
          
        }
        //console.log($('#character_item_'+id ));
      });
    Picker.prototype.onCharacterXmlParseEnded();
  },

  onCharacterXmlParseEnded: function(){
    // call next function 
    Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.parseCharacterImageXml );
  },

  setMusicItem: function(list_id,id,text,name){
    // escape text 
    var $a = $('<a></a>');
    var text = $a.text(text).text(); 

    var item = $('<li id="pick_music_item_'+id+'" class="picker_text_item picker_elem" ><hr><p></p><hr></li>').attr('title',text);
    $('p',item).text(name);

    if( $('#pick_music_item_' + id).length == 0 ){
      item.appendTo($(list_id));
      item.click(function(){
          if(Picker.prototype.selectedCallback){
            Picker.prototype.selectedCallback(id);
            Picker.prototype.finish();
          }
        });
    }
  },

  setBackgroundItem: function(list_id,id,text,url){
    var $a = $('<a></a>');
    var text = $a.text(text).text(); 
    var item = $('<div id="pick_background_item_'+id+'" class="picker_image_item" ><img src="' + url + '"></div>').attr('title',text);
    //item.appendTo($(list_id)).tooltip();
   
    if( $('#pick_background_item_' + id).length == 0 ){
      item.appendTo($(list_id));
      item.click(function(){
          if(Picker.prototype.selectedCallback){
          //set img elem for use img tag information.
            Picker.prototype.selectedCallback(id,$('img',item)[0]);
            Picker.prototype.finish();
          }
        });
    }

  },


  setCharacterImageItem: function(list_id,id,text,url){
    var item = $('<div id="pick_character_image_item_'+id+'" class="picker_image_item" ><img src="' + url + '"></div>').attr('title',text);
    //item.appendTo($(list_id)).tooltip();
    if(! $('.list_header_button img',list_id).attr('src') ){
      //console.log($(list_id));
      $('.list_header_button img',list_id).attr('src',url);
    }
    
    function addImageItem(){
      // hide and show
      if($("#pick_character_image_item_"+id ).length == 0 ){
      //console.log($('pick_item'+id));
       //item.appendTo($('.image_list',list_id));
        $('.image_list',list_id).prepend(item);
        item.click(function(){
          if(Picker.prototype.selectedCallback){
            //set img elem for use img tag information.
            Picker.prototype.selectedCallback( id , $('img',item)[0] );
            Picker.prototype.finish();
          }
        });
      }
    }
    
    if( $(list_id).attr('display') != 'none'){
      addImageItem();   
    }

    $(list_id).click(function(){
      addImageItem();   
      //console.log($('pick_item'+id));
    });
  },

  setCallback: function(func) {
    Picker.prototype.selectedCallback = func;
  },

  showCharacterList: function(callback){
    if( !Picker.prototype.isCharacterListAppended){
      Picker.prototype.loadXml("/characters.xml" , Picker.prototype.parseCharacterXml );
    //  Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.parseCharacterImageXml );
      Picker.prototype.isCharacterListAppended = true;
    }
    
    Picker.prototype.showPicker(callback,'#character_picker',600);
  },

  showBackgroundList: function(callback){
    if( !Picker.prototype.isBackgroundListAppended){
      $('#picker').find($('.picker_item')).remove();
      Picker.prototype.loadXml("/background_images.xml" , Picker.prototype.parseBackgroundXml );
      Picker.prototype.isBackgroundListAppended = true;
    }
		
    Picker.prototype.showPicker(callback,'#background_picker',500);
  },

  showMusicList: function(callback){
   if( !Picker.prototype.isMusicListAppended){ 
      $('#picker').find($('.picker_item')).remove();
		  var list_id = "#music_picker .picker_list"
      Picker.prototype.setMusicItem(list_id,-1,'音楽なし','No BGM');
      Picker.prototype.loadXml("/background_musics.xml" , Picker.prototype.parseMusicXml );
      Picker.prototype.isMusicListAppended = true;
    }
    
    Picker.prototype.showPicker(callback,'#music_picker',300);
  },

  showBalloonList: function(callback){
   if( !Picker.prototype.isBalloonListAppended){ 
      Picker.prototype.isBalloonListAppended = true;
    }
    
    Picker.prototype.showPicker(callback,'#balloon_picker',300);
  },

  setBalloonList: function(){
    var i = 0;
    $('.balloon_picker_item' ).click(
        function() {
          if( Picker.prototype.selectedCallback ){
            Picker.prototype.selectedCallback( $(this).attr('id') );
            //console.log( $(this).attr('id'));
            Picker.prototype.finish();
          }
        }
      );
  },

  showPicker: function(callback,picker,width) {
    Picker.prototype.selectedCallback = callback;
    if(! Picker.prototype.visible)$(picker).width(width).show('drop','fast');

    Picker.prototype.visible = true;
    Picker.prototype.isBlurable = true;
  },

  finish: function(){
    if(Picker.prototype.visible){
      $('.picker').hide('drop','hide');
      Picker.prototype.visible = false;
    }
    Picker.prototype.isBlurable = false;
  }

};

// character upload
$(function () {
/*
  $('#character_upload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      alert('done char');
    },
    fail: function(e, data) {
      console.log(data);
    }
  });


  $('#music_upload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      alert('done');
    },
    fail: function(e, data) {
      console.log(data);
    }
  });


  $('#background_upload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      alert('done');
    },
    fail: function(e, data) {
      console.log(data);
    }
  });
*/

});
