var EntryBalloon = Backbone.Model.extend({
	initialize: function() {
	    this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id, entry_id: this.collection.entry_id});
	},
    });

var EntryCharacter = Backbone.Model.extend({
	initialize: function() {
	    this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id, entry_id: this.collection.entry_id});
	}
    });

var EntryBalloonList = Backbone.Collection.extend({
	model: EntryBalloon,
	url: function() {
	    return "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.entry_id + "/balloons";
	}

    });

var EntryCharacterList = Backbone.Collection.extend({
	model: EntryCharacter,
	url: function() {
	    return "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.entry_id + "/characters";
	}

    });

var Entry = Backbone.Model.extend({
	entryBalloonList: EntryBalloonList,
	entryCharacterList: EntryCharacterList,
	initialize: function() {
	    var balloons = arguments[0].entry_balloon;
	    var characters = arguments[0].entry_characters;

	    this.set({novel_id: this.collection.novel_id, chapter_id: this.collection.chapter_id});
	    this.id = arguments[0].id;


	    this.balloons = new this.entryBalloonList();
	    this.balloons.novel_id = this.novel_id;
	    this.balloons.chapter_id = this.chapter_id;
	    this.balloons.entry_id = this.id;
	    this.characters = new this.entryCharacterList();
	    this.characters.novel_id = this.novel_id;
	    this.characters.chapter_id = this.chapter_id;
	    this.characters.entry_id = this.id;

	    this.balloons.add(balloons);
	    this.characters.add(characters);
	},
    });


var EntryList = Backbone.Collection.extend({
	model: Entry,
	url: function() {
	    return "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries";
	}
    });

var Chapter = Backbone.Model.extend({
	entrylist: EntryList,
	initialize: function() {
	    this.set({novel_id: this.collection.novel_id});

	    // entries
	    this.entries = new this.entrylist();
	    this.entries.novel_id = this.get('novel_id');
	    this.entries.chapter_id = this.get('id');
	    this.entries.add(arguments[0].entry);
	},
	create_entry: function(attributes) {
	    //this.entries.create();
	    return true;
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


var ChapterList = Backbone.Collection.extend({
	model: Chapter,
	url: function() {
	    return "/novel/" + this.novel_id + "/chapters"
	}
    });


Novel = Backbone.Model.extend({
	chapterlist: ChapterList,
	initialize: function() {
	    this.url = "/novel/" + this.id + ".json";

	    // Create chapters.
	    this.chapters = new this.chapterlist();
	    this.chapters.novel_id = this.id;

	    // Fetch the data from server.
	    this.fetch();
	},

	// Override 'set' method to create chapters by fetch().
	set: function(key, value, options) {
	    var attr, attrs, options;
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
	},

	create_chapter: function() {
	    this.chapters.create({novel_id: this.id});
	    return true;
	},

	destroy_chapter: function(models) {
	    models = _.isArray(models) ? models.slice() : [models];
	    for (var i=0; i<models.length; i++) {
		this.chapters.remove(models[i]);
		models[i].destroy();
	    }
	    return true;
	}
    });
