//= require underscore
//= require backbone
//= require jquery.form


$(function() {
	
	var appendForm = function(){
		//generate string from template
    var template = _.template( $("#novel_form_template").html(),{});
    
    var form = $(template)
      .appendTo('body')
      .attr({"action": "/novel" , "method":"post" });

    $('.cancel_button',form).click(function(){ $(form).remove()});
	};
  
  $('#create_button').click(appendForm);

});



