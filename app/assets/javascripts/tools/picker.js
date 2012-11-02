  //= require jquery.jStageAligner


function Picker( ){

}

Picker.prototype = {

  selectedCallback: null,

  visible : false,

  initialize: function(){
    $('#picker').blur(Picker.prototype.finish);
    $("#picker").hide();
    $("#picker").tabs();
    $('#pickerCancelBtn').click(Picker.prototype.finish);
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
    //alert('parse');
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


  setImageItem: function(id,urlGetter){
    var url = urlGetter(id);
    var item = $('<li id="pickItem'+id+'" class="pickerItem"><img src="' + url + '"></li>');
    //  add item to pickerList
    item.appendTo($('#picker_list'));


    var callback = Picker.prototype.selectedCallback;
    var finish = Picker.prototype.finish;

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

  showCharacterList: function(type){
    if(!Picker.prototype.visible){
        Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.parseCharacterXml );
      $('#picker').show('drop','fast');
      Picker.prototype.visible = true;
    }
  },

  showBackgroundList: function(type){
    if(!Picker.prototype.visible){
        Picker.prototype.loadXml("/background_images.xml" , Picker.prototype.parseBackgroundXml );
      $('#picker').show('drop','fast');
      Picker.prototype.visible = true;
    }
  },


  finish: function(){
    console.log('blur'); 
    if(Picker.prototype.visible){
      $('#picker').find($('img')).remove();
      $('#picker').hide('drop','hide');
      Picker.prototype.visible = false;
    }
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
