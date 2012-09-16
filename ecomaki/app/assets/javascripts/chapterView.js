ChapterView = Backbone.View.extend({
    //el : '#content',
    className : 'chapter' ,
	initialize: function(options){
        this.counter = 0;
	    _.bindAll(this, "render","addEntry","addAll","addOne","onChange");
        this.model.bind("change", this.render);

        this.model.entries.bind('add', this.addOne);
        this.model.entries.bind('refresh', this.addAll);
        this.model.entries.bind('change', this.onChange);
        //	console.log("Current length: " + this.model.entries.length);
	this.model.entries.bind('add', function() {
        //		console.log("entry is changedlength:" + this.model.entries.length);
	});
        //console.log(this.model.entries);
        console.log(this.model.entries.models);
	chapter = this;
        chapterModel = this.model;
        this.render();
	},

    addOne: function (item,t,options) {
        //console.log(item);
        var view = new EntryView({model: item , parentView: this});
        $(this.el).insertAt(options.index,view.render().el);
    },

    addAll: function () {
        //_(this.model.entries.models).each(console.log) ;
        $(this.el).empty();
 	    //console.log(this.model.entries.models);
        _(this.model.entries.models).each(this.addOne);
    },

    onChange: function(){
        //console.log("onchange");
    },

    events: {
	    "keypress #inputform" : "onKeyPress",    	
	    "click .entry" : "click"
    },

    render: function(){
        console.log("render");
        this.addAll();
        $(this.el).sortable();
        return this;
    },

    click: function(){
        // console.log("chapter click");
    },
    

    addEntry: function(entry){
      	return this;
    },

    onKeyPress: function (e){
        console.log("onkeypress");
        alert(e.whitch );
    	if(e.which == 13){
	         $('#inputform').val("");   
	    }
    }

});
