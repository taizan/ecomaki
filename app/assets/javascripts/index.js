//= require underscore
//= require backbone
//= require jquery.form


$(function() {
  // load template	
  var template = _.template( $("#novel_form_template").html(),{});
  
  //append and setting
  var form = $(template)
    .appendTo('body')
    .attr({"action": "/novel" , "method":"post" });
  
  $('.cancel_button',form).click( function(){ $(form).hide('drop','fast'); } );
  // default hided
  $(form).hide();
  
  $('#create_button').click( function(){ $(form).show('drop','fast'); } );

  $(document).tooltip();

});



