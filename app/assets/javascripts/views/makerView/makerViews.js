//= require ../../callbackControle.js

MakerNovelView = Backbone.View.extend({
  
  className: 'maker_novel',	

  events: {
  },

  initialize: function(){
   
    //$(this.el)
    //  .append(this.model.get('title'))
    //  .append(this.model.get('description'))
    //  .append(this.model.get('author_name'));
    
  },

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
          model.chapters.at(i).entries.at(j).balloons.at(n)
            .save('content' , entry.balloons.at(n).get('content') ,{ success: listener.set() });
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
  isEditing: false,

  initialize: function( option ) {
    _.bindAll(this,'saveText','editStart','render');
    this.attrName = option.attrName;
  },
  
  appendTo: function(target) {
    $(this.el)
      .appendTo(target)
      .bind('input',this.editStart)
      .blur(this.saveText);
    this.render();
  },
  
  editStart: function(){
    console.log(this.isEditing);
    if ( this.isEditing  == false){
      this.isEditing = true;
    }
  },

  saveText: function() {
    if( this.isEditing  == true ){
      var txt = Config.prototype.escapeTextarea( $(this.el) );
      console.log(txt);
      //もっといい書き方があるはず
      if ( this.attrName == "content" ) this.model.set({content:txt});
      if ( this.attrName == "title" ) this.model.set({title:txt});
      this.isEditing = false;
    }
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
