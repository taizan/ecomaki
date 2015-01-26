var EntryBalloon = Backbone.Model.extend({
  initialize: function() {
    if(this.collection){
      this.set({
          novel_id: this.collection.novel_id, 
          chapter_id: this.collection.chapter_id, 
          entry_id: this.collection.entry_id()}
        );
      this.root = this.collection.root;
    }
  },

  url: function() {
    var novel = this.collection.entry.collection.chapter.collection.novel;
    var base;
    if (novel.has('password')) {
      base = this.root + '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/balloons';
    } else {
      base = this.root +'/novels/' + this.get('novel_id') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/balloons';
    }

    if (this.isNew()) {
      return base;
    } else {
      return base + '/' + this.id + '.json';
    }
  },

  addTo: function(collection , callback ) {
    var self = this;
    this.collection = collection;
    this.initialize();
    var o = this.collection.add(this,{silent: true}); 
    this.save({},{ success:function(){if(callback)callback()} } );
    return o;
  }

});

var EntryCharacter = Backbone.Model.extend({
  initialize: function() {
    if(this.collection){
      this.set({
          novel_id: this.collection.novel_id, 
          chapter_id: this.collection.chapter_id, 
          entry_id: this.collection.entry_id()}
        );
      this.root = this.collection.root;
    }
  },
  url: function() {
    var novel = this.collection.entry.collection.chapter.collection.novel;
    var base;
    if (novel.has('password')) {
      base = this.root + '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/characters';
    } else {
      base = this.root + '/novels/' + this.get('novel_id') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/characters';
    }

    if (this.isNew()) {
      return base;
    } else {
      return base + '/' + this.id + '.json';
    }
  },
  
  addTo: function(collection , callback) {
    var self = this;
    this.collection = collection;
    this.initialize();
    var o = this.collection.add(this,{silent: true}); 
    this.save({},{ success:function(){if(callback)callback()} } );
    return o;
  }

});

var EntryBalloonList = Backbone.Collection.extend({
  model: EntryBalloon,

  url: function() {
    var novel = this.entry.collection.chapter.collection.novel;
    if (novel.has('password')) {
      return this.root + '/edit/' + this.novel_id + '/' + novel.get('password') + '/chapters/' + this.chapter_id + '/entries/' + this.entry_id() + '/balloons';
    } else {
      return this.root + "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.entry_id() + "/balloons";
    }
  },

  entry_id: function() {
    return this.entry.id;
  },
  
  addModel: function(model) {
    model.collection = this;
    model.root = this;
    model.initialize();
    //add to collection but not call add event to prevent add view
    var o = this.add(model,{silent: true} );
    model.save();
    return o;
  }

});

var EntryCharacterList = Backbone.Collection.extend({
  model: EntryCharacter,
  url: function() {
    var novel = this.entry.collection.chapter.collection.novel;
    if (novel.has('password')) {
      return this.root + '/edit/' + this.novel_id + '/' + novel.get('password') + '/chapters/' + this.chapter_id + '/entries/' + this.entry_id() + '/characters';
    } else {
      return this.root + "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.entry_id() + "/characters";
    }
  },

  entry_id: function() {
    return this.entry.id;
  },

  addModel: function(model) {
    model.collection = this;
    model.root = this.root;
    model.initialize();
    var o = this.add(model,{silent: true} );
    model.save();
    return o;
  }
});

var Entry = Backbone.Model.extend({
  entryBalloonList: EntryBalloonList,
  entryCharacterList: EntryCharacterList,

  initialize: function(arg) {
     
    //空の場合、配列として初期化しておく
    if( !this.get("character_ids") ){
      this.set("characters",new Array());
    }

    if(this.collection){ // using nocollection entry at index page
      this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id()});    
      this.root = this.collection.root;
    }
    this.id = arg.id;
      
    var balloons = arg.entry_balloon;
    // Create balloons.
    this.balloons = new this.entryBalloonList();
    this.balloons.novel_id = this.get('novel_id');
    this.balloons.chapter_id = this.get('chapter_id');
    this.balloons.entry = this;
    this.balloons.root = this.root;
    if (balloons && balloons.length > 0) {
      this.balloons.add(balloons);
    }
      
    var characters = arg.entry_character;
    // Create characters.
    this.characters = new this.entryCharacterList();
    this.characters.novel_id = this.get('novel_id');
    this.characters.chapter_id = this.get('chapter_id');
    this.characters.entry = this;
    this.characters.root = this.root;
    if (characters && characters.length > 0) {
      this.characters.add(characters);
    }
  },

  url: function() {
    if(this.collection)var novel = this.collection.chapter.collection.novel;
    var base = '';
    if (novel && novel.has('password')) {
      base = this.root + '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters/' + this.get('chapter_id') + '/entries';
    } else {
      base = this.root + '/novels/' + this.get('novel_id') + '/chapters/' + this.get('chapter_id') + '/entries';
    }

    if (this.isNew()) {
      return base;
    } else {
      return base + '/' + this.id + '.json';
    }
  },

  dup: function() {
    var new_entry = this.clone();
    var attr = new_entry.attributes;
    
    delete attr.id;
    delete attr.entry_id;
    delete attr.chapter_id;
    delete attr.novel_id;
    delete attr.created_at;
    delete attr.order_number;
    delete attr.updated_at;
    attr.entry_balloon = [];
    attr.entry_character = []; 
    
    for(var i = 0; i < this.balloons.length; i++ ){
      attr.entry_balloon.push( jQuery.extend(true,{},this.balloons.at(i).attributes) );
      delete attr.entry_balloon[i].id;
      delete attr.entry_balloon[i].entry_id;
      delete attr.entry_balloon[i].created_at;
      delete attr.entry_balloon[i].updated_at;
    }
    for(var i = 0; i < this.characters.length; i++){
      attr.entry_character.push( jQuery.extend(true,{},this.characters.at(i).attributes) );
      delete attr.entry_character[i].id;
      delete attr.entry_character[i].entry_id;
      delete attr.entry_character[i].created_at;
      delete attr.entry_character[i].updated_at;
    }
    //console.log(attr);
    return attr; 
  },

  copy: function(){
    //var chapter = this.collection.chapter;
    //var currentIndex =  chapter.entries.indexOf(this);
    var attr = this.dup();
    var entry = this.entries.create_after(
        attr, 
        this.get('order_number')
  // call trigger add in addItem end
  //        { wait:true , success: this.addItems }
      );
    return entry;
  },

  addItems: function(){
    var attr = this.attributes;
    var self = this;

    if( this.balloons ) for(j = 0; j < this.balloons.length; j++ ){
      console.log(this.id);
      this.balloons.at(j).set("entry_id",this.id);
      this.balloons.at(j).save();
    }
    if ( this.characters ) for(j = 0; j < this.characters.length; j++){
      this.characters.at(j).set("entry_id",this.id);
      this.characters.at(j).save();
    }
  }


    });


var EntryList = Backbone.Collection.extend({
  model: Entry,
  url: function() {
    var novel = this.chapter.collection.novel;
    if (novel && novel.has('password')) {
      return this.root + '/edit/' + this.novel_id + '/' + novel.get('password') + '/chapters/' + this.chapter_id() + '/entries';
    } else {
      return this.root + "/novels/" + this.novel_id + "/chapters/" + this.chapter_id() + "/entries";    
    }
  },

  chapter_id: function() {
    return this.chapter.id;
  },

  create: function(attributes, options) {
    if (typeof attributes.order_number === "undefined") {
      attributes.order_number = this.length;
    }
    var self = this;
    var onCreate = function(entry){  
      //console.log(arguments);
      entry.addItems();
      self.save();
      if(options.callback)options.callback();
    }
    options = $.extend(options , { wait:true, success: onCreate });
    return Backbone.Collection.prototype.create.call(this, attributes, options);
  },

  // Create model and insert it right after the index-th model.
  // To insert to the top, set index to -1.
  create_after: function(attributes, index, options) {
    // Assume all the order_number is correct.
    attributes.order_number = index+1 ;
    for (var i = index+1 ; i < this.models.length; i++) {
      this.models[i].set('order_number', i + 1);
    }
    return this.create(attributes, options);
  },


  create_entry_from_template: function( type , pos  , option){
    if( !pos ) pos = this.length ;
    var self = this;
    EntryTemplate.prototype.getTemplate(type , function(data){
      self.create_after( data , pos , option);
    });
  },

  comparator: function(entry) {
    return entry.get("order_number");
  },

  // Set order_number and save all models in collection.
  save: function() {
    this.sort();
    for (var i = 0; i < this.models.length; i++) {
      this.models[i].set("order_number", i);
      //console.log("order_number = " + this.models[i].get("order_number"));
      this.models[i].save();
    }
  },


  move_at: function(model, index) {
    // Ensure sorted
    //this.sort();
      
    var cur_index = this.models.indexOf(model);
    //  console.log( cur_index + ',' + index);
    if (index > cur_index) {
      this.models.splice(index+1, 0, model); // Insert
      this.models.splice(cur_index, 1); // Remove
    } else if (index < cur_index) {
      this.models.splice(cur_index, 1);
      this.models.splice(index, 0, model);
    } // If index == cur_index, do nothing.
      
      // Renumbering order_number.
    for (var i=0; i<this.models.length; i++) {
      this.models[i].set("order_number", i);
    }
  }

});

var Chapter = Backbone.Model.extend({
  entrylist: EntryList,

  initialize: function() {
    this.set({novel_id: this.collection.novel_id});
    this.root = this.collection.root;

    // entries
    this.entries = new this.entrylist();
    this.entries.novel_id = this.get('novel_id');
    this.entries.chapter = this;
    this.entries.root = this.root;

    // If new entry object is given, add it.
    if (arguments[0].hasOwnProperty('entry')) {
      this.entries.add(arguments[0].entry);    
    }
  },

  url: function() {
    var novel = this.collection.novel;
    var base = '';
    if (novel.has('password')) {
      base = this.root + '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters';
    } else {
      base = this.root + '/novels/' + this.get('novel_id') + '/chapters';
    }

    if (this.isNew()) {
      return base;
    } else {
      return base + '/' + this.id + '.json';
    }
  },

  create_entry: function(attributes,options) {
    options = $.extend(options,{wait:true});
     
    var newEntry =  this.entries.create(attributes,options);
    newEntry.isNewEntry = true; 
    return newEntry;
  },

  destroy_entry: function(models) {
    var models = _.isArray(models) ? models.slice() : [models];
    for (var i=0; i<models.length; i++) {
      // the model will be removed from the collection automatically.
      models[i].destroy();
    }
    return true;
  },


});


var ChapterList = Backbone.Collection.extend({
  model: Chapter,
  url: function() {
    if (this.novel.has('password')) {
      return this.root + "/edit/" + this.novel_id + '/' + this.novel.get('password') + "/chapters";
    } else {
      return this.root + "/novels/" + this.novel_id + "/chapters";
    }
  },

  create: function(attr, options) {
    if (typeof attr.order_number == 'undefined') {
      attr.order_number = this.length;
    }
    options = $.extend(options,{wait:true});
    return Backbone.Collection.prototype.create.call(this, attr, options);
  },

  comparator: function(chapter) {
    return chapter.get('order_number');
  },

  create_after: function(attr, index, options) {
    attr.order_number = index ;
    for (var i = index ; i < this.models.length; i++) {
      this.models[i].set('order_number', i + 1);
      this.models[i].save();
    }
    options = $.extend(options,{wait:true});
    return Backbone.Collection.prototype.create.call(this, attr, options);
  },
  

  move_at: function(model, index) {
    var cur_index = this.models.indexOf(model);
    if (index > cur_index) {
      this.models.splice(index, 0, model);
      this.models.splice(cur_index, 1);
    } else if (index < cur_index) {
      this.models.splice(cur_index, 1);
      this.models.splice(index, 0, model);
    }

    for (var i = 0; i < this.models.length; i++) {
      this.models[i].set('order_number', i);
    }
  }
});


Novel = Backbone.Model.extend({
  chapterlist: ChapterList,

  initialize: function(arg) {
    //空の場合、配列として初期化しておく
    if( !this.get("character_ids") ){
      this.set("characters",new Array());
    }
    if(arg.root){
      this.root = arg.root;
    }else{
      this.root = "";
    }
    
    // Create chapters.
    this.chapters = new this.chapterlist();
    this.chapters.novel_id = this.id;
    this.chapters.novel = this;
    this.chapters.root = this.root;
   

    // Fetch the data from server.
    //this.fetch();
  },
  url: function() {
    if (this.has('password')) {
      return this.root + '/edit/' + this.id + '/' + this.get('password') + '.json';
    } else {
      return this.root + '/novels/' + this.id + '.json';
    }
  },

  // Override 'set' method to create chapters by fetch().
  set: function(key, value, options) {
    var attr, attrs;
    if (_.isObject(key) || key == null) {
      attrs = key;
      options = value;
    } else {
      Backbone.Model.prototype.set.call(this, key, value, options);
      return this;
    }
    for (attr in attrs) {
      var val = attrs[attr];
    
      if (attr == 'chapter') {
        this.chapters.add(val);
      } else {
        Backbone.Model.prototype.set.call(this, attr, val, options);
      }
    }
    return this;
  },
  
  create_chapter: function(options) {
    this.chapters.create({novel_id: this.id}, options);
    return true;
  },
  
  publish: function(callback) {
    this.save( {status:'publish'} , { wait: true , success: callback } );
  },

  dup_as_maker: function(srcModel , callback){
    var newNovel;
    var self = this;
    var url = this.root + "/novels/"+ this.id +"/dup_no_redirect.json"
    var chane = new CallbackChane();

    jQuery.getJSON(
        url,            // リクエストURL^ZQerfvtki
        null,
        chane.next()
      );

    chane.push( function(arg){
        console.log('make model');
        newNovel = new Novel({id: arg[0].id,password: arg[0].password});
        newNovel.fetch({success:chane.next()});
      });

    chane.push( function(){
        console.log('copy make');
        newNovel.override_text(self , chane.next());
      });

    chane.push( function(){
        newNovel.publish( chane.next() );
      });

    chane.push( callback);

  },

  //copy balloon text from same struct tree model
  override_text: function(model , callback){
    // ,ake  callbakc listener class to wait all callback is called
    var listener = new CallbackListener( callback );
    for(var i = 0; i < model.chapters.length; i++){
      var chapter = model.chapters.at(i);
      for(var j = 0; j < chapter.entries.length; j++){
        var entry =  chapter.entries.at(j);
        for(var n = 0; n < entry.balloons.length; n++){
          this.chapters.at(i).entries.at(j).balloons.at(n)
            .save('content' , entry.balloons.at(n).get('content') ,{ success: listener.set() });
        }
      }
    }
  },

});

//Novel のキャッシュ用。　テンプレートのキャッシュなど
NovelLib = Novel.extend({
  url: function() {
    return this.root + '/caches/' + this.id ;
  },
});


