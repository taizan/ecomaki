function TextEditer(){
	
};

TextEditer.prototype = {
  changeSelecter: function(){
    console.log('on item click');
    $('._tool_menu .font_selecter').remove();
    this.appendFontSelecterTo($('._tool_menu'));
  },
	
  appendFontSelecterTo: function(target){    
    var selecterTemplate =  $("#font_selecter_template").html();
    this.selecter = $(selecterTemplate);
    $(this.selecter).appendTo(target);
    if(this.item.get(font-size)) 
		  $('.fontSizes option[value="'+this.item.get(font-size)+'"]',this.selecter).prop('selected',true);
		if(this.item.get(font-color)) 
      $('.fontColors option[value="'+this.item.get(font-color)+'"]',this.selecter).prop('selected',true);
    
		_self = this;
    $('.fontSizes',this.selecter).change( _self.setFont );
    $('.fontStyleTypes',this.selecter).change( _self.setFont );
		$('.fontFamilyTypes',this.selecter).change( _self.setFont );
		$('.fontColors',this.selecter).change( _self.setFont );
    $('.borderTypes',this.selecter).change( _self.setFont );
  },

  setFont: function(){
    this.item.set('font_size', $('.fontSizes',this.selecter).val());
		this.item.set('font_style', $('.fontStyleTypes',this.selecter).val());
		this.item.set('font_family', $('.fontFamilyTypes',this.selecter).val());
		this.item.set('font_color', $('.fontColor',this.selecter).val());
    this.item.set('border_style', $('.borderTypes',this.selecter).val());
    this.item.save();
		this.applyFont();
  },
	
	applyFont: function(){
		
		var border = '';
		border += this.item.get('border_width') ? this.item.get('border_width'): 1;
		border += 'px ';
		border += this.item.get('border_color') ? this.item.get('border_color')+' ': 'black ';
		border += this.item.get('border_style') ? this.item.get('border_style') : 'solid';
				
		var color = this.item.get('font_color')!=null ? this.item.get('font_color'): balck;
		
		var size = this.item.get('font_size');
		if(!size) size = 10;
		else if (size > 80) size = 80;
		else if (size < 8 ) size = 8;
		
		var family = this.item.get('font_family');
		if(!family) {family = "Arial,'ＭＳ Ｐゴシック',sans-serif" ;}
		else { family += ", Arial,'ＭＳ Ｐゴシック',sans-serif"; }
		
		var borderRadius = this.nobel.get('borde_radius');
		if(!borderRadius){ boderRadius = 20; }
		
		var background = this.item.get('background_color');
		if(!background){ background = white; }

		$('font',this.target).css({
			'color': color,
			'font-size': size,
			'font-family': family,
			'boder': border,
		  'border-radius': borderRadius,         /* CSS3 */
      '-moz-border-radius': borderRadius,    /* Firefox */
      '-webkit-border-radius': borderRadius, /* Safari,Chrome */
			'background': background
		});
		
	},

}

function editableTextarea(target,callback){
  console.log(target);
  var text = $('.text',target).html();
  if(text == null || text == undefined){
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

  var focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
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
    });
}
