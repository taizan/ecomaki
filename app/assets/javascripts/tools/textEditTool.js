//= require ./imageselect

function TextEditMenu(target,item){
  this.target = target;	
  this.item = item;
  _.bindAll(this,
      'changeSelecter',
			'appendTextEditMenuTo',
			'setFont',
			'applyFont');
};

TextEditMenu.prototype = {
  
  isAppended: false,
  
  isInitialized: false,
  

	bar: $('<div id="textMenu"></div>')
		.appendTo($('body')),

  changeSelecter: function(target){
    //console.log('on text click');
		//console.log($('#textMenu .text_menu'));
    //$('#textMenu .text_menu').remove();
      
    TextEditMenu.prototype.target = this.target;
    TextEditMenu.prototype.item = this.item;
    //console.log( TextEditMenu.prototype.item);

    if(!TextEditMenu.prototype.isAppended){
      TextEditMenu.prototype.appendTextEditMenuTo();
			setTimeout(TextEditMenu.prototype.applyTarget, 1);
    }else{
    	TextEditMenu.prototype.applyTarget();
		}

		var offset = $(target).offset();
		TextEditMenu.prototype.bar.css({
			position: 'absolute',
			left: offset.left + "px",
			top: (offset.top + $(target).height()) + "px",
			'z-index': 9999,
		});

		//this.initMenu();
		//console.log(this.item);
    $('#textMenu .text_menu').show();

		//TextEditMenu.prototype.applyTarget();
		//TextEditMenu.prototype.applyFont();
		//$('textMenu').show();
  },
              
  appendTextEditMenuTo: function(){    
		//console.warn("appending");

    var selecterTemplate =  $("#text_menu_template").html();
    var selecter = $(selecterTemplate);
    TextEditMenu.prototype.selecter = selecter;

    $(selecter).appendTo($('#textMenu'));

    $('.font_size_radio').buttonset();

    $('.borderRadiuses', selecter).buttonset();

		//$('.borderRadiuses', selecter).ImageSelect({width:20, height:20, dropdwonWidth:20, backgroundColor:'transparent'});
   
		//$('.borderTypes', selecter).ImageSelect({height:'20px'});
		$('.borderTypes', selecter).ImageSelect({height:20});

		//$('.fontBackgroundColors', selecter).ImageSelect({height:'16px'});
		$('.fontBackgroundColors', selecter).ImageSelect({height:16});

    var setFont = TextEditMenu.prototype.setFont;

    $('.font_size_radio',selecter).change( setFont );
    //$('.font_size_radio',selecter).click( setFont );
    $('.fontStyleTypes',selecter).change( setFont );
		$('.fontFamilyTypes',selecter).change( setFont );
		$('.fontBackgroundColors',selecter).change( setFont );
    $('.borderTypes',selecter).change( setFont );
    $('.borderWidths',selecter).change( setFont );
    $('.borderRadiuses',selecter).change( setFont );

    TextEditMenu.prototype.isAppended = true;
  },
	
  applyTarget: function(){ 
		//console.log("=======applyTarget=======================================");
    var item = TextEditMenu.prototype.item;
    var selecter = TextEditMenu.prototype.selecter;

		//console.log(item.get('border_style'));
    TextEditMenu.prototype.isInitialized = false;

		//if(this.item.get('font_color'))
      //$('.fontColors option[value="'+this.item.get('font_color')+'"]',this.selecter).prop('selected',true);
			//console.warn(this.item.get('font_color'));

		if(item.get('font_family')) 
      $('.fontFamilyTypes option[value="'+item.get('font_family')+'"]',selecter).prop('selected',true);
  
    //console.log( item.get('font_size'));
		$('.font_size_radio input',selecter).attr('checked', false)
    if(item.get('font_size') <= 12 ){
			$('.font_size_radio input#font_size_s',selecter).attr('checked', true)
		}else if(item.get('font_size') <= 16 ){
			$('.font_size_radio input#font_size_m',selecter).attr('checked', true)
		}else if(item.get('font_size') <= 28 ){
			$('.font_size_radio input#font_size_L',selecter).attr('checked', true)
		}
		$('.font_size_radio',selecter).buttonset('refresh')

    $('.fontColors').empty();

		$('.fontColors').wColorPicker({
			mode:'click',
      initColor: item.get('font_color') || '#000000',
      buttonSize    : 20,  
      effect: 'none',
			onSelect: function(color){
        if(TextEditMenu.prototype.isInitialized){
				  item.set('font_color', color);
    		  item.save();
					//console.log('check point 1');
				  TextEditMenu.prototype.applyFont();
          // console.log('set');
			  }
      }
		});
    
    $('._wColorPicker_paletteHolder').width(240).height(197);

		//var cp = $('.fontColors', selecter).data('_wColorPicker');
    //cp.colorSelect(cp, item.get('font_color') || '#000000' );

		var value = item.get('border_style') || "solid";
		//console.log( value );
		var btype = $('.borderTypes', selecter);
		var $el = $('option[value="' + value + '"]', btype);
		$('select[name="border"]').val( value )
		$('#jq_imageselect_border .jqis_header img').attr('src', $el.text());

		value = item.get('background_color') || "white";
		var bg = $('.fontBackgroundColors', selecter);
		$el = $('option[value="' + value + '"]', bg);
		$('select[name="fontBackgroundColor"]').val( value )
		$('#jq_imageselect_fontBackgroundColor .jqis_header img').attr('src', $el.text());

		//console.log(item.get('border_radius'));
		value = item.get('border_radius');
		if(value == null){
			value = 30;
		}
		if( value > 0 ){
			$('.borderRadiuses input').attr("checked", true);
			$('.borderRadiuses label').addClass("ui-state-active");
		}else{
			$('.borderRadiuses input').attr("checked", false);
			$('.borderRadiuses label').removeClass("ui-state-active");
		}
		
    TextEditMenu.prototype.isInitialized = true;

		//console.log( $('#jq_imageselect_border .jqis_header img').attr('src') );
		//console.log("===============================================");
  },

  setFont: function(){
    var item = TextEditMenu.prototype.item;
    var selecter = TextEditMenu.prototype.selecter;
    
    var borderWidth = 1;
    if( $('.borderTypes',selecter).val() == "double") borderWidth = 3;
    if( $('.borderTypes',selecter).val() == "dotted") borderWidth = 2;

		//console.log('check ponit 2-1');
    if(TextEditMenu.prototype.isInitialized){
			var setting = {
          'font_size': $('.font_size_radio',selecter).find('label[aria-pressed=true]').attr('value'),
  	  	  'font_style': $('.fontStyleTypes',selecter).val(),
	      	'font_family': $('.fontFamilyTypes',selecter).val(),
		      'background_color': $('.fontBackgroundColors',selecter).val(),
          'border_style': $('.borderTypes',selecter).val(),
          'border_width': borderWidth,
          'border_radius': $('.borderRadiuses input')[0].checked ? 20 : 0
    	};
   		item.save(setting);
			//console.log('check point 2-2');
			TextEditMenu.prototype.applyFont();
   		//console.log('set');
    }
  },
	
	applyFont: function(){
    var item = this.item;
    var target = this.target;
	  //console.log('app font');	
		var border = '';
		border += item.get('border_width') ? item.get('border_width'): 1;
		border += 'px ';
		border += item.get('border_color') ? item.get('border_color')+' ': 'black ';
		border += item.get('border_style') ? item.get('border_style') : 'solid';
				
		var color = item.get('font_color')!=null ? item.get('font_color'): 'balck';
    //console.log(color);
		
		var size = item.get('font_size');
		if(!size) size = 10;
		else if (size > 80) size = 80;
		else if (size < 8 ) size = 8;
    size += 'px';
		//console.log( 'font_size = ' + size );
		//console.log(size);

		var family = item.get('font_family');
		if(!family) {family = "Arial,'ＭＳ Ｐゴシック',sans-serif" ;}
		else { family += ", Arial,'ＭＳ Ｐゴシック',sans-serif"; }
		
		var borderRadius = item.get('border_radius');
		if(!borderRadius){ boderRadius = 20; }
    borderRadius += 'px';
    //console.log(borderRadius);
    
		var backgroundColor = item.get('background_color');
		if(!backgroundColor){ backgroundColor = 'white'; }

    var background ;
		var backgroundId = item.get('entry_balloon_background_id');
		if( backgroundId && backgroundId != "0"){ 
      background = "url('/assets/balloon/"+ backgroundId + ".png')"; 
      console.log(background);
      $(target).css({
			  'color': color,
			  'font-size': size,
        'line-height': size,
			  'font-family': family,
		  	'border': 'none',
		  	'background': background ,
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%',
		  });

    } else {
		
      $(target).css({
			  'color': color,
			  'font-size': size,
        'line-height': size,
			  'font-family': family,
		  	'border': border,
	  	  'border-radius': borderRadius,         /* CSS3 */
        '-moz-border-radius': borderRadius,    /* Firefox */
        '-webkit-border-radius': borderRadius, /* Safari,Chrome */
		  	'background': backgroundColor
		  });
    }
	},

  finish: function(){
    $('#textMenu .text_menu').hide();
  },

  onBlur: function(ev){
    // if target was selected item , not blur
    if( ev.target != $('.text',this.target)[0] )TextEditMenu.prototype.finish();
  }

}
