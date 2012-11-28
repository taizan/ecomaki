//= require jquery.fileupload
//
function Picker( ){

}

Picker.prototype = {

  selectedCallback: null,

  visible: false,
  isApeended: false,

  initialize: function(){
    

    $($('#character_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();
    $($('#background_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();
	  $($('#music_picker_template').html())
		  .appendTo('body').blur(Picker.prototype.onBlur).hide();
			
    $('.picker_cancel_button').click(Picker.prototype.finish);

 /*   
		var pickerTemplate = $('#picker_template').html();
    $(pickerTemplate).appendTo('body');
		
    $('#picker').blur(Picker.prototype.onBlur);
		
    //$('#picker').click(function(ev){ ev.stopPropagation(); });
    $("#picker").hide();
    $("#picker").tabs();
    $('#picker_cancel_button').click(Picker.prototype.finish);
    //$('#picker_upload_button').click(Picker.prototype.appendForm)
    $('#character_upload_button')  .click(function(){ Picker.prototype.appendForm("/characters/images");} );
    $('#background_upload_button') .click(function(){ Picker.prototype.appendForm("/background_images");} );
    $('#music_upload_button')      .click(function(){ Picker.prototype.appendForm("/background_musics"); } );
*/
    $('#add_character_button')  .click(function(){ Picker.prototype.appendForm("/characters");} );
    $('#add_background_button')  .click(function(){ Picker.prototype.appendForm("/background_images");} );
    $('#add_music_button')  .click(function(){ Picker.prototype.appendForm("/background_musics");} );
  },

  onBlur: function(ev){
    console.log(ev);
    if (Picker.prototype.isBlurable) {
      if( !$(ev.target).is('.picker_elem') ){
        Picker.prototype.finish();
      }
    }
  },

  appendForm: function(action){
    
    ///<input id="char_upload" type="file" name="image" data-url="/characters/images" multiple>
		var template = _.template( $("#upload_form_template").html(),{'upload_type':"image" });

    var form = $(template)
      .appendTo('body')
      //.attr({"action": "/characters/images", "method":"post","enctype":"multipart/form-data"  })
      .attr({"action": action , "method":"post","enctype":"multipart/form-data"  })
      .ajaxForm(function() { 
          alert("Thank you"); 
          $(form).remove();
        });

    $('.cancel_button',form).click(function(){ $(form).remove()});
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
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();
        var author = $(this).find('author').text();
        var description = $(this).find('description').text();

        var text = name +', '+ description +', by '+ author;
        
				var list_id = "#music_picker .picker_list"

        console.log(name);
        Picker.prototype.setTextItem(list_id,id,text,id + ': '+name);
      }
    );
  },

  parseBackgroundXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('background-image').each(
      function(){
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();
        var author = $(this).find('author').text();
        var description = $(this).find('description').text();

        var text = name +', '+ description +', by '+ author;
        var list_id = '#background_picker .picker_list';

        console.log(id);
        Picker.prototype.setImageItem(list_id,id,text,config.background_idtourl(id));
      }
    );
  },

  parseCharacterImageXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('character-image').each(
      function(){
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        var character_id = $(this).find('character-id').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();
        var author = $(this).find('author').text();
        var description = $(this).find('description').text();
        var text = name +', '+ description +', by '+ author;
        var list_id = '#character_item_'+character_id;

        Picker.prototype.setImageListItem(list_id,id,text,config.character_image_idtourl(id));
      }
    );
  },

  parseCharacterXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('character').each(
      function(){
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        var author = $(this).find('author').text();
        var description = $(this).find('description').text();
        var text = name +', '+ description +', by '+ author;

        if( $('#character_item_'+id).length == 0 ){
          $($('#picker_item_template').html())
            .attr({ 'id':'character_item_'+id ,'title': text })
            .appendTo('#character_picker .picker_list')
            .click(function(){ $('.add_character_image_button','#character_item_'+id).toggle() });
          
					$('.add_character_image_button','#character_item_'+id).click(function(){
            Picker.prototype.appendForm("/characters/images"); 
          });
        }
        //console.log($('#character_item_'+id ));
      }
    );
  },


  setTextItem: function(list_id,id,text,name){
    var item = $('<li id="pick_item'+id+'" class="picker_item picker_elem" title="'+ text+'"><p>' + name + '</p></li>');
    item.appendTo($(list_id));

    item.click(function(){
        if(Picker.prototype.selectedCallback){
          Picker.prototype.selectedCallback(id);
          Picker.prototype.finish();
        }
      });
  },

  setImageItem: function(list_id,id,text,url){
    var item = $('<li id="pick_item'+id+'" class="picker_item" title="'+ text+'"><img src="' + url + '"></li>');
    //item.appendTo($(list_id)).tooltip();
    
    item.appendTo($(list_id));
    item.click(function(){
      if(Picker.prototype.selectedCallback){
      //set img elem for use img tag information.
        Picker.prototype.selectedCallback(id,$('img',item)[0]);
        Picker.prototype.finish();
      }
      });
  },


  setImageListItem: function(list_id,id,text,url){
    var item = $('<li id="pick_item'+id+'" class="picker_item" title="'+ text+'"><img src="' + url + '"></li>');
    //item.appendTo($(list_id)).tooltip();
    if(! $('.list_header img',list_id).attr('src') ){
      console.log($(list_id));
      $('.list_header img',list_id).attr('src',url);
    }

    $(list_id).click(function(){
      //click hide and show
      if($("#pick_item"+id ).length > 0 ){
        $("#pick_item"+id ).toggle();
      }else{
        item.appendTo($('.image_list',list_id));
        item.click(function(){
          if(Picker.prototype.selectedCallback){
            //set img elem for use img tag information.
            Picker.prototype.selectedCallback(id,$('img',item)[0]);
            Picker.prototype.finish();
          }
        });
      }
    });
  },

  setCallback: function(func) {
    Picker.prototype.selectedCallback = func;
  },

  showCharacterList: function(callback){
    if( !Picker.prototype.isCharacterListAppended){
      Picker.prototype.loadXml("/characters.xml" , Picker.prototype.parseCharacterXml );
      Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.parseCharacterImageXml );
      Picker.prototype.isCharacterListAppended = true;
    }
    Picker.prototype.selectedCallback = callback;
    
    if(! Picker.prototype.visible)$('#character_picker').show('drop','fast');
    Picker.prototype.visible = true;
    Picker.prototype.isBlurable = true;
  },

  showBackgroundList: function(callback){
    if( !Picker.prototype.isBackgroundListAppended){
      $('#picker').find($('.picker_item')).remove();
      Picker.prototype.loadXml("/background_images.xml" , Picker.prototype.parseBackgroundXml );
      Picker.prototype.isBackgroundListAppended = true;
    }
    Picker.prototype.selectedCallback = callback;
		
    if(! Picker.prototype.visible)$('#background_picker').show('drop','fast');
    Picker.prototype.visible = true;
    Picker.prototype.isBlurable = true;
  },

  showMusicList: function(callback){
   if( !Picker.prototype.isMusicListAppended){ 
      $('#picker').find($('.picker_item')).remove();
      Picker.prototype.setTextItem('null','音楽なし','No BGM');
      Picker.prototype.loadXml("/background_musics.xml" , Picker.prototype.parseMusicXml );
      Picker.prototype.isMusicListAppended = true;
    }
    Picker.prototype.selectedCallback = callback;
    
    if(! Picker.prototype.visible)$('#music_picker').show('drop','fast');
    Picker.prototype.visible = true;
    Picker.prototype.isBlurable = true;
  },

  showPicker: function() {
      if(! Picker.prototype.visible)$('#picker').show('drop','fast');
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
