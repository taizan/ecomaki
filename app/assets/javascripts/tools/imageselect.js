/*
 * ImageSelect jQuery Plugin
 * Version 1.2
 *
 * lgalvin
 * http://www.liam-galvin.co.uk/imageselect
 *
 */


(function( $ ){

  var methods = {
      init: function(options){
          if(!/select/i.test(this.tagName)){return false;}

            var element = $(this);

          var selectName = element.attr('name');
          var id = 'jq_imageselect_' + selectName;

          if($('#'+id).length > 0){
              //already exists
              return;
          }

          var iWidth= options.width > options.dropdownWidth ? options.width : options.dropdownWidth;

          var imageSelect = $(document.createElement('div')).attr('id',id).addClass('jqis');

          imageSelect.css('width',iWidth+'px').css('height',options.height+'px');

          var header = $(document.createElement('div')).addClass('jqis_header');
          header.css('width',options.width+'px').css('height',options.height +'px');
          header.css('text-align','center').css('background-color',options.backgroundColor);
          header.css('border','1px solid ' + options.borderColor);

          var dropdown = $(document.createElement('div')).addClass('jqis_dropdown');

          dropdown.css('width',options.dropdownWidth+'px');//.css('height',options.dropdownHeight +'px');
          dropdown.css('z-index',options.z).css('background-color',options.backgroundColor).css('border','1px solid ' + options.borderColor);;
          dropdown.hide();

          var selectedImage = $('option:selected',element).text();

          header.attr('lock',options.lock);
          if(options.lock == 'height'){
            header.append('<img style="height:' + options.height + 'px" />');
          }else{
            header.append('<img style="width:' + (options.width-75) + 'px" />');
          }
          

          var $options = $('option',element);

          $options.each(function(i,el){
                //dropdown.append('<img style="width:' + options.dropdownWidth + 'px" onclick="jQuery(\'select[name=' + selectName + ']\').val(\''+ $(el).val() + '\').ImageSelect(\'close\').ImageSelect(\'update\',{src:\''+ $(el).text() + '\'});" src="' + $(el).text() + '"/>');
                //dropdown.append('<img style="width:100%" onclick="jQuery(\'select[name=' + selectName + ']\').val(\''+ $(el).val() + '\').ImageSelect(\'close\').ImageSelect(\'update\',{src:\''+ $(el).text() + '\'});" src="' + $(el).text() + '"/>');
								var $el =  $(el);
								console.log($el.val());
                dropdown.append($('<img style="width:100%" src="' + $el.text() + '">')
									.click(function(){
										$('select[name=' + selectName + ']')
											.val($el.val())
											.ImageSelect('close')
											.ImageSelect('update',{src:$el.text()});
										$el.parent().change();
									}));
          });


          imageSelect.append(header);
          imageSelect.append(dropdown);

          



          element.after(imageSelect);
          element.hide();


          header.attr('linkedselect',selectName);
          header.children().attr('linkedselect',selectName);
          header.click(function(){$('select[name=' + $(this).attr('linkedselect') + ']').ImageSelect('open');});
          //header.children().click(function(){$('select[name=' + $(this).attr('linkedselect') + ']').ImageSelect('open');});

          var w = 0;

          $('.jqis_dropdown img').mouseover(function(){
              $(this).css('opacity',1);
          }).mouseout(function(){
              $(this).css('opacity',0.7);
          }).css('opacity',0.7).each(function(i,el){
            w = w+$(el).width();
          });

          dropdown.css('max-height',options.dropdownHeight + 'px');
            
          /*
          if(w < options.dropdownWidth){
              dropdown.css('height',options.height + 'px');
          }else{
             var mod = (w % options.dropdownWidth);
             var rows = ((w - mod)/options.dropdownWidth) + 1;
             var h = (options.height * rows);
             if(h > options.dropdownHeight){
                dropdown.css('height',options.dropdownHeight + 'px');
                
             }else{
                dropdown.css('height',h + 'px'); 
             }
          }*/

          element.ImageSelect('update',{src:selectedImage});

      },
      
      update:function(options){

          var element = $(this);

          var selectName = element.attr('name');
          var id = 'jq_imageselect_' + selectName;

          if($('#'+id + ' .jqis_header').length == 1){

                var ffix = false;

             if($('#'+id + ' .jqis_header img').attr('src') != options.src){
                 ffix = true; //run fix for firefox
             }

             $('#'+id + ' .jqis_header img').attr('src',options.src).css('opacity',0.1);

             if(ffix){
                 setTimeout(function(){element.ImageSelect('update',options);},1);
                 return;
             }

             if($('#'+id + ' .jqis_header').attr('lock') == 'height'){

                $('#'+id + ' .jqis_header img').unbind('load');

                $('#'+id + ' .jqis_header img').one('load',function(){

                    $(this).parent().stop();
                    //$('.jqis_dropdown',$(this).parent().parent()).stop();
                    $(this).parent().parent().stop();
                    //$(this).parent().animate({width:$(this).width() + 60});
                    $(this).parent().animate({width:$(this).width()});
                    //$(this).parent().parent().animate({width:$(this).width() + 60});
                    $(this).parent().parent().animate({width:$(this).width()});
                    //$('.jqis_dropdown',$(this).parent().parent()).animate({width:$(this).width() + 50});
                    $('.jqis_dropdown',$(this).parent().parent()).animate({width:$(this).width()});

                }).each(function() {
                  if(this.complete) $(this).load();
                });
             }else{
                $('#'+id + ' .jqis_header img').unbind('load');
                $('#'+id + ' .jqis_header img').one('load', function() {
                    $(this).parent().parent().stop();
                    $(this).parent().stop();
                    $(this).parent().parent().css('height',($(this).height()+2) + 'px');
                    $(this).parent().animate({height:$(this).height()+2});
                }).each(function() {
                  if(this.complete) $(this).load();
                });
                
             }

             $('#'+id + ' .jqis_header img').animate({opacity:1});


          }

      },
      open: function(){

          var element = $(this);

          var selectName = element.attr('name');
          var id = 'jq_imageselect_' + selectName;

          var w = 0;

          if($('#'+id).length == 1){

            if($('#'+id + ' .jqis_dropdown').is(':visible')){
                $('#'+id + ' .jqis_dropdown').stop();
                //$('#'+id + ' .jqis_dropdown').slideUp().fadeOut();
            }else{
                $('#'+id + ' .jqis_dropdown').stop();
                var mh = $('#'+id + ' .jqis_dropdown').css('max-height').replace(/px/,'');
                mh = parseInt(mh);

                window.imageHeightTotal = 0;

                $('#'+id + ' .jqis_dropdown').show();

                $('#'+id + ' .jqis_dropdown img').each(function(i,el){
                   window.imageHeightTotal = window.imageHeightTotal + $(el).height();
                });

                var ih = window.imageHeightTotal;

                mh = (ih < mh && ih > 0) ? ih : mh;

                $('#'+id + ' .jqis_dropdown').height(mh);
            }
              
          }
      },
      close:function(){

          var element = $(this);

          var selectName = element.attr('name');
          var id = 'jq_imageselect_' + selectName;

          if($('#'+id).length == 1){

            $('#'+id + ' .jqis_dropdown').slideUp().hide();

          }
      },
      remove: function(){
          if(!/select/i.test(this.tagName)){return false;}

          var element = $(this);

          var selectName = element.attr('name');
          var id = 'jq_imageselect_' + selectName;

          if($('#'+id).length > 0){
              $('#'+id).remove();
              $('select[name=' + selectName + ']').show();
              return;
          }
      }
  };


  $.fn.ImageSelect = function(method,options) {

    if(method == undefined){
        method = 'init';
    }

    var settings = {
        width:200,
        height:75,
        dropdownHeight:250,
        dropdownWidth:200,
        z:99999,
        backgroundColor:'#ffffff',
        border:true,
        borderColor:'#cccccc',
        lock:'height'
    };

    if ( options) { $.extend( settings, options ); }

    if(typeof method === 'object'){$.extend( settings, method );}

    settings.dropdownWidth = settings.width - 10;

    return this.each(function() {
        if ( methods[method] ) {
            return methods[method].apply( this, Array(settings));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, Array(settings) );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.ImageSelect' );
        }
    });

  };
})( jQuery );
