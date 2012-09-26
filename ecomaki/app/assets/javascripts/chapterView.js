ChapterView = Backbone.View.extend({
    //el : '#content',
    className : 'chapter' ,
	header : '<br><br><div class="title"><h2 class="text">chapter title</h2></div><div class="description"><p class="text">des</p></div><div class="entryList">',
	initialize: function(options){
		_.bindAll(this, 
			"render",
			"addEntry",
			"addAll",
			"addOne",
			"onChange",
			"onSortStart",
			"onSortStop",
			"saveTitle",
			"saveDescription");
        	this.model.bind("change", this.render);
        	this.model.entries.bind('add', this.addOne);
        	this.model.entries.bind('refresh', this.addAll);
        	this.model.entries.bind('change', this.onChange);
	
		$(this.header).appendTo(this.el);
		
		var _self = this;
		
		$('.title',this.el).dblclick( function(){ editableTextarea(this,_self.saveTitle)});
		$('.description',this.el).dblclick( function(){ editableTextarea(this,_self.saveDescription)});
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
        console.log("chapter render");

	$('.title .text',this.el).html(this.model.get('title'));
       	$('.description .text',this.el).html(this.model.get('description'));

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
    },

      saveTitle: function(txt){
          this.model.set('title',txt);
	  this.model.save();
      },

      saveDescription: function(txt){
          this.model.set('description',txt);
          this.model.save();
      },

});
