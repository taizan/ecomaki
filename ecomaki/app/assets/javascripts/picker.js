//= require jquery.jStageAligner


function Picker( target,view ){
   this.target = target;
   this.view = view;
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
    console.log(this.disp_picker);
    var _self = this;

    $(xml).find('character').each(
       function(){
          var id = $(this).find('id').text();
          var name = $(this).find('name').text();
          var height = $(this).find('height').text();
          _self.setItem(id);
       }
     );
 },

 disp_picker: function(){
    // alert();
    var id = $(this).find('id').text();
    var name = $(this).find('name').text();
    var height = $(this).find('height').text();
    this.setItem(id);
 },

 setItem: function(id){
    var item = $('<li id="pickItem'+id+'" class="pickerItem"><img src="/characters/image/' + id + '"></li>');
    //  add item to pickerList
    item.appendTo($('#pickerList'));
    
    // var dim = getActualDimension( $('img',item)[0] );
    //console.log(dim.height() + "," + dim.width() );

    var img = new Image();
    img.src = '/characters/image/'+id;
    //console.log(img.src);
    var target = this.target;    
    console.log(target);

    item.click(function(){
       target.src = img.src;
       
       $(target).width(img.width).height(img.height);
       //parent access is not beatiful
       $(target).parent().width(img.width).height(img.height);

       console.log(img.height + "," + img.width );
       console.log(target.height + "," + target.width );
       $('#picker').find($('img')).remove();
       $('#picker').hide('fast') 
    });
},

 pickImage: function(ev){
  //selectedImage = ev.target; 
  this.loadXml("/characters.xml" , this.parseCharacterXml );
  $('#picker').show('fast');
  $("#pickerCancelBtn").click(function(){
        $('#picker').find($('img')).remove();
	$('#picker').hide();
        }
    );

 }

}

// character upload
$(function () {
    $('#character_upload').fileupload({
         dataType: 'json',
         done: function(e, data) {
         alert('done');
     },
    fail: function(e, data) {
         alert(data)
    }
    });
 });


