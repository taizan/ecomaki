  //= require jquery.jStageAligner


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
    $('#picker_upload_button').click(Picker.prototype.appendForm)
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

  appendForm: function(){
		//var template = _.template( $("#bootstrap_form_template").html(),{});
    
		var template = _.template( $("#char_form_template").html(),{});

    $(template)
      .appendTo('body')
      .attr({'action': '/characters' })
      .ajaxForm(function() { 
          alert("Thank you"); 
        }); ;
    //alert();
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
        console.log(name);
        Picker.prototype.setTextItem(id,id + ';'+name);
      }
    );
  },

  parseBackgroundXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('background-image').each(
      function(){
        var id = $(this).find('id').text();
        //var name = $(this).find('name').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();
        var auther = $(this).find('auther').text();
        var description = $(this).find('description').text();
        console.log(id);
        Picker.prototype.setImageItem(id,config.background_idtourl);
      }
    );
  },

  parseCharacterXml: function(xml,status){
    if(status!='success')return;

    $(xml).find('character-image').each(
      function(){
        var id = $(this).find('id').text();
        //var name = $(this).find('name').text();
        //var height = $(this).find('height').text();
        //var width = $(this).find('width').text();
        var auther = $(this).find('auther').text();
        var description = $(this).find('description').text();
        Picker.prototype.setImageItem(id,config.character_image_idtourl);
      }
    );
  },

  setTextItem: function(id,text){
    var item = $('<li id="pick_item'+id+'" class="picker_item"><p>' + text + '</p></li>');
    item.appendTo($('#picker_list'));

    item.click(function(){
        if(Picker.prototype.selectedCallback){
          Picker.prototype.selectedCallback(id);
          Picker.prototype.finish();
        }
      });
  },

  setImageItem: function(id,urlGetter){
    var url = urlGetter(id);
    var item = $('<li id="pick_item'+id+'" class="picker_item"><img src="' + url + '"></li>');
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
  },

  showBackgroundList: function(func){
    Picker.prototype.setList("/background_images.xml" , Picker.prototype.parseBackgroundXml ,func);
  },

  showMusicList: function(func){
    Picker.prototype.setList("/background_musics.xml" , Picker.prototype.parseMusicXml,func );
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
