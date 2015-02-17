//= require jquery.fileupload
//= require jquery.masonry.min 
//= require jquery.imagesLoaded 
//
function Picker( ){}

Picker.prototype = {

  selectedCallback: null,

  visible: false,
  isApeended: false,

  target: {},

  initialize: function(){
    //paste image
    $("body")[0].onpaste = Picker.prototype.onPaste; 

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

  onPaste: function(event){
    console.log("paste");
    var clipboardData = event.clipboardData || event.originalEvent.clipboardData;
    var items = clipboardData.items;
    var blob;
    for (var i = 0; i < items.length; i++){
      if(items[i].type.indexOf("image") === 0){
        blob = items[i].getAsFile();
      }
    }

    if(blob != null) {
      var reader = new FileReader();
      reader.onload =function(event){
        var imgURL = event.target.result;

        $.ajax({
          type: "POST",
          url: "/characters/images", 
          data: ({imageURL : imgURL , character_id : 0 , author: "", description: ""}),
          cache: false,
          success: function(result){
              console.log( result );
              console.log( EntryView.prototype.selected );
              //target.addCharacter(  ); 
              EntryView.prototype.selected.addCharacter( result.id , result.width , result.height );
            }
        });
      };
      reader.readAsDataURL(blob);
    }
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
          // キャラクターのアップロードで名前が無い
          if(  action == "/characters"  &&  $("#input_name").val() == "" ) {
            alert("名称を入力してください");
            return false;
          }
          
          $('.submit_button',form).prop('disabled',true);
          return true;
        },

        success: function( data ) { 
          console.log(data);
          $(form).remove();
          if(confirm('Uploaded')) {
          if(action == "/characters" )  
            //Picker.prototype.loadXml("/characters.xml" , Picker.prototype.appendCharacterJson );
            Picker.prototype.appendCharacterJson ( true );
          
          if(action == "/characters/images" ) { 
            var text = data.description +', by '+ data.author;

            var imageItem= Picker.prototype.setCharacterImageItem(
                           data.character_id , data.id , text , config.character_image_idtourl( data.id ) , true );
            //Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.appendCharacterJson );
            //表示する。 
            $("img",imageItem).attr("src" ,$("img",imageItem).data("src"));
          } 
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
    if(action =="/characters/images" ) { 
      $('<input type="text" id="input_character_id" name="character_id" style="display : none">')
        .appendTo(form).val(id);
    }
    if( action =="/characters") {
      $("#form_label_name" , form ).html("キャラクター名(必須)");
      $("#input_name", form).attr( "placeholder","キャラクター名");
    }

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

  setCharacterImageItem: function( character_id, id, text, url , isAll){
    var item = $('<div id="pick_character_image_item_'+id+'" class="picker_image_item" ><img ></div>').attr('title',text);
    $( "img" ,item).data("src" , url );
    var list_id = '#character_item_'+character_id;

    if(! $('.list_header_button img',list_id ).attr('src') ){
      //console.log($(list_id));
      $('.list_header_button img',list_id ).attr('src',url);
    }else{
      // アイコンの設定のみ
      if(!isAll) return;
    }
    
    function addImageItem(){
      // hide and show
      if($("#pick_character_image_item_"+id ).length == 0 ){
        $('.image_list',list_id ).prepend(item);
        item.click(function(){
          if(Picker.prototype.selectedCallback){
            //set img elem for use img tag information.
            Picker.prototype.selectedCallback({
                'character_image_id': id , 
                'url' : null,
                'width'         :$('img',item).width() ,
                'height'        :$('img',item).height() ,
                'character_id'  :character_id
              });
            Picker.prototype.finish();

            // updete chara by  touch 
            $.ajax({ url: "/characters/touch/"+character_id });
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

    return item;
  },


  appendCharacterJson: function( isUpdate ){

    //キャラ画像の配置
    var loadImage = function( isAll ){
      $.ajax({
        url: "/characters/images.json",
        dataType: "json",
        success: function(data){
          for( var i=0; i<data.length; i++){
            var item = data[i];
            var text = item.description +', by '+ item.author;
      
            Picker.prototype.setCharacterImageItem(
              item.character_id , item.id , text , config.character_image_idtourl( item.id ) , isAll );
          }
          console.log(data);
        }
      });
    };

    //キャラタブの初期化
    $.ajax({
      url: "/characters.json",
      dataType: "json",
      success: function(data){
        //console.log(data);
        for( var i=0; i<data.length; i++){
          var item = data[i];
          var id = item.id;
          //var charId = item.character_id;
          var text = item.name +', '+ item.description +', by '+ item.author;
          
          if( $( '#character_item_'+ id).length >0 ) continue; 
          var header =  $($('#picker_item_template').html())
            .attr({ 'id':'character_item_'+ id ,'title': text })
            .imagesLoaded( function(){  $('.image_list',header).masonry({ itemSelecter: '.picker_image_item'}); });

          if( isUpdate ){
            $('#character_picker .nav-header').after(header);
          }else{
            header.appendTo('#character_picker .picker_list');
          }

          (function(id){ //click時のidの値を保持する
            header.click(function( e ){ 
                console.log(e);
                if( $(e.target).hasClass('add_character_image') === false ){
                  $( '.image_list','#character_item_' + id ).toggle();
                  //console.log( $( '.image_list','#character_item_' + id ) );
                  $( '.add_character_image_button','#character_item_' + id ).toggle();

                  //画像をロード
                  $( ".picker_image_item img" , '#character_item_' + id ).each(function(){
                    $(this).attr("src" ,$(this).data("src"));
                  });
                }
              });

            // init form add button
            $('.add_character_image_button','#character_item_'+id).click(function(){
              Picker.prototype.appendForm("/characters/images","image",id); 
              $('.image_list','#character_item_'+id ).show();
            });

           })(id);
          
	        $('.list_header_name',header).html( item.name );
	        $('.list_header_description',header).html( item.description );
         
        }
     
        //画像をセット
        loadImage(true);
      }
    });

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
            Picker.prototype.selectedCallback({
               'background_image_id' : id,
               'background_url': null ,
            });
            Picker.prototype.finish();
          }
        });
    }

  },


  setCallback: function(func) {
    Picker.prototype.selectedCallback = func;
  },

  showCharacterList: function(callback){
    if( !Picker.prototype.isCharacterListAppended){
      //Picker.prototype.loadXml("/characters.xml" , Picker.prototype.parseCharacterXml );
      //Picker.prototype.loadXml("/characters/images.xml" , Picker.prototype.parseCharacterImageXml );
      Picker.prototype.appendCharacterJson();
      Picker.prototype.isCharacterListAppended = true;

      //set up for url select mode
      $("#character_picker .url_button").click(function(){
           var url = $("#character_picker .url_input").val();
           Picker.prototype.selectedCallback({
               'character_id' : -1,
               'character_image_id' : -1,
               'url': url ,
               'width'  :$('#character_picker .url_img').width() ,
               'height' :$('#character_picker .url_img').height() ,
             });
           Picker.prototype.finish();  
        });
      $("#character_picker .url_input").on( "input" , function(){
          var url = $("#character_picker .url_input").val();
          $("#character_picker .url_img")[0].src = url;
        });
    }
    
    Picker.prototype.showPicker(callback,'#character_picker',600);
  },

  showBackgroundList: function(callback){
    if( !Picker.prototype.isBackgroundListAppended){
      $('#picker').find($('.picker_item')).remove();
      Picker.prototype.loadXml("/background_images.xml" , Picker.prototype.parseBackgroundXml );
      Picker.prototype.isBackgroundListAppended = true;

      //set up for url select mode
      $("#background_picker .url_button").click(function(){
           var url = $("#background_picker .url_input").val();
           Picker.prototype.selectedCallback({
               'background_image_id' : -1,
               'background_url': url ,
             });
           Picker.prototype.finish();  
        });
      $("#background_picker .url_input").on( "input" , function(){
          var url = $("#background_picker .url_input").val();
          $("#background_picker .url_img")[0].src = url;
        });
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

    //reset url image
    $(".character_url").val("");
    $(".url_img")[0].src = "";
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
