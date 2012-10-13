//= require jquery.jStageAligner


function Picker( callbackFunc ){
  this.callback = callbackFunc;
  this.initialize.apply(this, arguments);
}

Picker.prototype = {
  initialize: function(){
    _.bindAll(this, "parseCharacterXml","setItem");
    console.log(this.target);
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
    var _self = this;

    $(xml).find('character').each(
      function(){
        var id = $(this).find('id').text();
        var name = $(this).find('name').text();
        var height = $(this).find('height').text();
        var width = $(this).find('width').text();
        var auther = $(this).find('auther').text();
        var description = $(this).find('description').text();
        _self.setItem(id);
      }
    );
  },


  setItem: function(id){
    var item = $('<li id="pickItem'+id+'" class="pickerItem"><img src="/characters/image/' + id + '"></li>');
    //  add item to pickerList
    item.appendTo($('#pickerList'));

    var img = new Image();
    img.src = '/characters/image/'+id;

    var callback = this.callback;
    var finish = this.finish;

    console.log(callback);


    item.click(function(){
      callback(img);
      finish();
      /*
       target.src = img.src;
       if(content.height() < img.height){
       img.width = img.width * content.height() / img.height;
       img.height=content.height(); //this must do after upper line
       }
       if(content.width() < img.width){
       img.height = img.height * content.width() / img.width;
       img.width=content.width();
       }

       $(target).width(img.width).height(img.height);
       //parent access is not beatiful
       $(target).parent().width(img.width).height(img.height);

       console.log(img.height + "," + img.width );
       console.log(target.height + "," + target.width );
       $('#picker').find($('img')).remove();
       $('#picker').hide('fast')
       */
    });
  },

  pickImage: function(ev){
    //selectedImage = ev.target;
    this.loadXml("/characters.xml" , this.parseCharacterXml );
    $('#picker').show('fast');
    $('#pickerCancelBtn').click(this.finish);
    $('#picker').blur(this.finish);

  },

  finish: function(){
    $('#picker').find($('img')).remove();
    $('#picker').hide();
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
      alert(data);
    }
  });
});
