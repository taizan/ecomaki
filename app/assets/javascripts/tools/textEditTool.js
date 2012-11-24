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
  
  target: {},
  item: {},

	bar: $('<div id="textMenu"></div>')
		.appendTo($('body')),

  changeSelecter: function(target){
    console.log('on text click');
		//console.log($('#textMenu .text_menu'));
    //$('#textMenu .text_menu').remove();
      
    TextEditMenu.prototype.target = this.target;
    TextEditMenu.prototype.item = this.item;
    //console.log( TextEditMenu.prototype.item);

    if(!TextEditMenu.prototype.isAppended){
      TextEditMenu.prototype.appendTextEditMenuTo();
    }
    TextEditMenu.prototype.applyTarget();

		var offset = target.offset();
		TextEditMenu.prototype.bar.css({
			position: 'absolute',
			left: offset.left + "px",
			top: (offset.top + target.height()) + "px",
			'z-index': 9999,
		});
    $('#textMenu .text_menu').show();

		//$('textMenu').show();
  },
              
  appendTextEditMenuTo: function(){    
    TextEditMenu.prototype.isAppended = true;

    var selecterTemplate =  $("#text_menu_template").html();
    var selecter = $(selecterTemplate);
    TextEditMenu.prototype.selecter = selecter;

    $(selecter).appendTo($('#textMenu'));

    $('.font_size_radio').buttonset();

    $('.borderRadiuses', selecter).buttonset();

		//$('.borderRadiuses', selecter).ImageSelect({width:20, height:20, dropdwonWidth:20, backgroundColor:'transparent'});
   
		$('.borderTypes', selecter).ImageSelect({height:'20px'});

		$('.fontBackgroundColors', selecter).ImageSelect({height:'16px'});

    var setFont = TextEditMenu.prototype.setFont;

    $('.font_size_radio',selecter).change( setFont );
    $('.fontStyleTypes',selecter).change( setFont );
		$('.fontFamilyTypes',selecter).change( setFont );
		$('.fontBackgroundColors',selecter).change( setFont );
    $('.borderTypes',selecter).change( setFont );
    $('.borderWidths',selecter).change( setFont );
    $('.borderRadiuses',selecter).change( setFont );
  },

  applyTarget: function(){ 
    var item = TextEditMenu.prototype.item;
    var selecter = TextEditMenu.prototype.selecter;

    TextEditMenu.prototype.isInitialized = false;

		//if(this.item.get('font_color'))
      //$('.fontColors option[value="'+this.item.get('font_color')+'"]',this.selecter).prop('selected',true);
			//console.warn(this.item.get('font_color'));

		if(item.get('font_family')) 
      $('.fontFamilyTypes option[value="'+item.get('font_family')+'"]',selecter).prop('selected',true);
  
    console.log( item.get('font_size'));
    $('.font_size_radio label',selecter).removeClass('ui-state-active');
    if(item.get('font_size') <= 8 )       $('.font_size_radio label[value="8"]',selecter).addClass('ui-state-active');
    else if(item.get('font_size') <= 12 ) $('.font_size_radio label[value="12"]',selecter).addClass('ui-state-active');
    else if(item.get('font_size') <= 24 ) $('.font_size_radio label[value="24"]',selecter).addClass('ui-state-active')
    else                                  $('.font_size_radio label[value="48"]',selecter).addClass('ui-state-active');
       

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
				  TextEditMenu.prototype.applyFont();
          // console.log('set');
			  }
      }
		});
    
    $('._wColorPicker_paletteHolder').width(237).height(197);

		//var cp = $('.fontColors', selecter).data('_wColorPicker');
    //cp.colorSelect(cp, item.get('font_color') || '#000000' );

		console.log(item.get('border_radius'));
		if( item.get('border_radius') > 0 ){
			$('.borderRadiuses input').attr("checked", true);
			$('.borderRadiuses label').addClass("ui-state-active");
		}else{
			$('.borderRadiuses input').attr("checked", false);
			$('.borderRadiuses label').removeClass("ui-state-active");
		}
		
    TextEditMenu.prototype.isInitialized = true;


  },

  setFont: function(){
    var item = TextEditMenu.prototype.item;
    var selecter = TextEditMenu.prototype.selecter;
    
    var borderWidth = 1;
    if( $('.borderTypes',selecter).val() == "double") borderWidth = 3;
    if( $('.borderTypes',selecter).val() == "dotted") borderWidth = 2;

    if(TextEditMenu.prototype.isInitialized){
			var setting = {
          'font_size': $('.font_size_radio',selecter).find('label[aria-pressed=true]').attr('value'),
  	  	  'font_style': $('.fontStyleTypes',selecter).val(),
	      	'font_family': $('.fontFamilyTypes',selecter).val(),
		      'background_color': $('.fontBackgroundColors',selecter).val(),
          'border_style': $('.borderTypes',selecter).val(),
          'border_width': borderWidth,
          'border_radius': $('.borderRadiuses input')[0].checked ? 30 : 0
    	};
   		item.save(setting);
			TextEditMenu.prototype.applyFont();
   		console.log('set');
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
		//console.log(size);

		var family = item.get('font_family');
		if(!family) {family = "Arial,'ＭＳ Ｐゴシック',sans-serif" ;}
		else { family += ", Arial,'ＭＳ Ｐゴシック',sans-serif"; }
		
		var borderRadius = item.get('border_radius');
		if(!borderRadius){ boderRadius = 20; }
    borderRadius += 'px';
    //console.log(borderRadius);
    
		var background = item.get('background_color');
		if(!background){ background = 'white'; }

		$(target).css({
			'color': color,
			'font-size': size,
      'line-height': size,
			'font-family': family,
			'border': border,
		  'border-radius': borderRadius,         /* CSS3 */
      '-moz-border-radius': borderRadius,    /* Firefox */
      '-webkit-border-radius': borderRadius, /* Safari,Chrome */
			'background': background
		});
	},

  finish: function(){

    
    $('#textMenu .text_menu').hide();
  },

  onBlur: function(){
    TextEditMenu.prototype.finish();
  }

}

/*
TextEdit = function(){ }

TextEdit.prototype = {
  
  isAppended: false,

  onBlur: function(ev){
    //console.log(ev);
  },
  editableTextarea: function(target,callback){
    console.log(target);

    if ($('.editable_text') != []){
    //  TextEdit.prototype.isAppended = true;

      var text = $('.text',target).html();
      if(text === null || text === undefined){
        text = "[        ]";
      }else{
        console.log(text);
        text = text.split("<br>").join('\n');
        text = text
          .replace(/&amp;/g,"&")
          .replace(/&quot;/g,"/")
          .replace(/&#039;/g,"'")
          .replace(/&lt;/g,"<")
          .replace(/&gt;/g,">");
      }

      var focusedText = $( '<textarea class="editable_text" style="vertical-align: middle; text-align:center;" ></textarea>' )
          .height( $(target).height() ).width ( $(target).width() )
          .css({position: 'absolute', left:-5 ,top: -5})
          .appendTo(target)
          .focus().select()
          .autosize()
          .val(text);

      focusedText.blur(
        function() {
         var txt = $(this).val();
         $('.text',target).text(txt);
         txt = $('.text',target).html().split('\n').join('<br>') ;
         console.log(txt);
          $('.text',target).html(txt);

          callback( txt);

          $(this).remove();
    //      TextEdit.prototype.isAppended = false;
      });
    }
  }, 
  

}

//temp code
function editableTextarea(target,callback){
  TextEdit.prototype.editableTextarea(target,callback);
}
*/
