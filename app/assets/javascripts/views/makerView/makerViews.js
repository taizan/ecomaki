//= require ../../callbackControle.js

MakerNovelView = Backbone.View.extend({
  
  className: 'maker_novel',	

  events: {
  },

  initialize: function(){
    for(var i = 0; i < this.model.chapters.length; i++){
      var chapter = this.model.chapters.at(i);
      for(var j = 0; j < chapter.entries.length; j++){
        var entry =  chapter.entries.at(j);
        var itemList = []; 
        for(var m = 0; m < entry.characters.length; m++){
          view = new imageView({model: entry.characters.at(m)});
          itemList.push(view);
          //view.appendTo(this.el);
        }
        for(var n = 0; n < entry.balloons.length; n++){
          view = new textView({model: entry.balloons.at(n)});
          itemList.push(view);
        }

        itemList.sort( function(a,b){ return a.model.get('left') - b.model.get('left') } );
        for(var k = 0 ; k < itemList.length; k++){
          itemList[k].appendTo(this.el);
        }

        $('<br>').appendTo(this.el);
      }
    }
  },

  appendTo: function(target) {
    $(this.el).appendTo(target);
  },

  // copy attrs to target model and save it
  copyTo: function(model , callback){

    // ake  callbakc listener class to wait all callback is called
    var listener = new CallbackListener( callback );
    console.log(model);
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

  initialize: function() {
    _.bindAll(this,'saveText','render');
  },
  
  appendTo: function(target) {
    $(this.el)
      .appendTo(target)
      .bind('input',this.saveText);
    this.render();
  },

  saveText: function() {
    var txt = Config.prototype.escapeText( $(this.el).val() );
    console.log(txt);
    this.model.set({content:txt});
  },
 

  render: function() {
    $(this.el).html(this.model.get('content'));
  },

});

imageView = Backbone.View.extend ({
  tagName: "img",
  className: "maker_character",

  initialize: function() {
    _.bindAll(this,'render');
  },

  appendTo: function(target) {
    $(this.el)
      .appendTo(target);
    this.render();
  },

  render: function() {
    $(this.el).attr('src', config.character_image_idtourl( this.model.get('character_image_id') ) );
  },


});
