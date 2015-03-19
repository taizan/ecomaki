//= require ../../callbackControle.js

MakerNovelView = Backbone.View.extend({
  
  className: 'maker_novel',	

  events: {},

  initialize: function(){},

  appendTo: function(target) {
    $(this.el).appendTo(target);

    titleView = new textView({model: this.model , attrName: 'title' });

    $(this.el).append("Title:");
    titleView.appendTo(this.el);

    for(var i = 0; i < this.model.chapters.length; i++){
      var chapter = this.model.chapters.at(i);
      for(var j = 0; j < chapter.entries.length; j++){
        var entry =  chapter.entries.at(j);
        var itemList = []; 
        var offset = 10;
        var entryWidth = 0;

        for(var m = 0; m < entry.characters.length; m++){
          view = new imageView({model: entry.characters.at(m)});
          itemList.push(view);
        }
        for(var n = 0; n < entry.balloons.length; n++){
          view = new textView({model: entry.balloons.at(n) , attrName: 'content' });
          $(view.el).addClass("maker_balloon");
          itemList.push(view);
        }

        var entry = $('<div class="maker_entry"></div>').appendTo(this.el);

        itemList.sort( function(a,b){ return a.model.get('left') - b.model.get('left') } );
        for(var k = 0 ; k < itemList.length; k++){
          itemList[k].appendTo( entry );
          console.log($(itemList[k].el).width());
          entryWidth += $(itemList[k].el).width() + offset;
        }
        $(entry).width(entryWidth);
        $(this.el).append("<hr/>");
      }
    }
  },

  // copy attrs to target model and save it
  copyTo: function(model , callback){
    // ake  callbakc listener class to wait all callback is called
    var listener = new CallbackListener( callback );
    copy_model = model;
    console.log(model);

    model.save( 'title' , this.model.get('title') ,{  success: listener.set() });
    //model.save( this.model.attributes , { success: listener.set() } );
    for(var i = 0; i < this.model.chapters.length; i++){
      var chapter = this.model.chapters.at(i);
      //model.chapters.at(i).save ( chapter.attributes , { success: listener.set() } );
      for(var j = 0; j < chapter.entries.length; j++){
        var entry =  chapter.entries.at(j);
        //model.chapters.at(i).entries.at(j).save( entry.attributes , { success: listener.set() } );
        for(var m = 0; m < entry.characters.length; m++){
          //model.chapters.at(i).entries.at(j).characters.at(m)
          //  .save( entry.characters.at(m).attributes , { success: listener.set() } );
        }
        for(var n = 0; n < entry.balloons.length; n++){
          var balloon = entry.balloons.at(n);
          model.chapters.at(i).entries.at(j).balloons.at(n)
            .save( { 
                  content:   balloon.get('content'),
                  font_size: balloon.get('font_size'),
                  width:     balloon.get('width'),
                  height:    balloon.get('height'),
                  top:    balloon.get('top'),
                  left:    balloon.get('left'),
                },
              
                { success: listener.set() }
              );
        }

      }
    }

    listener.start();
    //model.save();
 
  }

});

textView = Backbone.View.extend ({
  tagName: "textarea",
  className: 'maker_text',

  initialize: function( option ) {
    _.bindAll(this,'saveText','editStart','render');
    this.attrName = option.attrName;
    this.isEditing= false,
    this.countOrigin = this.countText( this.model.get("content") );
    this.countOrigin.fontSize = this.model.get("font_size");
    this.countOrigin.width  = this.model.get("width") ;
    this.countOrigin.widthOffset  = this.model.get("width") - this.countOrigin.fontSize * this.countOrigin.row;
    this.countOrigin.height = this.model.get("height");
    this.countOrigin.heightOffset = this.model.get("height")  - this.countOrigin.fontSize * 1.5 * this.countOrigin.col;

    console.log( this.countOrigin.fontSize +" "+ this.countOrigin.row + " " + this.countOrigin.col);
  },
  
  appendTo: function(target) {
    $(this.el)
      .appendTo(target)
      .bind('input',this.editStart)
      .blur(this.saveText);
    this.render();
  },
  
  editStart: function(){
    if ( this.isEditing  == false){
      this.isEditing = true;
    }
  },

  saveText: function() {
    if( this.isEditing  == true ){
      var txt = Config.prototype.escapeTextarea( $(this.el) );
      //もっといい書き方があるはず
      if ( this.attrName == "title" ) this.model.set({title:txt});

      if ( this.attrName == "content" ) {
        this.model.set({content:txt});
        var count = this.countText( txt );
        var r_x = count.row / this.countOrigin.row;
        var r_y = count.col / this.countOrigin.col;
        var r_max = r_x > r_y ? r_x : r_y;
        var r = Math.sqrt(r_max);
        var r1 = r/1.1;
        var r2 = r*1.1;

        var w =  this.countOrigin.widthOffset  + (this.countOrigin.width  - this.countOrigin.widthOffset) * (r_x / r2 );
        var h =  this.countOrigin.heightOffset + (this.countOrigin.height - this.countOrigin.heightOffset) * (r_y / r2 );
        var top  = this.model.get("top")  -  (this.countOrigin.height - h )/2;
        var left = this.model.get("left") -  (this.countOrigin.width - w )/2;

        this.model.set({
          font_size : this.countOrigin.fontSize / r1, 
          top : top, left : left, 
          width : w, height : h 
        });
      }
      this.isEditing = false;
    }
  },

  countText: function(text){
    var out = { col:1 , row:1 };
    if( text ){
      var list = text.split("\n");
      out.col = list.length;
      for( var i=0; i< list.length; i++ ){
        if ( out.row < list[i].length )
          out.row = list[i].length;
      }
    }
    return out;
  },
 

  render: function() {
    $(this.el).html(this.model.get( this.attrName));
    console.log( this.attrName + ":"+ this.model.get( this.attrName) );
    console.log( $(this.el).width() );
  },


  resizeTextarea: function() {
    // textareaの値を取得
    var textarea_val = this.el.val();
    
    // 改行文字の取得
    var match_str = textarea_val.match(/\n/g);
    // 行数の設定
    if (match_str) {
      textarea_obj.attr("rows", match_str.length + 2);
    } else {
    // 最低2行確保
      textarea_obj.attr("rows", "2");
    }
  }, 

});

imageView = Backbone.View.extend ({
  tagName: "div",
  className: "maker_character",

  initialize: function() {
    _.bindAll(this,'render');
  },

  appendTo: function(target) {
    $(this.el).appendTo(target);
    $(this.el).append($("<img>"));
    this.render();
  },

  render: function() {
    var url = config.character_image_idtourl( this.model.get('character_image_id') );
    $("img" ,this.el).attr('src', url );
  },


});
