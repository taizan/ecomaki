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
  
  target: {},
  item: {},

	bar: $('<div id="textMenu"></div>')
		.appendTo($('body'))
		.width(100)
		.height(14),

  changeSelecter: function(target){
    //console.log('on item click');
		//console.log($('#textMenu .text_menu'));
    //$('#textMenu .text_menu').remove();
      
    TextEditMenu.prototype.target = this.target;
    TextEditMenu.prototype.item = this.item;
    console.log( TextEditMenu.prototype.item);

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

		$('.borderRadiuses', selecter).ImageSelect({width:'20px', backgroundColor:'transparent'});
   
		$('.borderTypes', selecter).ImageSelect({height:'20px', width:'50px'});

		$('.fontBackgroundColors', selecter).ImageSelect({width:'16px',height:'16px'});

  },

  applyTarget: function(){ 
    var item = TextEditMenu.prototype.item;
    var setFont = TextEditMenu.prototype.setFont;
    var selecter = TextEditMenu.prototype.selecter;

		//if(this.item.get('font_color'))
      //$('.fontColors option[value="'+this.item.get('font_color')+'"]',this.selecter).prop('selected',true);
			//console.warn(this.item.get('font_color'));


		if(item.get('background_color')) 
      $('.fontBackgroundColors option[value="'+item.get('background_color')+'"]',selecter).prop('selected',true);

		if(item.get('border_style')) 
      $('.borderTypes option[value="'+item.get('border_style')+'"]',selecter).prop('selected',true);

		if(item.get('border_width')) 
      $('.borderWidths option[value="'+item.get('border_width')+'"]',selecter).prop('selected',true);

		if(item.get('border_radius')) 
      $('.borderRadiuses option[value="'+item.get('border_radius')+'"]',selecter).prop('selected',true);

    // onSelect function is called on initializing of colorpicker 2 times 
    // to prevent put in vain , do not call call save on initilizing picker
    var isColorPickerInitialized = false;
    
		$('.fontColors', selecter).empty().wColorPicker({
			mode:'click',
			initColor: item.get('font_color') || '#000000',
			onSelect: function(color){
        if(isColorPickerInitialized){
				  item.set('font_color', color);
    		  item.save();
				  TextEditMenu.prototype.applyFont();
          // console.log('set');
			  }
      }
		});

    isColorPickerInitialized = true;

    //$('.fontSizes',selecter).change( setFont );
    $('.fontStyleTypes',selecter).change( setFont );
		$('.fontFamilyTypes',selecter).change( setFont );
		//$('.fontColors',this.selecter).change( _self.setFont );
		$('.fontBackgroundColors',selecter).change( setFont );
    $('.borderTypes',selecter).change( setFont );
    $('.borderWidths',selecter).change( setFont );
    $('.borderRadiuses',selecter).change( setFont );
  },

  setFont: function(){
    var item = TextEditMenu.prototype.item;
    var selecter = TextEditMenu.prototype.selecter;
    
    console.log('set font');
    item.set('font_size', $('.fontSizes',selecter).val());
		item.set('font_style', $('.fontStyleTypes',selecter).val());
		item.set('font_family', $('.fontFamilyTypes',selecter).val());
		//item.set('font_color', $('.fontColors',selecter).val());
		item.set('background_color', $('.fontBackgroundColors',selecter).val());
    item.set('border_style', $('.borderTypes',selecter).val());
    item.set('border_width', $('.borderWidths',selecter).val());
    item.set('border_radius', $('.borderRadiuses',selecter).val());
    item.save();
		TextEditMenu.prototype.applyFont();
    console.log('set');
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
