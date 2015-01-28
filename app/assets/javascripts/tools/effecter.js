function Effecter(target,item,key,name){
	this.target = target;
	this.item = item;
	this.key = key;
  this.name = name;
	_.bindAll(this,
        "changeSelecter",
        "runSelectedEffect",
        "runEffect",
        "effectCallback",
        "resetEffect",
        "appendEffectSelecterTo",
        "setEffect"
      );
};

Effecter.prototype = {
	changeSelecter: function(){
      //console.log('on item click');
      $('#effecter_tab .effect_selecter').remove();
      this.appendEffectSelecterTo($('#effecter_tab'));
      //$('#toolbox .selecter_item').effect('highlight','slow');
  },

	runSelectedEffect: function(){
		var option = this.item.get(this.key);
    if(option != null){
      var options = option.split(',');
      this.runEffect(options[0],options[1],parseInt(options[2]),{});
    }
    //this.runEffect(this.model.get('option'));
	},
	
  isRunnable: true,

  runEffect: function(selectedFunction , selectedEffect , speed , options){
    var options = {};
    // some effects have required parameters
    if ( selectedEffect === "scale" ) {
      options = { percent: 0 };
    } else if ( selectedEffect === "size" ) {
      options = { to: { width: 200, height: 60 } };
    } 

    console.log(this.target);

    //prevent overrapping of effect    
    if(this.isRunnable){
      switch(selectedFunction){
        case "show" :
          if(selectedEffect == 'none'){
            $(this.target).show( speed, this.effectCallback );
          }else{
            $(this.target).show( selectedEffect, options, speed, this.effectCallback );
          }
          break; 
        case "hide" :
          if(selectedEffect == 'none'){
            $(this.target).hide( speed, this.effectCallback );
          }else{
            $(this.target).hide( selectedEffect, options, speed, this.effectCallback );
          }
          break; 
        case "effect" :
          if(selectedEffect == 'none'){
            $(this.target).show( speed, this.effectCallback );
          }else{
            $(this.target).effect( selectedEffect, options, speed, this.effectCallback );
          }
          break;
      }
      this.isRunnable = false;
    }
  },

  effectCallback: function(){
    this.isRunnable = true;
  },

  resetEffect: function(){
    //console.log("reset effect");
    //$(this.target).stop();
    var option = this.item.get(this.key);
    if(option != null){
      var options = option.split(',');
      switch(options[0]){
        case "none" :
          $(this.target).show();
          break; 
        case "show" :
          $(this.target).hide();
          break; 
        case "hide" :
          $(this.target).show();
          break; 
        case "effect" :
          $(this.target).show();
          break;
      }
    }
  },
  
  appendEffectSelecterTo: function(target){    
    var selecterTemplate =  $("#effect_selecter_template").html();
    this.selecter = $(selecterTemplate);
    $(this.selecter).appendTo(target);
   
    $('.item_name',this.selecter).html(this.name);  
    var option = this.item.get(this.key);
    if(option != null){
      var options = option.split(',');
      $('.functionTypes option[value="'+options[0]+'"]',this.selecter).prop('selected',true); 
      $('.effectTypes option[value="'+options[1]+'"]',this.selecter).prop('selected',true); 
      $('.durations',this.selecter).val(options[2]); 
    }
    
    $('.functionTypes',this.selecter).change( this.setEffect );
    $('.effectTypes',this.selecter).change( this.setEffect );
    //$(this.selecter).find('.easeTypes').change( this.setEffect );
    $('.durations',this.selecter).change( this.setEffect );  

    $('.run_button',this.selecter).click(this.runSelectedEffect);
    $('.reset_button',this.selecter).click(this.resetEffect);
    return this.selecter;
  },

  setEffect: function(){
    var optionString = 
        $(this.selecter).find('.functionTypes').val() + "," +
        $(this.selecter).find('.effectTypes').val() + "," +
        //$(this.selecter).find('.easeTypes').val() + "," +
        $(this.selecter).find('.durations').val();
    console.log(optionString);
    this.item.set(this.key,optionString);
    this.item.save();
  }
	
}
