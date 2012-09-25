ChapterView = Backbone.View.extend({
    //el : '#content',
    className : 'chapter' ,
	initialize: function(options){
        this.counter = 0;
	    _.bindAll(this, "render","addEntry","addAll","addOne","onChange","onSortStart","onSortStop");
        this.model.bind("change", this.render);

        this.model.entries.bind('add', this.addOne);
        this.model.entries.bind('refresh', this.addAll);
        this.model.entries.bind('change', this.onChange);
        //	console.log("Current length: " + this.model.entries.length);
	this.model.entries.bind('add', function() {
        //		console.log("entry is changedlength:" + this.model.entries.length);
	});
        //console.log(this.model.entries);
        //console.log(this.model.entries.models);

	chapter = this;
        chapterModel = this.model;

	$('<br><br><h2 class="title editable"></h2><p class="description editable"></p><div class="entryList">').appendTo(this.el);
	$('.title',this.el).text(this.model.get('title'));

        $('.description',this.el).text(this.model.get('description'));


        //this.render();
	},

    addOne: function (item,t,options) {
        //console.log(item);
        var view = new EntryView({model: item , parentView: this});
        $('.entryList' ,this.el).insertAt(options.index,view.render().el);
    },

    addAll: function () {
        //_(this.model.entries.models).each(console.log) ;
        $('.entryList' ,this.el).empty();
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
        $('.entryList',this.el).sortable({
		start: this.onSortStart,
		stop: this.onSortStop
	});
        return this;
    },

    onSortStart: function(e,ui){
	console.log('onsort');
	this.sortItemIndex =  $(ui.item).parent().children().index(ui.item);
	console.log(this.sortItemIndex);
    },

    onSortStop: function(e,ui){
	console.log('onsortstop');
	var i =  $(ui.item).parent().children().index(ui.item);
	console.log(i);
	var entry = this.model.entries.at(this.sortItemIndex);

	console.log(entry);
	this.model.entries.remove(entry);
	this.model.entries.add(entry,{at:i});
	this.model.save();	
	this.model.trigger('change');
	//this.model.fetch();
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
