
function Picker( ){

}

Picker.prototype = {

  selectedCallback: null,

  visible : false,

  initialize: function(){
    $('#picker').blur(Picker.prototype.onBlur);
    $('#picker').click(function(ev){ev.stopPropagation(); });
    $("#picker").hide();
    $("#picker").tabs();
    $('#picker_cancel_button').click(Picker.prototype.finish);
    //$('#picker_upload_button').click(Picker.prototype.appendForm)
    $('#character_upload_button')  .click(function(){ Picker.prototype.appendForm("/characters/images");} );
    $('#background_upload_button') .click(function(){ Picker.prototype.appendForm("/background_images");} );
    $('#music_upload_button')      .click(function(){ Picker.prototype.appendForm("/background_musics"); } );
  },

  onBlur: function(ev){
    //console.log(ev);
    if (Picker.prototype.isBlurable) {
      console.log(Picker.prototype.isBlurable);
      if( !$(ev.target).is('#picker') && !$(ev.target).is('.picker_item') && !$(ev.target).is('.item_image')){
        Picker.prototype.finish();
      }
    }else {
      Picker.prototype.isBlurable = true;
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
        var auther = $(this).find('auther').text();
        var description = $(this).find('description').text();

        var text = name +', '+ description +', by '+ author;

        console.log(name);
        Picker.prototype.setTextItem(id,text,id + ': '+name);
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
        var author = $(this).find('auther').text();
        var description = $(this).find('description').text();

        var text = name +', '+ description +', by '+ author;

        console.log(id);
        Picker.prototype.setImageItem(id,text,config.background_idtourl);
      }
    );
  },

  parseCharacterXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('character-image').each(
      function(){
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();
        var author = $(this).find('author').text();
        var description = $(this).find('description').text();
        var text = name +', '+ description +', by '+ author;

        Picker.prototype.setImageItem(id,text,config.character_image_idtourl);
      }
    );
  },

  setTextItem: function(id,text,name){
    var item = $('<li id="pick_item'+id+'" class="picker_item" title="'+ text+'"><p>' + name + '</p></li>');
    item.appendTo($('#picker_list'));

    item.click(function(){
        if(Picker.prototype.selectedCallback){
          Picker.prototype.selectedCallback(id);
          Picker.prototype.finish();
        }
      });
  },

  setImageItem: function(id,text,urlGetter){
    var url = urlGetter(id);
    var item = $('<li id="pick_item'+id+'" class="picker_item" title="'+ text+'"><img src="' + url + '"></li>');
    item.appendTo($('#picker_list'));

    item.click(function(){
        if(Picker.prototype.selectedCallback){
        //set img elem for use img tag information.
          Picker.prototype.selectedCallback(id,$('img',item)[0]);
          Picker.prototype.finish();
        }
      });
  },

  setCallback: function(func) {
    Picker.prototype.selectedCallback = func;
  },

  showCharacterList: function(func){
    Picker.prototype.setList("/characters/images.xml" , Picker.prototype.parseCharacterXml,func );
    $('.upload_button').hide();
    $('#character_upload_button').show();
  },

  showBackgroundList: function(func){
    Picker.prototype.setList("/background_images.xml" , Picker.prototype.parseBackgroundXml ,func);
    $('.upload_button').hide();
    $('#background_upload_button').show();
  },

  showMusicList: function(func){
    Picker.prototype.setList("/background_musics.xml" , Picker.prototype.parseMusicXml,func );
    $('.upload_button').hide();
    $('#music_upload_button').show();
  },

  setList:function(xml,parser,callback){
    Picker.prototype.selectedCallback = callback;
    if(!Picker.prototype.visible){
        Picker.prototype.loadXml(xml , parser );
      $('#picker').show('drop','fast');
      Picker.prototype.visible = true;
    }
  },

  finish: function(){
    if(Picker.prototype.visible){
      $('#picker').find($('.picker_item')).remove();
      $('#picker').hide('drop','hide');
      Picker.prototype.visible = false;
    }
    Picker.prototype.isBlurable = false;
  }

};

// character upload
$(function () {
  $('#character_upload').fileupload({
    dataType: 'json',
    done: function(e, data) {
      alert('done');
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


});
