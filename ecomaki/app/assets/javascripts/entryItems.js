//= require jquery.jStageAligner
//position obj is there some nomal one?
var Pos = function(atop,aleft,awidth,aheight){
  this.top = atop;
  this.left = aleft;
  this.width = awhidth;
  this.height = aheight;
}

//the character speack baloon
var BaloonItem = function(aview,astr,apos){
  //TODO remove tag or function
  this.view = aview;
  this.content = this.view.content;
  this._self = this;
  this.str = astr;
  this.pos = apos;
}

BaloonItem.prototype = {
 
  body: function(){
    return '<div class="baloon-draggable"><div class="sticky baloon-resizable"><div class="text">' + this.str + '</div></div></li>';
  },

  deletIconBody: '<i class="icon-remove-sign">',
  
  appendTo: function(target){
    this.newBaloon = $(this.body());
    this.newBaloon.appendTo(target);
    this.init();
  },

  init: function(){
    this.newBaloon.draggable({
        containment: "parent"
    })
    .css({position: "absolute",top: 0,left: 100 ,zIndex: 1})
    .css(this.pos)
    .width(this.pos.width)
    .height(this.pos.height);

    this.newBaloon.find(".text").css({'margin': '10px'});
    this.newBaloon.find(".baloon-resizable").resizable({
 	stop: this.onResize
    })
    .width(this.pos.width)
    .height(this.pos.height);

    this.newBaloon.find(".baloon-resizable").dblclick(this.editTextArea);
  },
  onResize: function(event,ui){
    //var st = $(event.target).parent();
    var sticky = _self.newBaloon.find('.sticky');
    var draggable = _self.newBaloon.find('.baloon-draggable');
    draggable
        .width(sticky.width())
        .height( sticky.height()); 
    //var ent = st.parent().parent();
    //  if(st.hasClass('baloon-resizable')){
    //     if(st.offset().left + st.width() > ent.offset().left + ent.width() )
    //      {  st.width(ent.offset().left + ent.width() - st.offset().left);}
    //       if(st.offset().top + st.height() > ent.offset().top + ent.height() )
    //       {  st.height(ent.offset().top + ent.height() - st.offset().top);}
    //    st.parent().width(st.width() + 10);
    //    st.parent().height(st.height() + 10);
    //  }
  },

  editTextArea : function(){
        // replace <br> with \n
        var text = $(".text",this).html().split("<br>").join('\n');
        // replace ecape sequence
        text = text.replace(/&amp;/g,"&");
        text = text.replace(/&quot;/g,"/");
        text = text.replace(/&#039;/g,"'");
        text = text.replace(/&lt;/g,"<");
        text = text.replace(/&gt;/g,">");
        
        var targetText = this;
        $(targetText).hide();

        focusedText = $( '<textarea style="text-align:center;" ></textarea>' )
                .height( $(this).height() )
                .width ( $(this).width() );

        focusedText.appendTo($(this).parent())
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
                        $(targetText).show();
                });
     }
}

var ImageItem = function(aview,asrc,apos){
  //TODO remove tag or function  i
  this.view = aview;
  this.content = this.view.content;
  this.src = asrc;
  this.pos = apos;
  this.initialize.apply(this,arguments);
}

ImageItem.prototype = {
  initialize: function(){
     _.bindAll(this,"selectImage");
  },
  body: function(){
    return '<img class="Image" ></img>';
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
            {containment: "parent parent" , aspectRatio: true }
         )
        .parent().draggable({
        containment: "parent"
    }).dblclick(this.selectImage);
  },
  selectImage: function(ev){
     var picker = new Picker(ev.target , this);
     picker.pickImage(ev);
  }
}



