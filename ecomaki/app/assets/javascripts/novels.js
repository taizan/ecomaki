
  //Baloon or Picture
	Baloon = Backbone.Model.extend({
		initialize: function() {
		    this.id = arguments[0].id;
		    this.text = arguments[0].text;
		    this.top = arguments[0].top;
		    this.left = arguments[0].left;
		    this.width = arguments[0].width;
		    this.height = arguments[0].height;
		},
	    });

        Picture = Backbone.Model.extend({
		initialize: function() {
                    this.id = arguments[0].id;
                    this.src = arguments[0].src;
                    this.top = arguments[0].top;
                    this.left = arguments[0].left;
                    this.width = arguments[0].width;
                    this.height = arguments[0].height;
                },
            });

     

	var BaloonList = Backbone.Collection.extend({
		model: Baloon
	    });

        var PictureList = Backbone.Collection.extend({
                model: Picture
            });

	 
	Entry = Backbone.Model.extend({
	    baloonlist: BaloonList,
            picturelist: PictureList,
		initialize: function() {
		    this.novel_id = arguments[0].novel_id;
		    this.chapter_id = arguments[0].chapter_id;
		    this.id = arguments[0].id;
		    this.url = "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.id + ".json";
		    this.baloons = new this.baloonlist(null, {});
                    this.pictures = new this.picturelist(null,{});		
		},
	});


	var EntryList = Backbone.Collection.extend({
		model: Entry,
		initialize: function() {
		    this.novel_id = arguments[1].novel_id;
		    this.chapter_id = arguments[1].chapter_id;
		    this.url = "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + ".json";
		    this.fetch();
		}
	    });


	var Chapter = Backbone.Model.extend({
		entrylist: EntryList,
		initialize: function() {
		    var novel_id = arguments[0].novel_id;
		    var id = arguments[0].id;
		    this.entries = new this.entrylist(null, 
				{novel_id: novel_id,
	 				chapter_id: id
				});
		},
	    });


	var ChapterList = Backbone.Collection.extend({
		model: Chapter,
		initialize: function() {
		    this.novel_id = arguments[1].novel_id;
		    this.url = "/novel/" + this.novel_id + "/chapters.json"
		    this.fetch();
		},
	    });


	Novel = Backbone.Model.extend({
		chapterlist: ChapterList,
		initialize: function() {
		    this.url = "/novel/" + this.id + ".json";
		    this.chapters = new this.chapterlist(null, {novel_id: this.id});
		    this.fetch();
		},
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
			    for (v in val) {
				v['novel_id'] = this.id;
			    }
			    this.chapters.add(val);
			} else {
			    Backbone.Model.prototype.set.call(this, attr, val, options);
			}
		    }
		}
	    });




	/*novel = new Novel({
		id: 1
	    });
	*/
       //chapter = new ChapterView( { model: novel.chapters.models[0]} );


	var NovelView = Backbone.View.extend({
		initialize: function() {
		    this.model.bind('change', this.render, this);
		    this.model.bind('destroy', this.render, this);
		},
		render: function() {
			this.chapter = new ChapterView( { model: this.model.chapters.models[0]} );
		}
	    });

