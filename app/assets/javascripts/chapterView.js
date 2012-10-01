ChapterView = Backbone.View.extend({
  //el : '#content',
  className : 'chapter' ,
  isLoaded: false,
  isDisplayed: false,

  initialize: function(options){
    _.bindAll(this,
              "render",
              "addEntry",
              "addAll",
              "addOne",
              "onLoad",
              "onScroll",
              "displayed",
              "onChange",
              "onSortStart",
              "onSortStop",
              "saveTitle",
              "saveDescription",
              "backgroundSelect",
              "bgmSelect");
    this.model.bind("change", this.render);
    this.model.entries.bind('add', this.addOne);
    this.model.entries.bind('refresh', this.addAll);
    this.model.entries.bind('change', this.onChange);

  },
  onLoad: function(){
    this.isLoaded = true;
    var template = _.template( $("#chapter_template").html(),this.model.attributes);
    //console.log(template);
    $(template).appendTo(this.el);

    var _self = this;

    $('.title',this.el).dblclick( function(){ editableTextarea(this,_self.saveTitle); });
    $('.description',this.el).dblclick( function(){ editableTextarea(this,_self.saveDescription); });
    
    $('.background_select',this.el).change( function(){ _self.backgroundSelect( $(this).val() );} );

    this.initBackgroundList();

    $('.bgm_select',this.el).change( function(){ _self.bgmSelect( $(this).val() );} );
    
    $(window).scroll(this.onScroll);

    this.render();
    return this;
  },

  displayed: function(){
    //console.log('isDisplayed');
    //console.log(this);
    $('#background')[0].src = Config.prototype.background_idtourl(this.model.get('chapter_background_id'));
    this.playMusicById(this.model.get('chapter_music_id')); 
    return this;
  },

  onScroll: function(){ 
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    //console.log(this.isDisplayed);
    if( $(this.el).offset().top < scroll
        && scroll < $(this.el).offset().top + $(this.el).height() )
    {
      if(this.isDisplayed == false){
        this.isDisplayed = true;
        this.displayed();
      }
    } else if(this.isDisplayed) {
      this.isDisplayed = false;
    }
    return this;
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
    if(this.isLoaded){
      console.log("chapter render");

      $('.title .text',this.el).html(this.model.get('title'));
      $('.description .text',this.el).html(this.model.get('description'));

      this.addAll();
      $('.entryList',this.el).sortable({
        start: this.onSortStart,
        stop: this.onSortStop
      });

      if(this.isDisplayed) { 
        $('#background')[0].src = Config.prototype.background_idtourl(this.model.get('chapter_background_id'));
      }
      $('.background_select',this.el).find('option[value=' + this.model.get('chapter_background_id') + ']').prop('selected', true);

      $('.bgm_select',this.el).find('option[value=' + this.model.get('chapter_sound_id') + ']').prop('selected', true);

      this.playMusicById(this.model.get('chapter_sound_id'));
    }
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

  backgroundSelect: function(val){
    console.log('change bg');
    this.model.set('chapter_background_id',val);
    this.model.save();
    $('#background')[0].src = Config.prototype.background_idtourl(val);
  },

  initBackgroundList: function(){
    //  console.log('init list');
    var x = 3;
    for(var i=0; i < x; i++){
      var op = $('<option>').attr({ value: i }).text(i);
      $('.background_select',this.el).append(op);
      console.log(i);
    }
  },

  bgmSelect: function(bgm_id){
    this.model.set('chapter_sound_id',bgm_id);
    this.model.save();
    this.playMusicById(bgm_id);
  },

  playMusicById: function(music_id) {
      if (+music_id > 0) {
          window.musicPlayer.playURL(Config.prototype.music_id_to_url(music_id));
      } else {
          window.musicPlayer.stop();
      }
  }
});
