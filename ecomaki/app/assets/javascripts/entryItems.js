//= require jquery.jStageAligner
//position obj is there some nomal one?
var Pos = function(atop,aleft,awidth,aheight){
  this.top = atop;
  this.left = aleft;
  this.width = awhidth;
  this.height = aheight;
}

//the character speack baloon
var BaloonItem = function(aitem,aview,astr,apos){
  //TODO remove tag or function
  this.view = aview;
  this.item = aitem;
  this.content = this.view.content;
  this._self = this;
  this.str = astr;
  this.pos = apos;
  
  this.initialize.apply(this, arguments);   
}

BaloonItem.prototype = {
  initialize: function(){
     console.log("init");
     _.bindAll(this,'onResize','onDragg');
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
 	stop: this.onResize
    })

    this.newBaloon.dblclick(this.editTextArea);

    hideButton(this.newBaloon);
  },

  onDragg: function(event,ui){
    console.log(event.target);
    console.log(this.content);
    this.pos.top = $(event.target).offset().top - this.content.offset().top;
    this.pos.left = $(event.target).offset().left - this.content.offset().left;
  },

  onResize: function(event,ui){
    // console.log(this);
    // console.log(this.pos);
    // console.log(event);
     this.pos.width = $(event.target).parent().width();
     this.pos.height = $(event.target).parent().height(); 
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

var ImageItem = function(aitem,aview,asrc,apos){
  //TODO remove tag or function  i
  this.view = aview;
  this.item = aitem;
  this.content = this.view.content;
  this.src = asrc;
  this.pos = apos;
  this.initialize.apply(this,arguments);
}

ImageItem.prototype = {
  initialize: function(){
     _.bindAll(this,"selectImage","onResize","onDragg");
  },
  body: function(){
    return '<img class="Image item"></img>';
  },
  appendTo:function(target){
    this.newImage = $(this.body());
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
    hideButton(this.newImage.parent());
    

    //this.newImage.parent().addClass('item');

  }, 
  
  selectImage: function(ev){
     var picker = new Picker(ev.target , this);
     picker.pickImage(ev);
  },

  onDragg: function(event,ui){
     this.pos.top = $(event.target).offset().top - $(this.content).offset().top;
     this.pos.left = $(event.target).offset().left - $(this.content).offset().left;
  },
  
  onResize: function(event,ui){
     console.log(event.target);
     this.pos.width = $(this.newImage).width();
     this.pos.height = $(this.newImage).height();
  }
}

function  hideButton(target){
      var body = '<item_button class="btn item-remove"><i class="icon-remove-sign" /></button>';
      var button = $(body);
      button.appendTo(target);
      button.hide();
      
      var _target = target;
      
      $('item-remove',target).click(
            function(){ console.log('item-remove'); target.remove() }
         );
      
      target
        .mouseover(function(){
            button.show();
        })
        .mouseout(function(){
            button.hide();
        });

   }

