//= require jquery.jStageAligner
//position obj is there some nomal one?

var ctor = function(){};

function inherits(parent, protoProps, staticProps) {
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    _.extend(child, parent);

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    if (protoProps) _.extend(child.prototype, protoProps);
    if (staticProps) _.extend(child, staticProps);
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;

    return child;
};

var EntryItem = function(item,view){
	this.view = view;
	this.item = item;
	this.content = this.view.content;
	
	this.defaultInitialize.apply(this,arguments);
	
	this.initialize.apply(this,arguments);
	
}

EntryItem.extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

EntryItem.prototype = {
	// for over ride
	initialize: function(){},
	
	// for over ride
	tmpl: '',
	
	defaultInitialize: function(){
		_.bindAll(this,"onResize","onDragg","appendTo","setButton","init");
		
		this.$el = $(this.tmpl);
		this.el = this.$el[0];
		
		this.$el
			.css({position: 'absolute', top: this.item.get('top'), left: this.item.get('left') })
			.width(this.item.get('width')).height(this.item.get('height'));
	},

	appendTo: function(target){
		this.$el.appendTo(target);
		this.el = this.$el[0];
		this.init();
	},
	
	init: function(){},

	
	onResize: function(){
		this.item.set('width',$(this.el).width());
		this.item.set('height' , $(this.el).height());
	},
	
	onDragg: function(){
		this.item.set('top' , $(this.el).offset().top - $(this.content).offset().top );
		this.item.set('left' , $(this.el).offset().left - $(this.content).offset().left );
	},
	
	setButton: function(target){
      var body = '<i class="icon-remove-sign item-button item-remove" />';
      var button = $(body);
      button.appendTo(target);
      button.hide();	 

      $(target).find('.ui-resizable-handle').hide();
 
	  $(target)
        .mouseover(function(){
            button.show();
            $(this).find('.ui-resizable-handle').show();
        })
        .mouseout(function(){
            button.hide();
            $(this).find('.ui-resizable-handle').hide();
        });
      
	  var removeItem = function(){};
	  
      $('.item-remove',target).click(
            function(){
                   console.log(target);
                   $('.item',target).remove(); 
                   target.remove();
				   removeItem();
            }
         );
   }
   
}




BaloonItem = EntryItem.extend({
	tmpl : '<div class="item baloon item-resizable item-draggable sticky"><div class="text"></div></div>',
	initialize: function(){
		_.bindAll(this,"editText");
		$('.text',this.el).html(this.item.get('text'));
	},
	
	init: function(){
                console.log('init baloon');
                console.log(this.el);
		$(this.el).draggable({
			containment: "parent",
			stop: this.onDragg
		});
		
		$(this.el).resizable({
			containment: "parent",
			stop: this.onResize,
		});
		
		$(this.el).dblclick(this.editText);
		this.setButton(this.el);
	},
	
	editText: function(){
       var text = this.get('text').split("<br>").join('\n');
       text = text
	   			.replace(/&amp;/g,"&")
				.replace(/&quot;/g,"/")
				.replace(/&#039;/g,"'")
				.replace(/&lt;/g,"<")
				.replace(/&gt;/g,">");

       var item = this.item;
       var target = this.el;
      
       focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
                .height( item.get('height') ).width ( item.get('width') )
                .css({position: 'absolute', left:-5 ,top: -5})
				.appendTo(this.el)
                .focus().select()
                .val(text);

      focusedText.blur(function() {
                        var txt = $(this).val();
                        $('.text',target).text(txt);
                        txt = $('.text',target).html().split('\n').join('<br>') ;
                        $('.text',target).html(txt);
                        item.set('text' , txt);
                        $(this).remove();
                 });        
  },
});


ImageItem = EntryItem.extend({
	tmpl: '<img class="item image item-resizable item-draggable"">',
        //pre append method
	initialize: function(){
		_.bindAll(this,"selectImage","setImage","init");
		$(this.el).attr('src',this.item.get('src'));	
	},
	//post append messod
	init: function(){
		
		$(this.el).resizable({
			containment: "parent parent" , 
            aspectRatio: true,
			stop: this.onResize,
		});
		
		$(this.el).parent().draggable({
			containment: "parent",
			stop: this.onDragg
		});
		
                  	
		$(this.el).dblclick(this.selectImage);
		this.setButton($(this.el).parent());
	},  

	selectImage: function(ev){
              console.log('selectimage');console.log(this);
              console.log(this.setImage);
    	var picker = new Picker(this.setImage);
    	picker.pickImage(ev);
	},

	setImage: function(img){
		this.item.set('src' , img.src);
    	$(this.el).attr('src',img.src);

    	var destHeight = this.content.offset().top + this.content.height() - $(this.el).offset().top;
    	if(destHeight < img.height ){
        	console.log('modefy height');
        	img.width =  img.width * destHeight / img.height;
        	img.height = destHeight;
    	}
    	var destWidth = this.content.offset().left + this.content.width() - $(this.el).offset().left;
    	if(destWidth < img.width ){
         // this should just this jyunjyo
        	console.log('modefy height');
        	img.height =  img.height * destWidth / img.width;
        	img.width = destWidth;
    	}
        // tmp
        $(this.el).parent().width(img.width).height(img.height);
   
    	$(this.el).height(img.height).width(img.width);

    	this.item.set('width' , img.width);
    	this.item.set('height' , img.height);
   	},  

});
