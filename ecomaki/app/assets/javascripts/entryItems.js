//= require jquery.jStageAligner
//position obj is there some nomal one?
var Pos = function(atop,aleft,awidth,aheight){
  this.top = atop;
  this.left = aleft;
  this.width = awhidth;
  this.height = aheight;
}

//the character speack baloon
var BaloonItem = function(aitem,aview){
  //TODO remove tag or function
  this.view = aview;
  this.item = aitem;
  this.content = this.view.content;
  this._self = this;
  this.str = this.item.text;
  this.pos = this.item.pos;
  
  this.initialize.apply(this, arguments);   
}

BaloonItem.prototype = {
  initialize: function(){
     console.log("init");
     _.bindAll(this,"editText",'onResize','onDragg');
  },
 
  body: function(){
    return '<div class="item baloon sticky"><div class="text">' + this.str + '</div></div>';
  },

  deletIconBody: '<i class="icon-remove-sign">',
  
  appendTo: function(target){
    this.newBaloon = $(this.body());
    this.newBaloon.appendTo(target);
    this.init();
  },

  init: function(){

    this.newBaloon.draggable({
        containment: "parent",
        stop: this.onDragg
    })
    .css({position: 'absolute'})
    .css(this.pos)
    .width(this.pos.width)
    .height(this.pos.height);

    // move to css
    this.newBaloon.find(".text").css({'margin': '10px'});

    this.newBaloon.resizable({
        containment: "parent",
 	stop: this.onResize
    })

    this.newBaloon.dblclick(this.editText);

    hideButton(this.newBaloon,this.item);
  },

  onDragg: function(event,ui){
    console.log(event.target);
    console.log(this.content);
    this.pos.top = $(this.newBaloon).offset().top - this.content.offset().top;
    this.pos.left = $(this.newBaloon).offset().left - this.content.offset().left;
  },

  onResize: function(event,ui){
    // console.log(this);
    // console.log(this.pos);
    // console.log(event);
     this.pos.width = $(this.newBaloon).width();
     this.pos.height = $(this.newBaloon).height(); 
  },

  editText: function(){
       var text = this.item.text.split("<br>").join('\n');
       text = text.replace(/&amp;/g,"&");
       text = text.replace(/&quot;/g,"/");
       text = text.replace(/&#039;/g,"'");
       text = text.replace(/&lt;/g,"<");
       text = text.replace(/&gt;/g,">");

       var item = this.item;
       var target = this.newBaloon;
      
       focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
                .height( item.pos.height )
                .width ( item.pos.width )
                .css({position: 'absolute', left:-5 ,top: -5});

      focusedText.appendTo(this.newBaloon)
                .focus()
                .select()
                .val(text)
                .blur(function() {
                        console.log(target);
                        var txt = $(this).val();

                        $('.text',target).text(txt);
                        txt = $('.text',target).html().split('\n').join('<br>') ;
                        //console.log(txt);
                        $('.text',target).html(txt);
			
                        item.text = txt;
                        
                        $(this).remove();
                 });        

  },
  editTextArea : function(){

        $('item_button',this).hide();

        // replace <br> with \n
        var text = $(".text",this).html().split("<br>").join('\n');
        // replace ecape sequence
        text = text.replace(/&amp;/g,"&");
        text = text.replace(/&quot;/g,"/");
        text = text.replace(/&#039;/g,"'");
        text = text.replace(/&lt;/g,"<");
        text = text.replace(/&gt;/g,">");
            
        var targetText = this;
        //$(targetText).hide();

        focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
                .height( $(this).height() )
                .width ( $(this).width() )
                .css({position: 'absolute', left:-5 ,top: -5});

        focusedText.appendTo(this)
                .focus()
                .select()
                .val(text)
                .blur(function() {
                        console.log(targetText);
                        var txt = $(this).val();
                        $('.text',targetText).text(txt);
                        txt = $('.text',targetText).html().split('\n').join('<br>') ;
			console.log(txt);
                        $('.text',targetText).html(txt);
                        $(this).remove();
                        //$(targetText).show();
                });
     }
}

var ImageItem = function(aitem,aview){
  //TODO remove tag or function  i
  this.view = aview;
  this.item = aitem;
  this.content = this.view.content;
  this.src = this.item.src;
  this.pos = this.item.pos;
  this.initialize.apply(this,arguments);
}

ImageItem.prototype = {
  initialize: function(){
     _.bindAll(this,"setImage","selectImage","onResize","onDragg");
  },

  body: '<img class="Image item"></img>',
 
  appendTo:function(target){
    this.newImage = $(this.body);
    this.newImage.appendTo(target);
    this.init();

  },
  init: function(){
    this.newImage
      .attr({src: this.src})
      .css({position: "absolute",top: 0,left: 0, zIndex: 1 })
      .css(this.pos)
      .width(this.pos.width)
      .height(this.pos.height);
    this.newImage.resizable(
            {
               containment: "parent parent" , 
               aspectRatio: true,
               stop: this.onResize
            }
         )
    this.newImage.parent().draggable({
           containment: "parent",
           stop: this.onDragg
        })
        .dblclick(this.selectImage);
    hideButton(this.newImage.parent(),this.item);
    

    //this.newImage.parent().addClass('item');

  }, 
  
  selectImage: function(ev){
     var picker = new Picker(this.setImage);
     picker.pickImage(ev);
  },

  setImage: function(img){
    console.log('setimage:');

    this.item.src = img.src;
    this.newImage.attr('src',img.src);
    

    var destHeight = this.content.offset().top + this.content.height() - this.newImage.offset().top;
    if(destHeight < img.height ){
        console.log('modefy height');
        img.width =  img.width * destHeight / img.height;
        img.height = destHeight;
    }
    var destWidth = this.content.offset().left + this.content.width() - this.newImage.offset().left;
    if(destWidth < img.width ){
         // this should just this jyunjyo
        console.log('modefy height');
        img.height =  img.height * destWidth / img.width;
        img.width = destWidth;
    }

    // tmp
    this.newImage.parent().width(img.width).height(img.height);
   
    this.newImage.height(img.height);
    this.newImage.width(img.width);

    this.pos.width = img.width;
    this.pos.height = img.height;
   
  },  

  onDragg: function(event,ui){
     this.pos.top = $(this.newImage).offset().top - $(this.content).offset().top;
     this.pos.left = $(this.newImage).offset().left - $(this.content).offset().left;
  },
  
  onResize: function(event,ui){
     console.log(event.target);
     this.pos.width = $(this.newImage).width();
     this.pos.height = $(this.newImage).height();
  }
}

function  hideButton(target, item){
      var body = '<i class="icon-remove-sign item-button item-remove" />';
      var button = $(body);
      button.appendTo(target);
      button.hide();
      

      $('.item-remove',target).click(
            function(){
                   console.log(target);
                   $('.item',target).remove(); 
                   target.remove();
                   item.remove();             
            }
         );
      
      target
        .mouseover(function(){
            button.show();
        })
        .mouseout(function(){
            button.hide();
        });

   }

