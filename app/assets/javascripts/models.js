var EntryBalloon = Backbone.Model.extend(
    {
	initialize: function() {
      if(this.collection){
	      this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id, entry_id: this.collection.entry_id()});
	    }
  },
	url: function() {
	    var novel = this.collection.entry.collection.chapter.collection.novel;
	    var base;
	    if (novel.has('password')) {
		base = '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/balloons';
	    } else {
    		base = '/novels/' + this.get('novel_id') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/balloons';
	    }

	    if (this.isNew()) {
		return base;
	    } else {
		return base + '/' + this.id + '.json';
	    }
	}
    });

var EntryCharacter = Backbone.Model.extend(
    {
	initialize: function() {
      if(this.collection){
	      this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id, entry_id: this.collection.entry_id()});
	    }
  },
	url: function() {
	    var novel = this.collection.entry.collection.chapter.collection.novel;
	    var base;
	    if (novel.has('password')) {
		base = '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/characters';
	    } else {
    		base = '/novels/' + this.get('novel_id') + '/chapters/' + this.get('chapter_id') + '/entries/' + this.get('entry_id') + '/characters';
	    }

	    if (this.isNew()) {
		return base;
	    } else {
		return base + '/' + this.id + '.json';
	    }
	}
    });

var EntryBalloonList = Backbone.Collection.extend(
    {
	model: EntryBalloon,
	url: function() {
	    var novel = this.entry.collection.chapter.collection.novel;
	    if (novel.has('password')) {
		return '/edit/' + this.novel_id + '/' + novel.get('password') + '/chapters/' + this.chapter_id + '/entries/' + this.entry_id() + '/balloons';
	    } else {
		return "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.entry_id() + "/balloons";
	    }
	},
	entry_id: function() {
	    return this.entry.id;
	}
    });

var EntryCharacterList = Backbone.Collection.extend(
    {
	model: EntryCharacter,
	url: function() {
	    var novel = this.entry.collection.chapter.collection.novel;
	    if (novel.has('password')) {
		return '/edit/' + this.novel_id + '/' + novel.get('password') + '/chapters/' + this.chapter_id + '/entries/' + this.entry_id() + '/characters';
	    } else {
		return "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.entry_id() + "/characters";
	    }
	},
	entry_id: function() {
	    return this.entry.id;
	}
    });

var Entry = Backbone.Model.extend(
    {
	entryBalloonList: EntryBalloonList,
	entryCharacterList: EntryCharacterList,
	initialize: function() {
	    var balloons = arguments[0].entry_balloon;
	    var characters = arguments[0].entry_character;
	    
	    this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id()});
	    this.id = arguments[0].id;
	    
	    // Create balloons.
	    this.balloons = new this.entryBalloonList();
	    this.balloons.novel_id = this.get('novel_id');
	    this.balloons.chapter_id = this.get('chapter_id');
	    this.balloons.entry = this;
	    if (balloons && balloons.length > 0) {
		this.balloons.add(balloons);
	    }
	    
	    // Create characters.
	    this.characters = new this.entryCharacterList();
	    this.characters.novel_id = this.get('novel_id');
	    this.characters.chapter_id = this.get('chapter_id');
	    this.characters.entry = this;
	    if (characters && characters.length > 0) {
		this.characters.add(characters);
	    }
	},
	url: function() {
	    var novel = this.collection.chapter.collection.novel;
	    var base = '';
	    if (novel.has('password')) {
		base = '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters/' + this.get('chapter_id') + '/entries';
	    } else {
		base = '/novels/' + this.get('novel_id') + '/chapters/' + this.get('chapter_id') + '/entries';
	    }

	    if (this.isNew()) {
		return base;
	    } else {
		return base + '/' + this.id + '.json';
	    }
	}
    });


var EntryList = Backbone.Collection.extend(
    {
	model: Entry,
	url: function() {
	    var novel = this.chapter.collection.novel;
	    if (novel.has('password')) {
		return '/edit/' + this.novel_id + '/' + novel.get('password') + '/chapters/' + this.chapter_id() + '/entries';
	    } else {
		return "/novels/" + this.novel_id + "/chapters/" + this.chapter_id() + "/entries";		
	    }
	},
	chapter_id: function() {
	    return this.chapter.id;
	},
	create: function(attributes, options) {
	    if (typeof attributes.order_number === "undefined") {
		attributes.order_number = this.length;
	    }
	    return Backbone.Collection.prototype.create.call(this, attributes, options);
	},
	comparator: function(entry) {
	    return entry.get("order_number");
	},
	// Set order_number and save all models in collection.
	save: function() {
	    this.sort();
	    for (var i = 0; i < this.models.length; i++) {
		this.models[i].set("order_number", i);
		console.log("order_number = " + this.models[i].get("order_number"));
		this.models[i].save();
	    }
	},
	// Create model and insert it right after the index-th model.
	create_after: function(attributes, index, options) {
	    // Assume all the order_number is correct.
	    attributes.order_number = index + 1;
	    for (var i = index + 1; i < this.models.length; i++) {
		this.models[i].set('order_number', i + 1);
		this.models[i].save();
	    }

	    return Backbone.Collection.prototype.create.call(this, attributes, options);
	},
	move_at: function(model, index) {
	    // Ensure sorted
	    //this.sort();
	    
	    var cur_index = this.models.indexOf(model);
	    if (index > cur_index) {
		this.models.splice(index, 0, model); // Insert
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

var Chapter = Backbone.Model.extend(
    {
	entrylist: EntryList,
	initialize: function() {
	    this.set({novel_id: this.collection.novel_id});
	    
	    // entries
	    this.entries = new this.entrylist();
	    this.entries.novel_id = this.get('novel_id');
	    this.entries.chapter = this;
	    this.entries.add(arguments[0].entry);
	},
	url: function() {
	    var novel = this.collection.novel;
	    var base = '';
	    if (novel.has('password')) {
		base = '/edit/' + this.get('novel_id') + '/' + novel.get('password') + '/chapters';
	    } else {
		base = '/novels/' + this.get('novel_id') + '/chapters';
	    }

	    if (this.isNew()) {
		return base;
	    } else {
		return base + '/' + this.id + '.json';
	    }
	},
	create_entry: function(attributes,option) {
	    return this.entries.create(attributes,option);
	},
	destroy_entry: function(models) {
	    models = _.isArray(models) ? models.slice() : [models];
	    for (var i=0; i<models.length; i++) {
		// the model will be removed from the collection automatically.
		models[i].destroy();
	    }
	    return true;
	}
    });


var ChapterList = Backbone.Collection.extend(
    {
	model: Chapter,
	url: function() {
	    if (this.novel.has('password')) {
		return "/edit/" + this.novel_id + '/' + this.novel.get('password') + "/chapters";
	    } else {
		return "/novels/" + this.novel_id + "/chapters";
	    }
	},
	create: function(attr, options) {
	    if (typeof attr.order_number == 'undefined') {
		attr.order_number = this.length;
	    }
	    return Backbone.Collection.prototype.create.call(this, attr, options);
	},
	comparator: function(chapter) {
	    return chapter.get('order_number');
	},
	create_after: function(attr, index, options) {
	    attr.order_number = index + 1;
	    for (var i = index + 1; i < this.models.length; i++) {
		this.models[i].set('order_number', i + 1);
		this.models[i].save();
	    }

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


Novel = Backbone.Model.extend(
    {
	chapterlist: ChapterList,
	initialize: function() {
	    // Create chapters.
	    this.chapters = new this.chapterlist();
	    this.chapters.novel_id = this.id;
	    this.chapters.novel = this;
	    
	    // Fetch the data from server.
	    this.fetch();
	},
	url: function() {
	    if (this.has('password')) {
		return '/edit/' + this.id + '/' + this.get('password') + '.json';
	    } else {
		return '/novels/' + this.id + '.json';
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
	}
    });
