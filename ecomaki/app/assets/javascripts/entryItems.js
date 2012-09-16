//= require jquery.jStageAligner
//position obj is there some nomal one?

var EntryItem = function(item,view){
	this.view = view;
	this.item = item;
	this.content = this.view.content;
	
	this.defaultInitialize.apply(this,arguments);
	
	this.initialize.apply(this,arguments);
	
}

EntryItem.prototype = {
	// for over ride
	initialize: function(){},
	
	// for over ride
	tmpl: '',
	
	defaultInitialize: function(){
		_.bindAll(this,"onResize","onDragg","setElement","setButton","init");
		
		this.$el = $(this.tmpl);
		this.el = $el[0];
		
		this.$el
			.css({position: 'absolute', top: this.item.top, left: this.item.left })
			.width(this.item.width).height(this.item.height);
		
	},

	appendTo: function(target){
		this.$el.appendTo(target);
		this.el = $el[0];
		this.init();
		this.setButton();
	},
	
	init: function(){},
	
	onResize: function(){
		this.item.width = $(this.el).width();
		 this.item.height = $(this.el).height();
	},
	
	onDragg: function(){
		this.item.top = $(this.el).offset().top - $(this.content).offset().top;
		this.item.left = $(this.el).offset().left - $(this.content).offset().left;
	},
	
	setButton: function(){
      var body = '<i class="icon-remove-sign item-button item-remove" />';
      var button = $(body);
      button.appendTo(this.el);
      button.hide();
	  
	  this.el
        .mouseover(function(){
            button.show();
        })
        .mouseout(function(){
            button.hide();
        });
      
	  var target = this.el;
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
	},
	
	init: function(){
		$('.item-draggable',this.$el).draggable({
			containment: "parent",
			stop: this.onDragg
		});
		
		$('.item-resizable',this.$el).resizable({
			containment: "parent",
			stop: this.onResize,
		});
		
		$(this.el).dblclick(this.editText);
	},
	
	editText: function(){
       var text = this.item.text.split("<br>").join('\n');
       text = text
	   			.replace(/&amp;/g,"&")
				.replace(/&quot;/g,"/")
				.replace(/&#039;/g,"'")
				.replace(/&lt;/g,"<")
				.replace(/&gt;/g,">");

       var item = this.item;
       var target = this.el;
      
       focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
                .height( item.height ).width ( item.width )
                .css({position: 'absolute', left:-5 ,top: -5})
				.appendTo(this.el)
                .focus().select()
                .val(text);

      focusedText.blur(function() {
                        var txt = $(this).val();
                        $('.text',target).text(txt);
                        txt = $('.text',target).html().split('\n').join('<br>') ;
                        $('.text',target).html(txt);
                        item.text = txt;
                        $(this).remove();
                 });        
  },
});

ImageItem = EntryItem.extend({
	tmpl: '<img class="item image item-resizable item-draggable"">',
	initiarize: function(){
		_.bindAll(this,"selectImage","seImage");
		
	},
	
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
	},  

	selectImage: function(ev){
    	var picker = new Picker(this.setImage);
    	picker.pickImage(ev);
	},

	setImage: function(img){
		this.item.src = img.src;
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
    //this.newImage.parent().width(img.width).height(img.height);
   
    	$(this.el).height(img.height).width(img.width);

    	this.item.width = img.width;
    	this.item.height = img.height;
   	},  

});
