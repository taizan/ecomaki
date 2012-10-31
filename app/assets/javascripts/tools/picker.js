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


  parseCharacterXml: function(xml,status){
    //alert('parse');
    if(status!='success')return;

    $(xml).find('character').each(
      function(){
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        var height = $(this).find('height').text();
        var width = $(this).find('width').text();
        var auther = $(this).find('auther').text();
        var description = $(this).find('description').text();
        Picker.prototype.setItem(id);
      }
    );
  },


  setItem: function(id){
    var item = $('<li id="pickItem'+id+'" class="pickerItem"><img src="/characters/image/' + id + '"></li>');
    //  add item to pickerList
    item.appendTo($('#picker_list'));

    var img = new Image();
    img.src = '/characters/image/'+id;

    var callback = Picker.prototype.selectedCallback;
    var finish = Picker.prototype.finish;

    console.log(callback);


    item.click(function(){
        if(Picker.prototype.selectedCallback){
          Picker.prototype.selectedCallback(img);
          Picker.prototype.finish();
        }
      });
  },

  setCallback: function(func) {
    Picker.prototype.selectedCallback = func;
  },

  show: function(){
    if(!Picker.prototype.visible){
      Picker.prototype.loadXml("/characters.xml" , Picker.prototype.parseCharacterXml );
      $('#picker').show('drop','fast');
      $('#pickerCancelBtn').click(Picker.prototype.finish);
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
